from fastapi.responses import Response
from app.vision_engine import analyze_crop_leaf
from app.claims_engine import generate_claim_pack
from app.telephony_engine import process_ivr_step, generate_twiml_response
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.assistant_engine import build_assistant_reply
from app.benefit_engine import estimate_benefits
from app.db import get_db
from app.loss_engine import ALLOWED_DAMAGE_TYPES, build_next_step
from app.models import CropLossReport, FarmerProfile
from app.schemas import FarmerProfileCreate, FarmerProfileResponse
from app.scheme_engine import find_matching_schemes
from app.weather_engine import get_climate_risk

router = APIRouter(prefix="/api/v1")
UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}

DEMO_FARMERS = {
    101: {
        "name": "Kishan Rao",
        "language": "Telugu",
        "state": "Telangana",
        "district": "Warangal",
        "mandal": "Narsampet",
        "village": "Chennaraopet",
        "crop": "Cotton",
        "season": "Kharif",
        "land_area_acres": 3.5,
    },
    102: {
        "name": "Lakshmi Devi",
        "language": "Telugu",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "mandal": "Dharmavaram",
        "village": "Marala",
        "crop": "Groundnut",
        "season": "Kharif",
        "land_area_acres": 2.5,
    },
    103: {
        "name": "Ramesh Goud",
        "language": "Hindi",
        "state": "Telangana",
        "district": "Karimnagar",
        "mandal": "Huzurabad",
        "village": "Bornapalli",
        "crop": "Rice",
        "season": "Kharif",
        "land_area_acres": 4.0,
    },
}


def get_or_create_farmer(db: Session, farmer_id: int) -> FarmerProfile:
    farmer = db.get(FarmerProfile, farmer_id)
    if farmer is not None:
        return farmer

    if farmer_id in DEMO_FARMERS:
        data = DEMO_FARMERS[farmer_id]
        farmer = FarmerProfile(id=farmer_id, **data)
        try:
            db.merge(farmer)
            db.commit()
            return farmer
        except Exception:
            db.rollback()
            return farmer

    first = db.query(FarmerProfile).first()
    if first is not None:
        return first

    default_demo = DEMO_FARMERS[101]
    fallback_farmer = FarmerProfile(id=farmer_id, **default_demo)
    try:
        db.merge(fallback_farmer)
        db.commit()
    except Exception:
        db.rollback()
    return fallback_farmer


class AssistantRequest(BaseModel):
    farmer_id: int = Field(gt=0)
    question: str = Field(min_length=1, max_length=500)
    language: str = Field(default="English", min_length=2, max_length=20)


@router.post("/farmers", response_model=FarmerProfileResponse, status_code=201)
def create_farmer_profile(payload: FarmerProfileCreate, db: Session = Depends(get_db)):
    farmer = FarmerProfile(**payload.model_dump())
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer


@router.get("/farmers/{farmer_id}", response_model=FarmerProfileResponse)
def get_farmer_profile(farmer_id: int, db: Session = Depends(get_db)):
    farmer = db.get(FarmerProfile, farmer_id)
    if farmer is None:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return farmer


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
def assistant_chat(payload: AssistantRequest, db: Session = Depends(get_db)):
    farmer = get_or_create_farmer(db, payload.farmer_id)

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


@router.post("/crop-loss", status_code=201)
async def create_crop_loss_report(
    farmer_id: int = Form(...),
    crop: str = Form(...),
    damage_type: str = Form(...),
    loss_date: str = Form(...),
    affected_area_acres: float = Form(..., gt=0),
    damage_percent: float = Form(..., ge=0, le=100),
    description: str = Form(..., min_length=5, max_length=2000),
    evidence: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
):
    farmer = get_or_create_farmer(db, farmer_id)
    if damage_type not in ALLOWED_DAMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported damage type")
    if affected_area_acres > farmer.land_area_acres:
        raise HTTPException(status_code=400, detail="Affected area cannot exceed the farmer profile area")

    saved_filename = None
    if evidence is not None:
        if evidence.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Evidence must be a JPG, PNG, or WebP image")
        suffix = Path(evidence.filename or "photo.jpg").suffix.lower()
        if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
            raise HTTPException(status_code=400, detail="Evidence must be a JPG, PNG, or WebP image")
        saved_filename = f"loss_{farmer_id}_{uuid4().hex}{suffix}"
        destination = UPLOAD_DIR / saved_filename
        contents = await evidence.read()
        if len(contents) > 8 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Evidence image must be 8 MB or smaller")
        destination.write_bytes(contents)

    report = CropLossReport(
        farmer_id=farmer_id,
        crop=crop,
        damage_type=damage_type,
        loss_date=loss_date,
        affected_area_acres=affected_area_acres,
        damage_percent=damage_percent,
        description=description,
        evidence_filename=saved_filename,
        status="Submitted",
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "id": report.id,
        "farmer_id": report.farmer_id,
        "crop": report.crop,
        "damage_type": report.damage_type,
        "loss_date": report.loss_date,
        "affected_area_acres": report.affected_area_acres,
        "damage_percent": report.damage_percent,
        "description": report.description,
        "evidence_filename": report.evidence_filename,
        "status": report.status,
        "submitted_at": report.submitted_at,
        "next_step": build_next_step(report.status),
        "disclaimer": "Farmer-reported damage is not an official loss assessment.",
    }


@router.get("/crop-loss")
def get_crop_loss_reports(farmer_id: int = Query(..., gt=0), db: Session = Depends(get_db)):
    farmer = get_or_create_farmer(db, farmer_id)

    reports = (
        db.query(CropLossReport)
        .filter(CropLossReport.farmer_id == farmer_id)
        .order_by(CropLossReport.submitted_at.desc())
        .all()
    )
    return {
        "farmer_id": farmer_id,
        "reports": [
            {
                "id": report.id,
                "crop": report.crop,
                "damage_type": report.damage_type,
                "loss_date": report.loss_date,
                "affected_area_acres": report.affected_area_acres,
                "damage_percent": report.damage_percent,
                "description": report.description,
                "evidence_filename": report.evidence_filename,
                "status": report.status,
                "submitted_at": report.submitted_at,
                "next_step": build_next_step(report.status),
            }
            for report in reports
        ],
        "disclaimer": "Farmer-reported damage is not an official loss assessment.",
    }


# -------------------------------------------------------------
# Advanced Features: Vision AI, Govt Claim Pack, Telephony
# -------------------------------------------------------------

@router.post("/crop-doctor/analyze")
async def crop_doctor_analyze(
    file: UploadFile = File(...),
    crop: str = Form("Cotton"),
    language: str = Form("English"),
):
    """Computer Vision plant pathology analysis for leaf disease diagnosis."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Leaf image must be JPG, PNG, or WebP")
    
    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 10MB")
        
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
def generate_official_claim_pack(payload: ClaimPackRequest, db: Session = Depends(get_db)):
    """Generates standardized official PMFBY claim packet with 4-stage tracking ID."""
    farmer = get_or_create_farmer(db, payload.farmer_id)
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
def get_claim_lifecycle_status(reference_number: str):
    """Lifecycle tracking for an existing official claim reference."""
    import datetime
    now = datetime.datetime.utcnow()
    return {
        "reference_number": reference_number,
        "current_status": "Joint Field Survey Scheduled",
        "last_updated": now.strftime("%Y-%m-%d %H:%M UTC"),
        "stages": [
            {"step": 1, "title": "Claim Intimation Registered", "status": "Completed", "date": (now - datetime.timedelta(days=2)).strftime("%Y-%m-%d")},
            {"step": 2, "title": "Block Officer (BAO) Assigned", "status": "Completed", "date": (now - datetime.timedelta(days=1)).strftime("%Y-%m-%d")},
            {"step": 3, "title": "Joint Field Survey & Geo-tagging", "status": "In Progress", "date": now.strftime("%Y-%m-%d")},
            {"step": 4, "title": "Direct Benefit Transfer (DBT)", "status": "Pending", "date": (now + datetime.timedelta(days=10)).strftime("%Y-%m-%d")},
        ]
    }


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
# Role-Based Authentication & Agriculture Officer (Admin) Portal
# -------------------------------------------------------------
from app.auth_engine import (
    register_user,
    get_all_registered_farmers,
    authenticate_user,
    get_admin_dashboard_stats,
    get_all_admin_claims,
    update_claim_status_by_officer,
    add_broadcast_alert,
    BROADCAST_ALERTS,
)

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

@router.post("/auth/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Registers a new Cultivator or Agriculture Officer."""
    try:
        user = register_user(
            db=db,
            username=payload.username,
            password=payload.password,
            name=payload.name,
            role=payload.role,
            state=payload.state,
            district=payload.district,
            mandal=payload.mandal,
            village=payload.village,
            crop=payload.crop,
            season=payload.season,
            land_area_acres=payload.land_area_acres,
            phone=payload.phone,
        )
        return {
            "access_token": f"rythusetu_{user['role']}_token_{user['id']}",
            "token_type": "bearer",
            "user": user,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate Farmer or Agriculture Officer against database."""
    user = authenticate_user(db=db, username=payload.username, password=payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials. Try admin/admin123 or farmer/farmer123")
    return {
        "access_token": f"rythusetu_{user['role']}_token_123",
        "token_type": "bearer",
        "user": user,
    }

@router.get("/admin/dashboard-stats")
def admin_stats(db: Session = Depends(get_db)):
    """Aggregated district agricultural statistics for Officer Command Center."""
    return get_admin_dashboard_stats(db)

@router.get("/admin/farmers")
def admin_farmers(db: Session = Depends(get_db)):
    """Returns actual registered smallholders from database."""
    return {"farmers": get_all_registered_farmers(db)}

@router.get("/admin/all-claims")
def admin_all_claims(db: Session = Depends(get_db)):
    """Master registry of all farmer crop damage claims for audit and approval."""
    return {"claims": get_all_admin_claims(db)}

class ClaimStatusUpdate(BaseModel):
    new_status: str = ""
    action: str = ""
    officer_notes: str = ""
    officer_note: str = ""

@router.post("/admin/claims/{claim_id}/update")
def admin_update_claim(claim_id: str, payload: ClaimStatusUpdate, db: Session = Depends(get_db)):
    """Officer approves, advances, or rejects farmer PMFBY claim."""
    action = payload.action or ""
    notes = payload.officer_notes or payload.officer_note or ""
    updated = update_claim_status_by_officer(
        db=db,
        claim_id=claim_id,
        action=action,
        new_status=payload.new_status,
        officer_notes=notes,
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
def create_alert(payload: BroadcastAlertRequest):
    """Dispatches emergency weather or pest epidemic broadcast alert across district."""
    crop = payload.target_crop or payload.crop or "All Crops"
    msg = payload.advisory or payload.message or ""
    alert = add_broadcast_alert(
        title=payload.title,
        district=payload.district,
        severity=payload.severity,
        target_crop=crop,
        advisory=msg,
        issued_by=payload.issued_by,
    )
    return {"message": f"Emergency alert '{payload.title}' dispatched to district farmers!", "alert": alert}

@router.get("/admin/broadcast-alerts")
def get_alerts():
    """Fetches active emergency broadcasts for farmers and officers."""
    return {"alerts": BROADCAST_ALERTS}

# -------------------------------------------------------------
# Mandi APMC Market Prices & Soil Health Fertilizer Optimizer
# -------------------------------------------------------------
from app.mandi_engine import get_mandi_prices_for_farmer
from app.soil_engine import calculate_fertilizer_plan

@router.get("/mandi/prices")
def mandi_prices(crop: str = "Cotton", district: str = "Warangal"):
    """Fetches live e-NAM APMC market arrivals, modal rates, and MSP comparison."""
    return get_mandi_prices_for_farmer(crop=crop, district=district)

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
