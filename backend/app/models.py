"""
RythuSetu Production Relational Models
Comprehensive normalized database schema supporting:
Users, RBAC, Profiles, PMFBY Claims & Event Audit Trail, Storage Facilities & Bookings,
Machinery Rentals, Direct Market Delivery Passes, Agri Khata Ledger, Seed Grievances,
Broadcast Alerts, and Immutable System Audit Logs.
"""

from datetime import datetime, timezone
from sqlalchemy import (
    DateTime,
    Float,
    Integer,
    String,
    Boolean,
    Text,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class UserAccount(Base):
    """Core user account supporting RBAC (farmer, officer, admin, super_admin)."""
    __tablename__ = "user_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(120), index=True)
    role: Mapped[str] = mapped_column(String(40), default="farmer", index=True)  # farmer, officer, admin, super_admin
    phone: Mapped[str | None] = mapped_column(String(40), nullable=True, index=True)
    designation: Mapped[str | None] = mapped_column(String(120), nullable=True)
    district: Mapped[str | None] = mapped_column(String(80), nullable=True, index=True)
    state: Mapped[str | None] = mapped_column(String(80), default="Telangana")
    farmer_profile_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("farmer_profiles.id", use_alter=True, name="fk_user_farmer_profile"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_online: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Relationships
    farmer_profile = relationship("FarmerProfile", foreign_keys=[farmer_profile_id], post_update=True)


class FarmerProfile(Base):
    """Agricultural farm profile linked to registered smallholder."""
    __tablename__ = "farmer_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    language: Mapped[str] = mapped_column(String(20), default="English")
    state: Mapped[str] = mapped_column(String(80), index=True)
    district: Mapped[str] = mapped_column(String(80), index=True)
    mandal: Mapped[str] = mapped_column(String(80), index=True)
    village: Mapped[str] = mapped_column(String(120), index=True)
    crop: Mapped[str] = mapped_column(String(80), index=True)
    season: Mapped[str] = mapped_column(String(40), default="Kharif")
    land_area_acres: Mapped[float] = mapped_column(Float, default=2.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    claims = relationship("CropLossReport", back_populates="farmer_profile")


class CropLossReport(Base):
    """
    PMFBY crop damage claim intimation record.
    Tracks 72-hour reporting compliance and immutable status lifecycle.
    """
    __tablename__ = "crop_loss_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    reference_number: Mapped[str] = mapped_column(String(60), unique=True, index=True)  # e.g. RYTHU-CLAIM-2026-1001
    farmer_id: Mapped[int] = mapped_column(Integer, ForeignKey("farmer_profiles.id"), index=True)
    crop: Mapped[str] = mapped_column(String(80))
    damage_type: Mapped[str] = mapped_column(String(80))
    loss_date: Mapped[str] = mapped_column(String(40))
    affected_area_acres: Mapped[float] = mapped_column(Float)
    damage_percent: Mapped[float] = mapped_column(Float)
    description: Mapped[str] = mapped_column(Text)
    evidence_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="Submitted", index=True)
    officer_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    reporting_window_hours: Mapped[int] = mapped_column(Integer, default=72)
    is_within_window: Mapped[bool] = mapped_column(Boolean, default=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    farmer_profile = relationship("FarmerProfile", back_populates="claims")
    events = relationship("ClaimEvent", back_populates="claim", cascade="all, delete-orphan")


class ClaimEvent(Base):
    """Immutable audit trail for every PMFBY claim transition."""
    __tablename__ = "claim_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    claim_id: Mapped[int] = mapped_column(Integer, ForeignKey("crop_loss_reports.id"), index=True)
    actor_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    actor_role: Mapped[str] = mapped_column(String(40), default="officer")
    actor_name: Mapped[str] = mapped_column(String(120), default="System")
    old_status: Mapped[str] = mapped_column(String(40))
    new_status: Mapped[str] = mapped_column(String(40))
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    claim = relationship("CropLossReport", back_populates="events")


class StorageFacility(Base):
    """Cold storage & AC godown registry with capacity tracking."""
    __tablename__ = "storage_facilities"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)  # e.g. cs-gtr-01
    name: Mapped[str] = mapped_column(String(200), index=True)
    district: Mapped[str] = mapped_column(String(80), index=True)
    state: Mapped[str] = mapped_column(String(80), index=True)
    location: Mapped[str] = mapped_column(String(255))
    facility_type: Mapped[str] = mapped_column(String(120))
    capacity_mt: Mapped[int] = mapped_column(Integer)
    available_space_mt: Mapped[int] = mapped_column(Integer)
    commodities_json: Mapped[str] = mapped_column(Text, default="[]")
    temp_range: Mapped[str] = mapped_column(String(80))
    humidity_rh: Mapped[str] = mapped_column(String(80))
    monthly_rent_per_bag: Mapped[float] = mapped_column(Float)
    bag_weight_kg: Mapped[str] = mapped_column(String(40))
    enwr_pledge_loan: Mapped[bool] = mapped_column(Boolean, default=True)
    loan_percent: Mapped[str] = mapped_column(String(100))
    contact_person: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    features_json: Mapped[str] = mapped_column(Text, default="[]")
    trust_label: Mapped[str] = mapped_column(String(100), default="Listed Facility (WDRA Regulated)")
    last_verified: Mapped[str] = mapped_column(String(40), default="September 2026")


class StorageBooking(Base):
    """Persistent storage reservation records."""
    __tablename__ = "storage_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    booking_token: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    facility_id: Mapped[str] = mapped_column(String(40), ForeignKey("storage_facilities.id"), index=True)
    facility_name: Mapped[str] = mapped_column(String(200))
    district: Mapped[str] = mapped_column(String(80))
    state: Mapped[str] = mapped_column(String(80))
    location: Mapped[str] = mapped_column(String(255))
    farmer_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    commodity: Mapped[str] = mapped_column(String(80))
    bags_count: Mapped[int] = mapped_column(Integer)
    duration_months: Mapped[int] = mapped_column(Integer)
    monthly_rent_inr: Mapped[float] = mapped_column(Float)
    total_estimated_rent_inr: Mapped[float] = mapped_column(Float)
    enwr_pledge_loan_eligible: Mapped[bool] = mapped_column(Boolean, default=True)
    booking_status: Mapped[str] = mapped_column(String(60), default="Approved by Owner (Bay Allotted)", index=True)
    owner_notified: Mapped[bool] = mapped_column(Boolean, default=True)
    manager_name: Mapped[str] = mapped_column(String(120))
    manager_phone: Mapped[str] = mapped_column(String(40))
    entry_allowed: Mapped[bool] = mapped_column(Boolean, default=True)
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class MachineryListing(Base):
    """Custom Hiring Center (CHC) equipment catalog."""
    __tablename__ = "machinery_listings"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    machinery_type: Mapped[str] = mapped_column(String(120), index=True)
    telugu_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    category: Mapped[str] = mapped_column(String(80), index=True)
    owner_name: Mapped[str] = mapped_column(String(120))
    owner_phone: Mapped[str] = mapped_column(String(40))
    district: Mapped[str] = mapped_column(String(80), index=True)
    mandal: Mapped[str] = mapped_column(String(80))
    village: Mapped[str] = mapped_column(String(120))
    state: Mapped[str] = mapped_column(String(80), default="Telangana")
    rate_inr: Mapped[float] = mapped_column(Float)
    rate_unit: Mapped[str | None] = mapped_column(String(100), nullable=True)
    pricing_type: Mapped[str] = mapped_column(String(40))
    brand_model: Mapped[str | None] = mapped_column(String(120), nullable=True)
    suitable_operations_json: Mapped[str] = mapped_column(Text, default="[]")
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    image_url: Mapped[str] = mapped_column(String(255))
    trust_label: Mapped[str] = mapped_column(String(100), default="Listed CHC Equipment")
    distance_km: Mapped[float] = mapped_column(Float, default=3.0)
    rating: Mapped[float] = mapped_column(Float, default=4.8)
    last_verified: Mapped[str] = mapped_column(String(40), default="September 2026")


class MachineryBooking(Base):
    """Machinery hire reservation records."""
    __tablename__ = "machinery_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    booking_token: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    machinery_id: Mapped[str] = mapped_column(String(40), ForeignKey("machinery_listings.id"), index=True)
    machinery_type: Mapped[str] = mapped_column(String(120))
    telugu_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    farmer_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    district: Mapped[str] = mapped_column(String(80))
    village: Mapped[str] = mapped_column(String(120))
    acres_or_hours: Mapped[float] = mapped_column(Float)
    pricing_type: Mapped[str] = mapped_column(String(40))
    rate_inr: Mapped[float] = mapped_column(Float)
    estimated_cost_inr: Mapped[float] = mapped_column(Float)
    required_date: Mapped[str] = mapped_column(String(40))
    status: Mapped[str] = mapped_column(String(80), default="Confirmed (Operator Notified for Dispatch)", index=True)
    operator_name: Mapped[str] = mapped_column(String(120))
    operator_phone: Mapped[str] = mapped_column(String(40))
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    booked_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class DirectMarketOrder(Base):
    """Direct factory delivery passes with zero-brokerage pricing."""
    __tablename__ = "direct_market_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pass_number: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    factory_id: Mapped[str] = mapped_column(String(40), index=True)
    factory_name: Mapped[str] = mapped_column(String(200))
    farmer_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    origin_district: Mapped[str] = mapped_column(String(80))
    origin_village: Mapped[str] = mapped_column(String(120))
    crop: Mapped[str] = mapped_column(String(80))
    allocated_quantity_qtl: Mapped[float] = mapped_column(Float)
    agreed_rate_per_qtl: Mapped[float] = mapped_column(Float)
    total_estimated_payout_inr: Mapped[float] = mapped_column(Float)
    broker_commission_saved_inr: Mapped[float] = mapped_column(Float)
    delivery_date: Mapped[str] = mapped_column(String(40))
    status: Mapped[str] = mapped_column(String(80), default="Gate Pass Active (Direct Entry Approved)", index=True)
    factory_owner_notified: Mapped[bool] = mapped_column(Boolean, default=True)
    entry_allowed: Mapped[bool] = mapped_column(Boolean, default=True)
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class AgriKhataEntry(Base):
    """Farmer financial ledger and breakeven calculations."""
    __tablename__ = "agri_khata_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    entry_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    farmer_name: Mapped[str] = mapped_column(String(120))
    crop: Mapped[str] = mapped_column(String(80), index=True)
    acres: Mapped[float] = mapped_column(Float)
    total_cost: Mapped[float] = mapped_column(Float)
    total_yield_quintals: Mapped[float] = mapped_column(Float)
    breakeven_price_per_qtl: Mapped[float] = mapped_column(Float)
    expected_market_price_per_qtl: Mapped[float] = mapped_column(Float)
    net_profit_projected: Mapped[float] = mapped_column(Float)
    expenses_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class SeedGrievance(Base):
    """Spurious seed failure complaint records."""
    __tablename__ = "seed_grievances"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    complaint_id: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    farmer_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    village: Mapped[str] = mapped_column(String(120))
    district: Mapped[str] = mapped_column(String(80), index=True)
    dealer_name: Mapped[str] = mapped_column(String(120))
    seed_brand: Mapped[str] = mapped_column(String(120))
    lot_number: Mapped[str] = mapped_column(String(80), index=True)
    germination_failed_percent: Mapped[float] = mapped_column(Float)
    notes: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(60), default="Under Department Review", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class BroadcastAlert(Base):
    """District emergency advisories and pest notifications."""
    __tablename__ = "broadcast_alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    alert_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    district: Mapped[str] = mapped_column(String(80), index=True)
    state: Mapped[str] = mapped_column(String(80), default="Telangana")
    severity: Mapped[str] = mapped_column(String(40), default="high")  # moderate, high, critical
    target_crop: Mapped[str] = mapped_column(String(80), default="All Crops")
    advisory: Mapped[str] = mapped_column(Text)
    issued_by: Mapped[str] = mapped_column(String(120), default="Mandal Agriculture Officer")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class AuditLog(Base):
    """Immutable audit logging for security, privilege, and compliance events."""
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    username: Mapped[str | None] = mapped_column(String(80), nullable=True)
    role: Mapped[str | None] = mapped_column(String(40), nullable=True)
    action: Mapped[str] = mapped_column(String(80), index=True)  # LOGIN, REGISTER, CLAIM_STATUS_UPDATE, BROADCAST_CREATED, etc.
    resource_type: Mapped[str] = mapped_column(String(60))
    resource_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    details_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(60), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
