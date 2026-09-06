from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import FarmerProfile
from app.schemas import FarmerProfileCreate, FarmerProfileResponse

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
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return farmer
