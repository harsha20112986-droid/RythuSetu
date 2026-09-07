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
    farmer = db.get(FarmerProfile, payload.farmer_id)
    if farmer is None:
        raise HTTPException(status_code=404, detail="Farmer profile not found")

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
    farmer = db.get(FarmerProfile, farmer_id)
    if farmer is None:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
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
    farmer = db.get(FarmerProfile, farmer_id)
    if farmer is None:
        raise HTTPException(status_code=404, detail="Farmer profile not found")

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
