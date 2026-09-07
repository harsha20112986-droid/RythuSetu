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


class UserAccount(Base):
    __tablename__ = "user_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(120))
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(40), default="farmer")  # "farmer" or "admin"
    designation: Mapped[str | None] = mapped_column(String(120), nullable=True)
    district: Mapped[str | None] = mapped_column(String(80), nullable=True)
    state: Mapped[str | None] = mapped_column(String(80), default="Telangana")
    farmer_profile_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
