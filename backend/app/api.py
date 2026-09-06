from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import FarmerProfile
from app.schemas import FarmerProfileCreate, FarmerProfileResponse
from app.scheme_engine import find_matching_schemes
from app.benefit_engine import estimate_benefits

router = APIRouter(prefix="/api/v1")


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
