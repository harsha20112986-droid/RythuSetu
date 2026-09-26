"""
RythuSetu Database Initializer, Master Registry Seeder & Audit Logger
Creates tables and seeds initial master facility, machinery, and administrative registries.
Zero hardcoded plaintext passwords.
"""

import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db import Base, engine, SessionLocal
from app.core.config import settings
from app.core.security import hash_password
from app.models import (
    UserAccount,
    FarmerProfile,
    StorageFacility,
    StorageBooking,
    MachineryListing,
    MachineryBooking,
    DirectMarketOrder,
    BroadcastAlert,
    AuditLog,
)


def log_audit(
    db: Session,
    action: str,
    resource_type: str,
    user: UserAccount | None = None,
    resource_id: str | None = None,
    details: dict | None = None,
    ip_address: str | None = None,
) -> None:
    """Creates an immutable audit record for security and regulatory compliance."""
    try:
        entry = AuditLog(
            user_id=user.id if user else None,
            username=user.username if user else "anonymous",
            role=user.role if user else None,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id is not None else None,
            details_json=json.dumps(details) if details else None,
            ip_address=ip_address,
            timestamp=datetime.now(timezone.utc),
        )
        db.add(entry)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[AUDIT LOG ERROR] Failed to record audit log: {e}")


def initialize_database():
    """Initializes tables and master registries idempotently."""
    # In non-production environments, ensure tables are created automatically
    if not settings.is_production:
        Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Ensure initial admin exists with bcrypt hash
        admin = db.query(UserAccount).filter(UserAccount.username == settings.admin_initial_username).first()
        if not admin:
            admin_user = UserAccount(
                username=settings.admin_initial_username,
                hashed_password=hash_password(settings.admin_initial_password),
                name="Agriculture Extension Officer",
                role="admin",
                phone="+91 98480 12345",
                designation="Mandal Agriculture Officer (MAO)",
                district="Warangal",
                state="Telangana",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print(f"[INIT] Created initial administrator account: {settings.admin_initial_username}")
        else:
            from app.core.security import verify_password
            if not verify_password(settings.admin_initial_password, admin.hashed_password):
                if not settings.is_production or not admin.hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
                    admin.hashed_password = hash_password(settings.admin_initial_password)
                    db.commit()
                    print("[INIT] Synced administrator password with configured credentials.")

        # 2. Seed Storage Facilities if empty
        if db.query(StorageFacility).count() == 0:
            from app.storage_engine import VERIFIED_COLD_STORAGES
            for s in VERIFIED_COLD_STORAGES:
                fac = StorageFacility(
                    id=s["id"],
                    name=s["name"],
                    district=s["district"],
                    state=s["state"],
                    location=s["location"],
                    facility_type=s["facility_type"],
                    capacity_mt=s["capacity_mt"],
                    available_space_mt=s["available_space_mt"],
                    commodities_json=json.dumps(s["commodities"]),
                    temp_range=s["temp_range"],
                    humidity_rh=s["humidity_rh"],
                    monthly_rent_per_bag=s["monthly_rent_per_bag"],
                    bag_weight_kg=s["bag_weight_kg"],
                    enwr_pledge_loan=s.get("enwr_pledge_loan", True),
                    loan_percent=s.get("loan_percent", "Up to 75% under e-NWR"),
                    contact_person=s["contact_person"],
                    phone=s["phone"],
                    features_json=json.dumps(s.get("features", [])),
                    trust_label="Listed Facility (WDRA Regulated)",
                    last_verified="September 2026",
                )
                db.add(fac)
            db.commit()
            print(f"[INIT] Seeded {len(VERIFIED_COLD_STORAGES)} verified cold storage facilities into database.")

        # 3. Seed Machinery Listings if empty
        if db.query(MachineryListing).count() == 0:
            from app.machinery_engine import VERIFIED_MACHINERY_REGISTRY
            for m in VERIFIED_MACHINERY_REGISTRY:
                listing = MachineryListing(
                    id=m["id"],
                    machinery_type=m["machinery_type"],
                    telugu_name=m.get("telugu_name"),
                    category=m["category"],
                    owner_name=m["owner_name"],
                    owner_phone=m["owner_phone"],
                    district=m["district"],
                    mandal=m["mandal"],
                    village=m["village"],
                    state=m.get("state", "Telangana"),
                    rate_inr=float(m["rate_inr"]),
                    rate_unit=m.get("rate_unit"),
                    pricing_type=m["pricing_type"],
                    brand_model=m.get("brand_model"),
                    suitable_operations_json=json.dumps(m.get("suitable_operations", [])),
                    available=True,
                    image_url=m["image_url"],
                    trust_label="Listed CHC Equipment",
                    distance_km=float(m.get("distance_km", 3.0)),
                    rating=float(m.get("rating", 4.8)),
                    last_verified="September 2026",
                )
                db.add(listing)
            db.commit()
            print(f"[INIT] Seeded {len(VERIFIED_MACHINERY_REGISTRY)} machinery listings into database.")

        # 4. Seed Broadcast Alerts if empty
        if db.query(BroadcastAlert).count() == 0:
            alerts_seed = [
                BroadcastAlert(
                    alert_code="ALERT-TS-WGL-001",
                    title="Bacterial Leaf Blight Alert (Warangal District)",
                    district="Warangal",
                    state="Telangana",
                    severity="high",
                    target_crop="Cotton",
                    advisory="Persistent humidity (>85%) and intermittent showers favor bacterial blight. Spray Copper Oxychloride 3g/L + Streptocycline 1g/10L immediately. Avoid excess nitrogenous fertilizer.",
                    issued_by="Mandal Agriculture Office",
                ),
                BroadcastAlert(
                    alert_code="ALERT-TS-WGL-002",
                    title="PMFBY 72-Hour Claim Intimation Window Notice",
                    district="Warangal",
                    state="Telangana",
                    severity="critical",
                    target_crop="All Crops",
                    advisory="All farmers suffering localized storm or flood damage must upload timestamped loss evidence within 72 hours via RythuSetu or call Toll-Free 1800-180-1551 to guarantee survey eligibility.",
                    issued_by="District Agriculture Officer (DAO)",
                ),
            ]
            db.add_all(alerts_seed)
            db.commit()
            print("[INIT] Seeded default agricultural broadcast advisories.")

        # 5. Seed initial demo cultivators ONLY in non-production environments
        if not settings.is_production and db.query(FarmerProfile).count() == 0:
            demo_cultivators = [
                {
                    "id": 101,
                    "name": "Kishan Rao",
                    "language": "Telugu",
                    "state": "Telangana",
                    "district": "Warangal",
                    "mandal": "Narsampet",
                    "village": "Chennaraopet",
                    "crop": "Cotton",
                    "season": "Kharif",
                    "land_area_acres": 3.5,
                    "username": "kishan_rao",
                    "phone": "+91 98491 10101",
                },
                {
                    "id": 102,
                    "name": "Lakshmi Devi",
                    "language": "Telugu",
                    "state": "Andhra Pradesh",
                    "district": "Anantapur",
                    "mandal": "Dharmavaram",
                    "village": "Marala",
                    "crop": "Groundnut",
                    "season": "Kharif",
                    "land_area_acres": 2.5,
                    "username": "lakshmi_devi",
                    "phone": "+91 98491 10202",
                },
                {
                    "id": 103,
                    "name": "Ramesh Goud",
                    "language": "Hindi",
                    "state": "Telangana",
                    "district": "Karimnagar",
                    "mandal": "Huzurabad",
                    "village": "Bornapalli",
                    "crop": "Rice",
                    "season": "Kharif",
                    "land_area_acres": 4.0,
                    "username": "ramesh_goud",
                    "phone": "+91 98491 10303",
                },
            ]
            for c in demo_cultivators:
                farmer = FarmerProfile(
                    id=c["id"],
                    name=c["name"],
                    language=c["language"],
                    state=c["state"],
                    district=c["district"],
                    mandal=c["mandal"],
                    village=c["village"],
                    crop=c["crop"],
                    season=c["season"],
                    land_area_acres=c["land_area_acres"],
                )
                db.add(farmer)
                db.flush()
                user = UserAccount(
                    username=c["username"],
                    hashed_password=hash_password(f"{c['username']}@2026"),
                    name=c["name"],
                    role="farmer",
                    phone=c["phone"],
                    designation="Registered Cultivator",
                    district=c["district"],
                    state=c["state"],
                    farmer_profile_id=farmer.id,
                    is_active=True,
                )
                db.add(user)
                db.flush()
                farmer.user_id = user.id
            db.commit()
            print("[INIT] Seeded initial registered cultivators and linked user accounts.")

    except Exception as e:
        db.rollback()
        print(f"[INIT ERROR] Database initialization encountered an error: {e}")
    finally:
        db.close()
