from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    language: Mapped[str] = mapped_column(String(20), default="English")
    state: Mapped[str] = mapped_column(String(80))
    district: Mapped[str] = mapped_column(String(80))
    mandal: Mapped[str] = mapped_column(String(80))
    village: Mapped[str] = mapped_column(String(120))
    crop: Mapped[str] = mapped_column(String(80))
    season: Mapped[str] = mapped_column(String(40))
    land_area_acres: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CropLossReport(Base):
    __tablename__ = "crop_loss_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    farmer_id: Mapped[int] = mapped_column(Integer, index=True)
    crop: Mapped[str] = mapped_column(String(80))
    damage_type: Mapped[str] = mapped_column(String(80))
    loss_date: Mapped[str] = mapped_column(String(20))
    affected_area_acres: Mapped[float] = mapped_column(Float)
    damage_percent: Mapped[float] = mapped_column(Float)
    description: Mapped[str] = mapped_column(String(2000))
    evidence_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="Submitted")
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
