from __future__ import annotations

from pathlib import Path
from uuid import uuid4
from typing import Any

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.assistant_engine import build_assistant_reply
from app.benefit_engine import estimate_benefits
from app.db import get_db
from app.loss_engine import ALLOWED_DAMAGE_TYPES, build_next_step
from app.models import CropLossReport, FarmerProfile, UserAccount
from app.schemas import FarmerProfileCreate, FarmerProfileResponse
from app.scheme_engine import find_matching_schemes
from app.weather_engine import get_climate_risk
from app.vision_engine import analyze_crop_leaf, diagnose_symptoms
from app.claims_engine import (
    generate_claim_pack,
    save_claim_intimation,
    get_claim_lifecycle_status,
)
from app.telephony_engine import process_ivr_step, generate_twiml_response
from app.core.config import settings
from app.core.auth import (
    get_current_user,
    get_optional_current_user,
    get_current_farmer_profile,
    get_farmer_or_404,
    require_role,
    require_farmer,
    require_officer,
    require_admin,
    verify_object_ownership,
    require_authenticated_user,
)
from app.core.rate_limit import enforce_rate_limit
from app.event_engine import (
    get_user_notifications,
    mark_notification_as_read,
    dispatch_weather_alert_event,
    dispatch_mandi_price_event,
)
from app.auth_engine import (
    register_user,
    get_all_registered_farmers,
    get_all_admin_users,
    authenticate_user,
    get_admin_dashboard_stats,
    get_all_admin_claims,
    update_claim_status_by_officer,
    add_broadcast_alert,
    get_all_broadcast_alerts,
)
from app.storage_engine import (
    get_cold_storages,
    create_storage_booking,
    get_all_storage_bookings,
    update_storage_booking_status,
)
from app.direct_market_engine import (
    get_factory_contracts,
    create_factory_delivery_pass,
    get_all_delivery_passes,
    update_delivery_pass_status,
)
from app.machinery_engine import (
    get_machinery_rentals,
    create_machinery_booking,
    get_all_machinery_bookings,
    update_machinery_booking_status,
)
from app.seed_verifier_engine import (
    verify_seed_lot,
    file_seed_grievance,
)
from app.khata_engine import (
    get_crop_cost_template,
    calculate_breakeven_cost,
    get_saved_khata_entries,
)
from app.mandi_engine import (
    get_mandi_prices_for_farmer,
    get_mandi_prices_pipeline,
    get_mandi_history,
    get_mandi_comparison,
    get_mandi_trend,
    get_msp_benchmarks,
    create_mandi_price_record,
    update_mandi_price_record,
    soft_delete_mandi_price_record,
    get_all_admin_mandi_records,
)
from app.mandi_ingestion import MandiIngestionService
from app.models import MandiIngestionRun
from app.db_init import log_audit
from app.soil_engine import calculate_fertilizer_plan
from app.recommendation_engine import recommend_crops
from app.location_engine import (
    get_states as lgd_get_states,
    get_districts as lgd_get_districts,
    get_mandals as lgd_get_mandals,
    get_villages as lgd_get_villages,
    search_locations as lgd_search_locations,
    get_location_stats as lgd_get_stats,
)
from app.nearby_engine import get_nearby_infrastructure
from app.input_market_engine import search_agri_products, get_nearby_dealers
from app.harvest_shield_engine import get_harvest_drying_risk

router = APIRouter(prefix="/api/v1")
UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


def validate_image_file(contents: bytes, max_size_bytes: int = 8 * 1024 * 1024) -> str:
    """
    Strict magic-byte image validation.
    Detects JPEG (0xFF 0xD8 0xFF), PNG (0x89 PNG), WebP (RIFF...WEBP).
    Rejects spoofed file extensions, script polyglots, and executable payloads.
    Returns the verified file extension.
    """
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(contents) > max_size_bytes:
        max_mb = max_size_bytes // (1024 * 1024)
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {max_mb} MB.")

    if contents.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    elif contents.startswith(b"\x89PNG"):
        return ".png"
    elif contents[:4] == b"RIFF" and len(contents) >= 12 and contents[8:12] == b"WEBP":
        return ".webp"
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid image format. Only authentic JPEG, PNG, or WebP files are accepted."
        )


def get_or_create_farmer(db: Session, farmer_id: int) -> FarmerProfile:
    """Strict lookup without fallback mock profiles."""
    return get_farmer_or_404(db, farmer_id)


class AssistantRequest(BaseModel):
    farmer_id: int = Field(gt=0)
    question: str = Field(min_length=1, max_length=500)
    language: str = Field(default="English", min_length=2, max_length=20)


@router.get("/farmers/me", response_model=FarmerProfileResponse)
def get_my_farmer_profile(
    current_farmer: FarmerProfile = Depends(get_current_farmer_profile)
):
    """Retrieves the profile of the currently authenticated cultivator."""
    return current_farmer


@router.post("/farmers", response_model=FarmerProfileResponse, status_code=201)
def create_farmer_profile(
    payload: FarmerProfileCreate,
    current_user: UserAccount | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Creates a new agricultural profile and links it to authenticated user if present."""
    data = payload.model_dump()
    if not data.get("mandal"):
        data["mandal"] = data.get("district", "General")
    if not data.get("village"):
        data["village"] = data.get("district", "General")
    if current_user:
        data["user_id"] = current_user.id

    farmer = FarmerProfile(**data)
    db.add(farmer)
    db.commit()
    db.refresh(farmer)

    if current_user and not current_user.farmer_profile_id:
        current_user.farmer_profile_id = farmer.id
        db.commit()

    return farmer


@router.put("/farmers/{farmer_id}", response_model=FarmerProfileResponse)
def update_farmer_profile(
    farmer_id: int,
    payload: FarmerProfileCreate,
    current_user: UserAccount | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Updates farmer profile with BOLA/IDOR protection."""
    farmer = get_farmer_or_404(db, farmer_id, current_user=current_user)
    data = payload.model_dump()
    if not data.get("mandal"):
        data["mandal"] = data.get("district", "General")
    if not data.get("village"):
        data["village"] = data.get("district", "General")
    for key, value in data.items():
        setattr(farmer, key, value)
    db.commit()
    db.refresh(farmer)
    return farmer


@router.get("/farmers/{farmer_id}", response_model=FarmerProfileResponse)
def get_farmer_profile(
    farmer_id: int,
    current_user: UserAccount | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Retrieves farmer profile by ID with authorization verification."""
    return get_farmer_or_404(db, farmer_id, current_user=current_user)



@router.get("/schemes")
def get_schemes(
    state: str = Query(..., min_length=2),
    crop: str = Query(..., min_length=2),
    season: str = Query(..., min_length=2),
):
    return {
        "state": state,
        "crop": crop,
        "season": season,
        "disclaimer": "Matches are guidance only. They do not confirm official eligibility or benefits.",
        "schemes": find_matching_schemes(state=state, crop=crop, season=season),
    }


@router.get("/benefits/estimate")
def get_benefit_estimate(
    state: str = Query(..., min_length=2),
    crop: str = Query(..., min_length=2),
    season: str = Query(..., min_length=2),
    land_area_acres: float = Query(..., gt=0),
):
    return estimate_benefits(
        state=state,
        crop=crop,
        season=season,
        land_area_acres=land_area_acres,
    )


@router.get("/climate/risk")
def get_climate_risk_endpoint(
    state: str = Query(..., min_length=2),
    district: str = Query(..., min_length=2),
    crop: str = Query(..., min_length=2),
    season: str = Query(..., min_length=2),
):
    try:
        return get_climate_risk(state=state, district=district, crop=crop, season=season)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Weather service unavailable: {exc}") from exc


@router.post("/assistant/chat")
def assistant_chat(
    payload: AssistantRequest,
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    farmer = get_farmer_or_404(db, payload.farmer_id, current_user=current_user)

    climate = None
    try:
        climate = get_climate_risk(
            state=farmer.state,
            district=farmer.district,
            crop=farmer.crop,
            season=farmer.season,
        )
    except Exception:
        climate = None

    schemes = find_matching_schemes(
        state=farmer.state,
        crop=farmer.crop,
        season=farmer.season,
    )
    benefits = estimate_benefits(
        state=farmer.state,
        crop=farmer.crop,
        season=farmer.season,
        land_area_acres=farmer.land_area_acres,
    )

    return build_assistant_reply(
        question=payload.question,
        language=payload.language,
        farmer=farmer,
        climate=climate,
        schemes=schemes,
        benefits=benefits,
    )


# -------------------------------------------------------------
# PMFBY Crop Loss Reports & Claim Preparation
# -------------------------------------------------------------

@router.post("/crop-loss", status_code=201, dependencies=[Depends(enforce_rate_limit(10, 60))])
async def create_crop_loss_report(
    crop: str = Form(...),
    damage_type: str = Form(...),
    loss_date: str = Form(...),
    affected_area_acres: float = Form(..., gt=0),
    damage_percent: float = Form(..., ge=0, le=100),
    description: str = Form(..., min_length=5, max_length=2000),
    farmer_id: int | None = Form(default=None),
    evidence: UploadFile | None = File(default=None),
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    # Auto-bind farmer profile to the authenticated user to eliminate client tampering
    if current_user.role == "farmer":
        actual_farmer_id = current_user.farmer_profile_id
        if not actual_farmer_id:
            fp = db.query(FarmerProfile).filter(FarmerProfile.user_id == current_user.id).first()
            if fp:
                actual_farmer_id = fp.id
                current_user.farmer_profile_id = fp.id
                db.commit()
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Cultivator profile not found. Please register your agricultural profile first."
                )
        if farmer_id is not None and farmer_id != actual_farmer_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden: You cannot file a claim for another cultivator."
            )
    else:
        # Officer/Admin may specify farmer_id
        actual_farmer_id = farmer_id or current_user.farmer_profile_id
        if not actual_farmer_id:
            raise HTTPException(
                status_code=400,
                detail="farmer_id is required when filing as an officer or administrator."
            )

    farmer = get_farmer_or_404(db, actual_farmer_id, current_user=current_user)
    if damage_type not in ALLOWED_DAMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported damage type")
    if affected_area_acres > farmer.land_area_acres:
        raise HTTPException(status_code=400, detail="Affected area cannot exceed the farmer profile area")

    saved_filename = None
    if evidence is not None:
        contents = await evidence.read()
        suffix = validate_image_file(contents, max_size_bytes=8 * 1024 * 1024)
        saved_filename = f"loss_{farmer.id}_{uuid4().hex}{suffix}"
        destination = UPLOAD_DIR / saved_filename
        destination.write_bytes(contents)

    report = save_claim_intimation(
        db=db,
        farmer_id=farmer.id,
        crop=crop,
        damage_type=damage_type,
        loss_date=loss_date,
        affected_area_acres=affected_area_acres,
        damage_percent=damage_percent,
        description=description,
        evidence_filename=saved_filename,
    )

    return {
        "id": report.id,
        "reference_number": report.reference_number,
        "farmer_id": report.farmer_id,
        "crop": report.crop,
        "damage_type": report.damage_type,
        "loss_date": report.loss_date,
        "affected_area_acres": report.affected_area_acres,
        "damage_percent": report.damage_percent,
        "description": report.description,
        "evidence_filename": report.evidence_filename,
        "status": report.status,
        "is_within_window": report.is_within_window,
        "reporting_window_hours": report.reporting_window_hours,
        "submitted_at": report.submitted_at,
        "next_step": build_next_step(report.status),
        "disclaimer": "PMFBY Claim Intimation prepared and recorded. Official loss assessment conducted by Agriculture Department.",
    }


@router.get("/crop-loss")
def get_crop_loss_reports(
    farmer_id: int | None = Query(default=None, gt=0),
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    if current_user.role == "farmer":
        actual_farmer_id = current_user.farmer_profile_id
        if not actual_farmer_id:
            fp = db.query(FarmerProfile).filter(FarmerProfile.user_id == current_user.id).first()
            actual_farmer_id = fp.id if fp else None
        if not actual_farmer_id:
            return {"farmer_id": None, "reports": [], "disclaimer": "No cultivator profile found."}
        if farmer_id is not None and farmer_id != actual_farmer_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden: You can only view your own crop loss reports."
            )
        farmer = get_farmer_or_404(db, actual_farmer_id, current_user=current_user)
        target_id = farmer.id
    else:
        if farmer_id is not None:
            farmer = get_farmer_or_404(db, farmer_id, current_user=current_user)
            target_id = farmer.id
        else:
            target_id = None

    query = db.query(CropLossReport)
    if target_id is not None:
        query = query.filter(CropLossReport.farmer_id == target_id)
    reports = query.order_by(CropLossReport.submitted_at.desc()).all()

    return {
        "farmer_id": target_id,
        "reports": [
            {
                "id": report.id,
                "reference_number": report.reference_number,
                "farmer_id": report.farmer_id,
                "crop": report.crop,
                "damage_type": report.damage_type,
                "loss_date": report.loss_date,
                "affected_area_acres": report.affected_area_acres,
                "damage_percent": report.damage_percent,
                "description": report.description,
                "evidence_filename": report.evidence_filename,
                "status": report.status,
                "is_within_window": report.is_within_window,
                "reporting_window_hours": report.reporting_window_hours,
                "officer_notes": report.officer_notes or "",
                "submitted_at": report.submitted_at,
                "next_step": build_next_step(report.status),
            }
            for report in reports
        ],
        "disclaimer": "PMFBY Claim Intimations. Official loss assessment is conducted by the Department of Agriculture.",
    }


@router.post("/crop-doctor/analyze", dependencies=[Depends(enforce_rate_limit(15, 60))])
async def crop_doctor_analyze(
    file: UploadFile = File(...),
    crop: str = Form("Cotton"),
    language: str = Form("English"),
):
    """Computer Vision plant pathology analysis for leaf disease diagnosis."""
    image_bytes = await file.read()
    validate_image_file(image_bytes, max_size_bytes=10 * 1024 * 1024)

    result = analyze_crop_leaf(image_bytes, crop=crop, language=language)
    return result


class ClaimPackRequest(BaseModel):
    farmer_id: int
    crop: str
    damage_type: str
    loss_date: str
    affected_area_acres: float
    damage_percent: float
    description: str


@router.post("/claims/generate-pack")
def generate_official_claim_pack(
    payload: ClaimPackRequest,
    current_user: UserAccount | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Generates standardized official PMFBY claim preparation dossier."""
    farmer = get_farmer_or_404(db, payload.farmer_id, current_user=current_user)
    pack = generate_claim_pack(
        farmer=farmer,
        crop=payload.crop,
        damage_type=payload.damage_type,
        loss_date=payload.loss_date,
        affected_area_acres=payload.affected_area_acres,
        damage_percent=payload.damage_percent,
        description=payload.description,
    )
    return pack


@router.get("/claims/status/{reference_number}")
def get_claim_lifecycle_status_endpoint(reference_number: str, db: Session = Depends(get_db)):
    """Authentic lifecycle tracking for an existing PMFBY claim reference from database."""
    status_data = get_claim_lifecycle_status(db=db, reference_number=reference_number)
    if not status_data:
        raise HTTPException(
            status_code=404,
            detail=f"PMFBY Claim Intimation '{reference_number}' not found in registry."
        )
    return status_data


class IvrStepRequest(BaseModel):
    step: str = "welcome"
    digit: str | None = None
    language: str = "English"
    farmer_id: int = 101


@router.post("/telephony/simulate-step")
def telephony_simulate_step(payload: IvrStepRequest, db: Session = Depends(get_db)):
    """Interactive phone simulator state-machine step."""
    farmer = get_or_create_farmer(db, payload.farmer_id)
    return process_ivr_step(
        step=payload.step,
        digit=payload.digit,
        language=payload.language,
        farmer=farmer,
    )


@router.post("/telephony/ivr-webhook")
def telephony_ivr_webhook(Digits: str | None = Form(default=None)):
    """TwiML/Exotel webhook endpoint returning carrier-standard XML."""
    text = "Welcome to RythuSetu Kisan Hotline. Press 1 for Telugu, 2 for Hindi, 3 for English."
    if Digits == "1":
        text = "రైతుసేతు కిసాన్ హెల్ప్‌లైన్‌కు స్వాగతం. వాతావరణం కోసం 1, పథకాల కోసం 2 నొక్కండి."
    elif Digits == "2":
        text = "रैथुसेतु किसान हेल्पलाइन में आपका स्वागत है। मौसम के लिए 1, योजनाओं के लिए 2 दबाएं।"
    xml_content = generate_twiml_response(text)
    return Response(content=xml_content, media_type="application/xml")


# -------------------------------------------------------------
# Role-Based Authentication & Agriculture Officer (Admin) Portal
# -------------------------------------------------------------

class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str
    role: str = "farmer"
    state: str = "Telangana"
    district: str = "Warangal"
    mandal: str = ""
    village: str = ""
    crop: str = "Cotton"
    season: str = "Kharif"
    land_area_acres: float = 2.0
    phone: str = ""


@router.post("/auth/register", dependencies=[Depends(enforce_rate_limit(5, 60))])
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    """Registers a new Cultivator."""
    try:
        res = register_user(
            db=db,
            username=payload.username,
            password=payload.password,
            name=payload.name,
            role="farmer",  # Public registration is strictly restricted to cultivators
            state=payload.state,
            district=payload.district,
            mandal=payload.mandal,
            village=payload.village,
            crop=payload.crop,
            season=payload.season,
            land_area_acres=payload.land_area_acres,
            phone=payload.phone,
        )
        if "access_token" in res:
            response.set_cookie(
                key="rythusetu_access_token",
                value=res["access_token"],
                httponly=True,
                secure=settings.is_production,
                samesite="lax",
                max_age=settings.jwt_access_token_expire_minutes * 60,
            )
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/auth/login", dependencies=[Depends(enforce_rate_limit(10, 60))])
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """Authenticate Farmer or Agriculture Officer by username, full name, or phone."""
    result = authenticate_user(db=db, username=payload.username, password=payload.password)
    if not result:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials. Please verify your username/phone and password."
        )
    if "access_token" in result:
        response.set_cookie(
            key="rythusetu_access_token",
            value=result["access_token"],
            httponly=True,
            secure=settings.is_production,
            samesite="lax",
            max_age=settings.jwt_access_token_expire_minutes * 60,
        )
    return result


@router.get("/auth/me")
def get_me(current_user: UserAccount = Depends(get_current_user)):
    """Returns authenticated user profile details from validated JWT."""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "name": current_user.name,
        "role": current_user.role,
        "phone": current_user.phone or "",
        "designation": current_user.designation or ("Cultivator" if current_user.role == "farmer" else "Agriculture Officer"),
        "district": current_user.district or "Warangal",
        "state": current_user.state or "Telangana",
        "farmer_profile_id": current_user.farmer_profile_id,
        "is_online": True,
    }


@router.get("/notifications")
def get_notifications_endpoint(
    current_user: UserAccount = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieves real-time event-driven notifications for authenticated user."""
    notifications = get_user_notifications(db=db, user_id=current_user.id)
    return {
        "user_id": current_user.id,
        "unread_count": sum(1 for n in notifications if n.get("status") == "UNREAD"),
        "notifications": notifications,
    }


@router.post("/notifications/{notification_id}/read")
def read_notification_endpoint(
    notification_id: int,
    current_user: UserAccount = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Marks a user notification as read."""
    success = mark_notification_as_read(db=db, notification_id=notification_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return {"status": "success", "id": notification_id}


@router.get("/admin/dashboard-stats")
def admin_stats(db: Session = Depends(get_db), current_user: UserAccount = Depends(require_admin)):
    """Aggregated district agricultural statistics for Officer Command Center."""
    return get_admin_dashboard_stats(db)


@router.get("/admin/farmers")
def admin_farmers(db: Session = Depends(get_db), current_user: UserAccount = Depends(require_admin)):
    """Returns actual registered smallholders from database."""
    return {"farmers": get_all_registered_farmers(db)}


@router.get("/admin/users")
def admin_users(db: Session = Depends(get_db), current_user: UserAccount = Depends(require_admin)):
    """Returns all registered Cultivators and Agriculture Officers with active login status."""
    return {"users": get_all_admin_users(db)}


@router.get("/admin/all-claims")
def admin_all_claims(db: Session = Depends(get_db), current_user: UserAccount = Depends(require_admin)):
    """Master registry of all farmer crop damage claims for audit and approval."""
    return {"claims": get_all_admin_claims(db)}


class ClaimStatusUpdate(BaseModel):
    new_status: str = ""
    action: str = ""
    officer_notes: str = ""
    officer_note: str = ""


@router.post("/admin/claims/{claim_id}/update")
def admin_update_claim(
    claim_id: str,
    payload: ClaimStatusUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Officer approves, advances, or rejects farmer PMFBY claim."""
    action = payload.action or ""
    notes = payload.officer_notes or payload.officer_note or ""
    updated = update_claim_status_by_officer(
        db=db,
        claim_id=claim_id,
        action=action,
        new_status=payload.new_status,
        officer_notes=notes,
        current_officer=current_user,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Crop loss claim record not found")
    return updated


class BroadcastAlertRequest(BaseModel):
    title: str
    district: str
    severity: str = "high"
    target_crop: str = "All Crops"
    crop: str = "All Crops"
    advisory: str = ""
    message: str = ""
    issued_by: str = "Mandal Agriculture Officer"


@router.post("/admin/broadcast-alert")
def create_alert(
    payload: BroadcastAlertRequest,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Dispatches emergency weather or pest epidemic broadcast alert across district."""
    crop = payload.target_crop or payload.crop or "All Crops"
    msg = payload.advisory or payload.message or ""
    alert = add_broadcast_alert(
        db=db,
        title=payload.title,
        district=payload.district,
        severity=payload.severity,
        target_crop=crop,
        advisory=msg,
        issued_by=payload.issued_by,
        current_officer=current_user,
    )
    return {"message": f"Emergency alert '{payload.title}' dispatched to district farmers!", "alert": alert}


@router.get("/admin/broadcast-alerts")
def get_alerts(db: Session = Depends(get_db)):
    """Fetches active emergency broadcasts for farmers and officers."""
    return {"alerts": get_all_broadcast_alerts(db)}


# -------------------------------------------------------------
# Mandi APMC Market Prices & Soil Health Fertilizer Optimizer
# -------------------------------------------------------------

@router.get("/mandi/prices")
def mandi_prices(
    crop: str = "Cotton",
    district: str | None = None,
    state: str | None = None,
    market: str | None = None,
    variety: str | None = None,
    date: str | None = None,
    from_date: str | None = None,
    to_date: str | None = None,
    limit: int = 50,
    offset: int = 0,
    sort: str = "price_desc",
    db: Session = Depends(get_db),
):
    """
    Fetches verified APMC daily market prices, arrival volumes, statutory MSP benchmarks,
    and rigorous freshness telemetry.
    """
    return get_mandi_prices_pipeline(
        db=db,
        crop=crop,
        state=state,
        district=district,
        market=market,
        variety=variety,
        arrival_date=date,
        from_date=from_date,
        to_date=to_date,
        limit=limit,
        offset=offset,
        sort=sort,
    )


@router.get("/mandi/history")
def mandi_history(
    crop: str = "Cotton",
    state: str | None = None,
    district: str | None = None,
    market: str | None = None,
    variety: str | None = None,
    days: int = 30,
    db: Session = Depends(get_db),
):
    """Retrieves chronological daily price history for historical market analysis and charting."""
    history = get_mandi_history(
        db=db,
        crop=crop,
        state=state,
        district=district,
        market=market,
        variety=variety,
        days=days,
    )
    return {
        "crop": crop,
        "history": history,
        "count": len(history),
    }


@router.get("/mandi/compare")
def mandi_compare(
    crop: str = "Cotton",
    district: str | None = None,
    state: str | None = None,
    date: str | None = None,
    db: Session = Depends(get_db),
):
    """Compares prices across APMC yards for a crop on the latest available market session."""
    markets = get_mandi_comparison(
        db=db,
        crop=crop,
        district=district,
        state=state,
        date=date,
    )
    return {
        "crop": crop,
        "markets": markets,
        "count": len(markets),
    }


@router.get("/mandi/trend")
def mandi_trend(
    crop: str = "Cotton",
    district: str | None = None,
    market: str | None = None,
    days: int = 7,
    db: Session = Depends(get_db),
):
    """Analyzes price trend and percentage change over recent trading sessions using neutral terminology."""
    return get_mandi_trend(
        db=db,
        crop=crop,
        district=district,
        market=market,
        days=days,
    )


@router.get("/mandi/msp")
def mandi_msp_benchmarks(
    commodity: str | None = None,
    marketing_year: str | None = "2025-26",
    db: Session = Depends(get_db),
):
    """Retrieves statutory CACP and State MIS Minimum Support Price (MSP) benchmarks."""
    benchmarks = get_msp_benchmarks(
        db=db,
        commodity=commodity,
        marketing_year=marketing_year,
    )
    return {
        "marketing_year": marketing_year,
        "benchmarks": benchmarks,
        "count": len(benchmarks),
    }


class MandiPriceCreate(BaseModel):
    crop: str
    variety: str
    market: str
    district: str
    min_price: float
    max_price: float
    modal_price: float
    arrival_quantity_qtl: float = 0.0
    telugu_name: str | None = None
    grade_tag: str | None = None
    state: str = "Telangana"
    key_trait: str | None = None
    recommendation: str | None = None
    action: str = "SELL"
    source: str = "Government e-NAM / APMC Portal"
    source_url: str = "https://enam.gov.in/web/dashboard/trade-data"


class MandiPriceUpdate(BaseModel):
    min_price: float | None = None
    max_price: float | None = None
    modal_price: float | None = None
    arrival_quantity_qtl: float | None = None
    grade_tag: str | None = None
    recommendation: str | None = None
    action: str | None = None
    verification_status: str | None = None
    is_active: bool | None = None


@router.get("/admin/mandi/prices")
def admin_get_mandi_prices(
    crop: str | None = None,
    district: str | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Master registry query of verified APMC mandi records for officers and administrators."""
    records = get_all_admin_mandi_records(db=db, crop=crop, district=district, is_active=is_active)
    return {"total": len(records), "prices": records}


@router.post("/admin/mandi/prices")
def admin_create_mandi_price(
    payload: MandiPriceCreate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Officer registers official APMC daily arrival and modal benchmark."""
    rec = create_mandi_price_record(
        db=db,
        crop=payload.crop,
        variety=payload.variety,
        market=payload.market,
        district=payload.district,
        min_price=payload.min_price,
        max_price=payload.max_price,
        modal_price=payload.modal_price,
        arrival_quantity_qtl=payload.arrival_quantity_qtl,
        telugu_name=payload.telugu_name,
        grade_tag=payload.grade_tag,
        state=payload.state,
        key_trait=payload.key_trait,
        recommendation=payload.recommendation,
        action=payload.action,
        source=payload.source,
        source_url=payload.source_url,
        officer_user_id=current_user.id,
    )
    log_audit(
        db=db,
        action="MANDI_PRICE_RECORD_CREATED",
        resource_type="mandi_price",
        user=current_user,
        resource_id=str(rec.id),
        details={"crop": rec.crop, "variety": rec.variety, "market": rec.market, "modal_price": rec.modal_price},
    )
    return {
        "status": "success",
        "message": f"Verified APMC price record registered for {rec.crop} ({rec.variety}) at {rec.market}.",
        "record_id": rec.id,
        "verification_status": rec.verification_status,
        "last_verified_at": rec.last_verified_at,
    }


@router.put("/admin/mandi/prices/{price_id}")
def admin_update_mandi_price(
    price_id: int,
    payload: MandiPriceUpdate,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Officer updates pricing, lot grading, or re-verifies active APMC records."""
    updates = payload.model_dump(exclude_unset=True)
    rec = update_mandi_price_record(db=db, price_id=price_id, updates=updates, officer_user_id=current_user.id)
    if not rec:
        raise HTTPException(status_code=404, detail="Mandi price record not found")
    log_audit(
        db=db,
        action="MANDI_PRICE_RECORD_UPDATED",
        resource_type="mandi_price",
        user=current_user,
        resource_id=str(rec.id),
        details=updates,
    )
    return {
        "status": "success",
        "message": f"Price record #{price_id} updated and verified.",
        "record_id": rec.id,
        "modal_price": rec.modal_price,
        "verification_status": rec.verification_status,
        "last_verified_at": rec.last_verified_at,
    }


@router.delete("/admin/mandi/prices/{price_id}")
def admin_delete_mandi_price(
    price_id: int,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Marks outdated or replaced market price records as expired."""
    success = soft_delete_mandi_price_record(db=db, price_id=price_id, officer_user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Mandi price record not found")
    log_audit(
        db=db,
        action="MANDI_PRICE_RECORD_DEPRECATED",
        resource_type="mandi_price",
        user=current_user,
        resource_id=str(price_id),
    )
    return {
        "status": "success",
        "message": f"Mandi price record #{price_id} marked as EXPIRED.",
        "price_id": price_id,
    }


@router.post("/admin/mandi/sync")
def admin_mandi_sync(
    state: str | None = None,
    limit: int = 500,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Triggers upstream market data sync from Government OGD Agmarknet endpoint."""
    service = MandiIngestionService()
    result = service.run_sync(db=db, state=state, limit=limit)
    log_audit(
        db=db,
        action="MANDI_UPSTREAM_SYNC_TRIGGERED",
        resource_type="mandi_ingestion",
        user=current_user,
        details={
            "state": state,
            "limit": limit,
            "sync_status": result.get("status"),
            "records_received": result.get("records_received", 0),
        },
    )
    return result


@router.get("/admin/mandi/ingestion-status")
def admin_mandi_ingestion_status(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    """Returns telemetry on latest market data ingestion runs and sync status."""
    runs = db.query(MandiIngestionRun).order_by(MandiIngestionRun.id.desc()).limit(limit).all()
    latest_run = runs[0] if runs else None
    return {
        "latest_run": {
            "id": latest_run.id,
            "source": latest_run.source,
            "status": latest_run.status,
            "started_at": latest_run.started_at.isoformat() if latest_run and latest_run.started_at else None,
            "completed_at": latest_run.completed_at.isoformat() if latest_run and latest_run.completed_at else None,
            "records_received": latest_run.records_received if latest_run else 0,
            "records_inserted": latest_run.records_inserted if latest_run else 0,
            "records_updated": latest_run.records_updated if latest_run else 0,
            "records_rejected": latest_run.records_rejected if latest_run else 0,
            "error_message": latest_run.error_message if latest_run else None,
        } if latest_run else None,
        "runs": [
            {
                "id": r.id,
                "source": r.source,
                "status": r.status,
                "started_at": r.started_at.isoformat() if r.started_at else None,
                "completed_at": r.completed_at.isoformat() if r.completed_at else None,
                "records_received": r.records_received,
                "records_inserted": r.records_inserted,
                "records_updated": r.records_updated,
                "records_rejected": r.records_rejected,
                "error_message": r.error_message,
            }
            for r in runs
        ],
    }


class FertilizerPlanRequest(BaseModel):
    crop: str = "Cotton"
    soil_type: str = "Black Cotton Clay"
    land_area_acres: float = 3.5


@router.post("/soil/fertilizer-plan")
def fertilizer_plan(payload: FertilizerPlanRequest):
    """Calculates scientific NPK split dosage and bag requirements per acre."""
    return calculate_fertilizer_plan(
        crop=payload.crop,
        soil_type=payload.soil_type,
        acres=payload.land_area_acres,
    )


# -------------------------------------------------------------
# 1. Smart Crop Recommendation & POP Protocol
# -------------------------------------------------------------

class CropRecommendationRequest(BaseModel):
    state: str = "Telangana"
    district: str = "Warangal"
    soil_type: str = "Black Cotton Clay"
    season: str = "Kharif"
    water_source: str = "Borewell / Semi-irrigated"


@router.post("/crops/recommend")
def get_crop_recommendations(payload: CropRecommendationRequest):
    """Recommends optimal crops with full fertilizer & pesticide POP."""
    return {
        "state": payload.state,
        "district": payload.district,
        "soil_type": payload.soil_type,
        "season": payload.season,
        "water_source": payload.water_source,
        "recommendations": recommend_crops(
            state=payload.state,
            district=payload.district,
            soil_type=payload.soil_type,
            season=payload.season,
            water_source=payload.water_source,
        ),
    }


# -------------------------------------------------------------
# 2. Dual-Mode Crop Doctor: Symptom & Pathogen Diagnosis
# -------------------------------------------------------------

class SymptomDiagnosisRequest(BaseModel):
    crop: str = "Cotton"
    symptoms: str
    language: str = "English"


@router.post("/crop-doctor/diagnose-symptoms")
def diagnose_crop_symptoms(payload: SymptomDiagnosisRequest):
    """Diagnoses disease & pests from farmer text description or symptom query."""
    return diagnose_symptoms(
        crop=payload.crop,
        symptoms_text=payload.symptoms,
        language=payload.language,
    )


# -------------------------------------------------------------
# 3. AC Godowns & Cold Storage Network
# -------------------------------------------------------------

class StorageBookingRequest(BaseModel):
    facility_id: str
    farmer_name: str
    phone: str
    commodity: str
    bags_count: int = 50
    duration_months: int = 3


class StatusUpdateRequest(BaseModel):
    status: str


@router.get("/storage/cold-godowns")
def list_cold_storages(
    state: str = "",
    district: str = "",
    commodity: str = "",
    db: Session = Depends(get_db),
):
    """Lists certified AC Godowns and cold storages across AP and Telangana."""
    return {"facilities": get_cold_storages(db=db, state=state, district=district, commodity=commodity)}


@router.post("/storage/book-space")
def book_cold_storage_space(
    payload: StorageBookingRequest,
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    """Generates official AC Godown slot reservation token and alerts facility in-charge."""
    farmer_name = payload.farmer_name or current_user.name
    phone = payload.phone or current_user.phone or ""
    return create_storage_booking(
        db=db,
        facility_id=payload.facility_id,
        farmer_name=farmer_name,
        phone=phone,
        commodity=payload.commodity,
        bags_count=payload.bags_count,
        duration_months=payload.duration_months,
        user_id=current_user.id,
    )


@router.get("/storage/bookings")
def list_storage_bookings(db: Session = Depends(get_db), current_user: UserAccount = Depends(require_officer)):
    """Lists all incoming storage preservation requests for owners and officers."""
    return {"bookings": get_all_storage_bookings(db=db)}


@router.put("/storage/bookings/{token}/status")
def update_booking_state(
    token: str,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    res = update_storage_booking_status(
        db=db,
        token=token,
        new_status=payload.status,
        current_officer=current_user,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Booking token not found")
    return res


# -------------------------------------------------------------
# 4. Direct Farm-to-Factory Zero-Broker Linkage
# -------------------------------------------------------------

class FactoryDeliveryPassRequest(BaseModel):
    factory_id: str
    farmer_name: str
    phone: str
    district: str
    village: str
    crop: str
    quantity_qtl: float
    delivery_date: str


@router.get("/direct-market/factories")
def list_factory_contracts(state: str = "", district: str = "", crop: str = ""):
    """Lists verified factory procurement tenders and broker-free profit comparisons."""
    return {"contracts": get_factory_contracts(state=state, district=district, crop=crop)}


@router.post("/direct-market/delivery-pass")
def generate_delivery_pass(
    payload: FactoryDeliveryPassRequest,
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    """Generates Zero-Broker Factory Gate Entry Delivery Pass with procurement approval."""
    farmer_name = payload.farmer_name or current_user.name
    phone = payload.phone or current_user.phone or ""
    return create_factory_delivery_pass(
        db=db,
        factory_id=payload.factory_id,
        farmer_name=farmer_name,
        phone=phone,
        district=payload.district,
        village=payload.village,
        crop=payload.crop,
        quantity_qtl=payload.quantity_qtl,
        delivery_date=payload.delivery_date,
        user_id=current_user.id,
    )


@router.get("/direct-market/passes")
def list_delivery_passes(db: Session = Depends(get_db), current_user: UserAccount = Depends(require_officer)):
    """Lists all factory delivery passes for factory managers and officers."""
    return {"passes": get_all_delivery_passes(db=db)}


@router.put("/direct-market/passes/{pass_number}/status")
def update_pass_state(
    pass_number: str,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    res = update_delivery_pass_status(
        db=db,
        pass_number=pass_number,
        new_status=payload.status,
        current_officer=current_user,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Delivery pass not found")
    return res


# -------------------------------------------------------------
# 5. Local Government Directory (LGD) Official Location APIs
# -------------------------------------------------------------

@router.get("/locations/states")
def api_list_states():
    """Lists all official states from LGD."""
    return {"states": lgd_get_states()}


@router.get("/locations/districts")
def api_list_districts(state: str = Query(..., min_length=1)):
    """Lists all official districts for a state."""
    return {"state": state, "districts": lgd_get_districts(state)}


@router.get("/locations/mandals")
def api_list_mandals(state: str = Query(..., min_length=1), district: str = Query(..., min_length=1)):
    """Lists all official mandals for a district."""
    return {
        "state": state,
        "district": district,
        "mandals": lgd_get_mandals(state, district),
    }


@router.get("/locations/villages")
def api_list_villages(
    state: str = Query(..., min_length=1),
    district: str = Query(..., min_length=1),
    mandal: str = Query(..., min_length=1),
):
    """Lists all official villages for a mandal with native name, pincode, and LGD code."""
    return {
        "state": state,
        "district": district,
        "mandal": mandal,
        "villages": lgd_get_villages(state, district, mandal),
    }


@router.get("/locations/search")
def api_search_locations(q: str = Query(..., min_length=1), state: str = ""):
    """Live search across villages, mandals, and pincodes."""
    return {
        "query": q,
        "results": lgd_search_locations(q, state=state if state else None),
    }


@router.get("/locations/stats")
def api_location_stats():
    """Returns total counts of districts, mandals, and villages in LGD."""
    return lgd_get_stats()


# -------------------------------------------------------------
# 6. Hyperlocal Nearby Infrastructure & Market Hub
# -------------------------------------------------------------

@router.get("/nearby/hub")
def api_nearby_infrastructure(
    state: str = Query(..., min_length=1),
    district: str = Query(..., min_length=1),
    mandal: str = Query("", max_length=100),
    crop: str = Query("", max_length=100),
    max_distance_km: float = Query(200.0, gt=0, le=1000),
    lat: float | None = Query(None),
    lon: float | None = Query(None),
):
    """
    Returns ranked nearby APMC mandis, direct purchase processing mills/factories,
    and AC cold storages sorted by actual distance in km from farmer's location.
    Accepts exact device GPS lat/lon or falls back to district centroid with transparent provenance notice.
    """
    return get_nearby_infrastructure(
        state=state,
        district=district,
        mandal=mandal,
        crop=crop,
        max_distance_km=max_distance_km,
        lat=lat,
        lon=lon,
    )


# -------------------------------------------------------------
# 7. Agri Inputs, Branded Chemical Formulas & Dealer Directory
# -------------------------------------------------------------

@router.get("/inputs/products")
def api_search_products(
    crop: str = Query("", max_length=100),
    disease: str = Query("", max_length=150),
    category: str = Query("", max_length=100),
    q: str = Query("", max_length=100),
):
    """
    Returns verified agri chemicals & fertilizers with packaging packshots,
    chemical formula breakdown, multi-store price comparisons, and direct shopping links.
    """
    return {
        "products": search_agri_products(
            crop=crop,
            disease_or_pest=disease,
            category=category,
            query=q,
        )
    }


@router.get("/inputs/dealers")
def api_nearby_dealers(
    state: str = Query("", max_length=100),
    district: str = Query("", max_length=100),
    mandal: str = Query("", max_length=100),
):
    """
    Returns authorized fertilizer & pesticide dealers with license numbers,
    village/mandal addresses, and direct phone contact links.
    """
    return {
        "dealers": get_nearby_dealers(
            state=state,
            district=district,
            mandal=mandal,
        )
    }


# -------------------------------------------------------------
# 8. Farm Machinery Custom Hiring Center (CHC) Hub
# -------------------------------------------------------------

class MachineryBookingRequest(BaseModel):
    machinery_id: str
    farmer_name: str
    phone: str
    district: str
    village: str
    acres_or_hours: float
    required_date: str


@router.get("/machinery/rentals")
def api_machinery_rentals(
    district: str = Query("", max_length=100),
    category: str = Query("", max_length=100),
    state: str = Query("", max_length=100),
    db: Session = Depends(get_db),
):
    """Returns available farm machinery custom hiring center equipment."""
    return {
        "equipment": get_machinery_rentals(
            db=db,
            district=district,
            category=category,
            state=state,
        )
    }


@router.post("/machinery/book")
def api_book_machinery(
    payload: MachineryBookingRequest,
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    """Reserves farm machinery and issues confirmation dispatch token."""
    farmer_name = payload.farmer_name or current_user.name
    phone = payload.phone or current_user.phone or ""
    return create_machinery_booking(
        db=db,
        machinery_id=payload.machinery_id,
        farmer_name=farmer_name,
        phone=phone,
        district=payload.district,
        village=payload.village,
        acres_or_hours=payload.acres_or_hours,
        required_date=payload.required_date,
        user_id=current_user.id,
    )


@router.get("/machinery/bookings")
def list_machinery_bookings(db: Session = Depends(get_db), current_user: UserAccount = Depends(require_officer)):
    """Lists all incoming machinery hiring requests for CHC operators and officers."""
    return {"bookings": get_all_machinery_bookings(db=db)}


@router.put("/machinery/bookings/{token}/status")
def update_machinery_booking_state(
    token: str,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(require_officer),
):
    res = update_machinery_booking_status(
        db=db,
        token=token,
        new_status=payload.status,
        current_officer=current_user,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Machinery booking token not found")
    return res


# -------------------------------------------------------------
# 9. Kallam (Drying Yard) Harvest Weather Shield & Tarpaulins
# -------------------------------------------------------------

@router.get("/weather/harvest-shield")
def api_harvest_drying_risk(
    district: str = Query("Guntur", max_length=100),
    crop: str = Query("Red Chilli", max_length=100),
):
    """Calculates open yard crop moisture danger score and nearest tarpaulin centers."""
    return get_harvest_drying_risk(district=district, crop=crop)


# -------------------------------------------------------------
# 10. Seed & Input Authenticity Batch Verifier & Anti-Spurious
# -------------------------------------------------------------

class SeedGrievanceRequest(BaseModel):
    farmer_name: str
    phone: str
    village: str
    district: str
    dealer_name: str
    seed_brand: str
    lot_number: str
    germination_failed_percent: float
    notes: str = ""


@router.get("/seeds/verify-batch")
def api_verify_seed_lot(lot_number: str = Query(..., min_length=2)):
    """Cross-verifies seed lot number against official state certification reference."""
    return verify_seed_lot(lot_number)


@router.post("/seeds/report-spurious")
def api_report_spurious_seed(payload: SeedGrievanceRequest, db: Session = Depends(get_db)):
    """Files formal spurious seed complaint with Mandal Agriculture Officer (MAO)."""
    return file_seed_grievance(
        db=db,
        farmer_name=payload.farmer_name,
        phone=payload.phone,
        village=payload.village,
        district=payload.district,
        dealer_name=payload.dealer_name,
        seed_brand=payload.seed_brand,
        lot_number=payload.lot_number,
        germination_failed_percent=payload.germination_failed_percent,
        notes=payload.notes,
    )


# -------------------------------------------------------------
# 11. Digital Agri Khata & Breakeven Price Calculator
# -------------------------------------------------------------

class KhataCalculationRequest(BaseModel):
    crop: str
    acres: float
    expenses: dict[str, float]
    expected_yield_quintals: float
    expected_market_price_per_qtl: float = 0.0


@router.get("/khata/template")
def api_khata_template(crop: str = Query("Red Chilli")):
    """Returns baseline cultivation expense template for specified crop."""
    return get_crop_cost_template(crop)


@router.post("/khata/calculate-breakeven")
def api_calculate_breakeven(
    payload: KhataCalculationRequest,
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    """Calculates cost of cultivation per acre, breakeven price/qtl, and anti-distress sale advisory."""
    return calculate_breakeven_cost(
        db=db,
        crop=payload.crop,
        acres=payload.acres,
        expenses=payload.expenses,
        expected_yield_quintals=payload.expected_yield_quintals,
        expected_market_price_per_qtl=payload.expected_market_price_per_qtl,
        user_id=current_user.id,
        farmer_name=current_user.name,
    )


@router.get("/khata/history")
def api_khata_history(
    current_user: UserAccount = Depends(require_authenticated_user),
    db: Session = Depends(get_db),
):
    """Returns farmer's saved crop expense ledger records."""
    user_id = current_user.id if current_user.role == "farmer" else None
    return {"entries": get_saved_khata_entries(db=db, user_id=user_id)}

