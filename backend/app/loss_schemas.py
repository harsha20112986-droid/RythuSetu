from datetime import datetime

from pydantic import BaseModel, Field


class CropLossCreate(BaseModel):
    farmer_id: int = Field(gt=0)
    crop: str = Field(min_length=2, max_length=80)
    damage_type: str = Field(min_length=2, max_length=80)
    loss_date: str = Field(min_length=8, max_length=20)
    affected_area_acres: float = Field(gt=0, le=10000)
    damage_percent: float = Field(ge=0, le=100)
    description: str = Field(min_length=5, max_length=2000)
    evidence_filename: str | None = Field(default=None, max_length=255)


class CropLossResponse(CropLossCreate):
    id: int
    status: str
    submitted_at: datetime
    next_step: str

    model_config = {"from_attributes": True}
