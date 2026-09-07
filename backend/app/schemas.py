from pydantic import BaseModel, Field


class FarmerProfileCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    language: str = Field(default="English", min_length=2, max_length=20)
    state: str = Field(min_length=2, max_length=80)
    district: str = Field(min_length=2, max_length=80)
    mandal: str = Field(default="", max_length=80)
    village: str = Field(default="", max_length=120)
    crop: str = Field(min_length=2, max_length=80)
    season: str = Field(min_length=2, max_length=40)
    land_area_acres: float = Field(gt=0, le=10000)


class FarmerProfileResponse(FarmerProfileCreate):
    id: int

    model_config = {"from_attributes": True}
