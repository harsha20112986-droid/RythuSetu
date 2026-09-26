from __future__ import annotations

import datetime
from typing import Any
from sqlalchemy.orm import Session
from app.models import CropLossReport, ClaimEvent, FarmerProfile
from app.db_init import log_audit


def calculate_reporting_window(loss_date_str: str) -> dict[str, Any]:
    """
    Computes whether a reported loss is within the statutory 72-hour PMFBY intimation window.
    """
    try:
        clean_date = loss_date_str.strip().replace("Z", "+00:00")
        if "T" in clean_date:
            dt = datetime.datetime.fromisoformat(clean_date)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=datetime.timezone.utc)
        else:
            dt = datetime.datetime.strptime(clean_date[:10], "%Y-%m-%d").replace(tzinfo=datetime.timezone.utc)
    except Exception:
        dt = datetime.datetime.now(datetime.timezone.utc)

    now = datetime.datetime.now(datetime.timezone.utc)
    diff = now - dt
    hours_elapsed = max(0.0, diff.total_seconds() / 3600.0)
    is_within = hours_elapsed <= 72.0
    remaining_hours = max(0.0, 72.0 - hours_elapsed) if is_within else 0.0

    return {
        "is_within_window": is_within,
        "hours_elapsed": round(hours_elapsed, 1),
        "remaining_hours": round(remaining_hours, 1),
        "reporting_window_hours": 72,
        "status_notice": (
            "Within mandatory 72-hour PMFBY intimation window."
            if is_within
            else f"Reported {round(hours_elapsed - 72.0, 1)} hours past standard 72-hr deadline. Officer condonation approval required."
        ),
    }


def generate_claim_pack(
    farmer: Any,
    crop: str,
    damage_type: str,
    loss_date: str,
    affected_area_acres: float,
    damage_percent: float,
    description: str,
    reference_number: str | None = None,
) -> dict[str, Any]:
    """
    Generates a standardized PMFBY Claim Preparation Assistance packet.
    Clearly discloses facilitation role and avoids promising automated government payouts.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    window_info = calculate_reporting_window(loss_date)

    if not reference_number:
        farmer_id = getattr(farmer, "id", 101)
        serial = (farmer_id * 31 + int(damage_percent * 7)) % 8999 + 1000
        ref_number = f"RYTHU-CLAIM-2026-{serial:04d}"
    else:
        ref_number = reference_number

    # Standard SLBC scale of finance reference benchmark (~INR 30,000 to 45,000 per acre depending on crop)
    scale_of_finance = 35000.0 if "chilli" in crop.lower() else (30000.0 if "cotton" in crop.lower() else 25000.0)
    estimated_sum_insured = affected_area_acres * scale_of_finance
    estimated_eligible_relief = estimated_sum_insured * (damage_percent / 100.0)

    stages = [
        {
            "step": 1,
            "title": "Intimation Dossier Prepared & Logged",
            "status": "Completed",
            "date": now.strftime("%Y-%m-%d %H:%M UTC"),
            "detail": f"Reference ID {ref_number} generated. Prepared with geo-evidence and cultivator profile.",
        },
        {
            "step": 2,
            "title": "Dossier Submission to AEO / CSC / PMFBY Portal",
            "status": "In Progress",
            "date": (now + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            "detail": f"Submit this packet to {getattr(farmer, 'district', 'Warangal')} Agriculture Extension Officer (AEO) or nearest CSC.",
        },
        {
            "step": 3,
            "title": "Joint Field Survey & Geo-tagged Inspection",
            "status": "Pending",
            "date": "Scheduled following official intimation",
            "detail": "Mandal Agriculture Officer and empanelled insurance surveyor conduct physical assessment and CCE verification.",
        },
        {
            "step": 4,
            "title": "Official Claim Adjudication & Settlement",
            "status": "Pending",
            "date": "Subject to District Level Monitoring Committee (DLMC)",
            "detail": "Direct Benefit Transfer (DBT) executed directly to farmer Aadhaar-seeded bank account by insurance company.",
        },
    ]

    return {
        "reference_number": ref_number,
        "scheme": "Pradhan Mantri Fasal Bima Yojana (PMFBY) - Claim Preparation Assistance",
        "generated_at": now.isoformat(),
        "reporting_compliance": window_info,
        "farmer": {
            "name": getattr(farmer, "name", "Cultivator"),
            "state": getattr(farmer, "state", "Telangana"),
            "district": getattr(farmer, "district", "Warangal"),
            "mandal": getattr(farmer, "mandal", ""),
            "village": getattr(farmer, "village", ""),
            "land_area_acres": getattr(farmer, "land_area_acres", 2.0),
        },
        "crop_details": {
            "crop": crop,
            "season": getattr(farmer, "season", "Kharif"),
            "total_land_acres": getattr(farmer, "land_area_acres", 2.0),
            "affected_acres": affected_area_acres,
            "damage_percent": damage_percent,
            "damage_type": damage_type,
            "incident_date": loss_date,
            "description": description,
        },
        "financial_valuation": {
            "benchmark_scale_of_finance_per_acre": scale_of_finance,
            "estimated_eligible_relief_benchmark": round(estimated_eligible_relief, 2),
            "currency": "INR",
            "valuation_note": "Benchmark estimate based on SLBC crop finance scale. Official settlement depends on joint survey finding.",
        },
        "required_documents_checklist": [
            {"doc": "Land Record (Pahani / RoR 1-B / Adangal or Cultivator Tenancy Card)", "status": "Required for Official Filing"},
            {"doc": "Sowing Certificate / Veedhi Patram from Local VAA / AEO", "status": "Ready from Profile"},
            {"doc": "Timestamped Geo-tagged Crop Loss Photographs", "status": "Attached to Dossier"},
            {"doc": "Aadhaar-Seeded Bank Passbook Copy (IFSC + Account No)", "status": "Required for Official Filing"},
        ],
        "lifecycle_stages": stages,
        "official_disclaimer": (
            "RythuSetu is an agricultural technology platform providing claim preparation and intimation dossier assistance. "
            "RythuSetu does not adjudicate claims or disburse government funds. Official PMFBY survey, loss assessment, and "
            "settlement are conducted exclusively by the Department of Agriculture and Empanelled Insurance Companies per central guidelines."
        ),
    }


def save_claim_intimation(
    db: Session,
    farmer_id: int,
    crop: str,
    damage_type: str,
    loss_date: str,
    affected_area_acres: float,
    damage_percent: float,
    description: str,
    evidence_filename: str | None = None,
) -> CropLossReport:
    """
    Persists a crop loss report into the database with audit tracking.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    window_info = calculate_reporting_window(loss_date)

    # Count existing claims to generate next sequential reference
    existing_count = db.query(CropLossReport).count()
    ref_number = f"RYTHU-CLAIM-2026-{existing_count + 1001:04d}"

    claim = CropLossReport(
        reference_number=ref_number,
        farmer_id=farmer_id,
        crop=crop,
        damage_type=damage_type,
        loss_date=loss_date,
        affected_area_acres=affected_area_acres,
        damage_percent=damage_percent,
        description=description,
        evidence_filename=evidence_filename,
        status="Submitted",
        reporting_window_hours=72,
        is_within_window=window_info["is_within_window"],
        submitted_at=now,
        updated_at=now,
    )
    db.add(claim)
    db.flush()

    # Record initial audit event
    initial_event = ClaimEvent(
        claim_id=claim.id,
        actor_id=None,
        actor_role="farmer",
        actor_name=f"Cultivator #{farmer_id}",
        old_status="New",
        new_status="Submitted",
        notes=f"PMFBY Loss Intimation filed. 72hr compliance: {window_info['is_within_window']}",
        created_at=now,
    )
    db.add(initial_event)
    db.commit()
    db.refresh(claim)

    log_audit(
        db=db,
        action="CREATE_CLAIM",
        resource_type="claim",
        resource_id=claim.reference_number,
        details={
            "farmer_id": farmer_id,
            "crop": crop,
            "damage_type": damage_type,
            "is_within_window": claim.is_within_window,
        },
    )

    return claim


def get_claim_lifecycle_status(db: Session, reference_number: str) -> dict[str, Any] | None:
    """
    Retrieves the authentic lifecycle tracking state of a claim from database records.
    """
    raw_ref = reference_number.strip()
    claim = db.query(CropLossReport).filter(CropLossReport.reference_number == raw_ref).first()
    if not claim and raw_ref.isdigit():
        claim = db.get(CropLossReport, int(raw_ref))

    if not claim:
        return None

    now = datetime.datetime.now(datetime.timezone.utc)
    events = (
        db.query(ClaimEvent)
        .filter(ClaimEvent.claim_id == claim.id)
        .order_by(ClaimEvent.created_at.asc())
        .all()
    )

    status_lower = claim.status.lower()
    is_step_1_done = True
    is_step_2_done = any(k in status_lower for k in ["inspect", "verif", "approv", "disburs", "paid"])
    is_step_3_done = any(k in status_lower for k in ["approv", "disburs", "paid"])
    is_step_4_done = any(k in status_lower for k in ["disburs", "paid"])

    stages = [
        {
            "step": 1,
            "title": "Claim Intimation Registered",
            "status": "Completed",
            "date": claim.submitted_at.strftime("%Y-%m-%d %H:%M UTC"),
            "detail": f"Reference ID {claim.reference_number} recorded in RythuSetu registry.",
        },
        {
            "step": 2,
            "title": "Block Agricultural Officer (BAO) Field Inspection",
            "status": "Completed" if is_step_2_done else ("In Progress" if claim.status == "Submitted" else "Pending"),
            "date": claim.updated_at.strftime("%Y-%m-%d") if is_step_2_done else "Pending Inspection",
            "detail": claim.officer_notes or "Field inspection by local Agriculture Extension Officer.",
        },
        {
            "step": 3,
            "title": "Joint Survey & DLMC Committee Review",
            "status": "Completed" if is_step_3_done else ("In Progress" if is_step_2_done and not is_step_3_done else "Pending"),
            "date": claim.updated_at.strftime("%Y-%m-%d") if is_step_3_done else "Scheduled upon inspection completion",
            "detail": "Verification of crop loss percentage and satellite/weather trigger correlation.",
        },
        {
            "step": 4,
            "title": "Direct Benefit Transfer (DBT) Relief Disbursal",
            "status": "Completed" if is_step_4_done else "Pending",
            "date": claim.updated_at.strftime("%Y-%m-%d") if is_step_4_done else "Awaiting official sanction",
            "detail": "Direct Aadhaar-linked payout by insurance company via central PMFBY portal.",
        },
    ]

    event_trail = [
        {
            "id": ev.id,
            "actor_name": ev.actor_name,
            "actor_role": ev.actor_role,
            "old_status": ev.old_status,
            "new_status": ev.new_status,
            "notes": ev.notes,
            "timestamp": ev.created_at.strftime("%d %b %Y, %H:%M UTC"),
        }
        for ev in events
    ]

    return {
        "reference_number": claim.reference_number,
        "current_status": claim.status,
        "crop": claim.crop,
        "damage_type": claim.damage_type,
        "affected_area_acres": claim.affected_area_acres,
        "damage_percent": claim.damage_percent,
        "officer_notes": claim.officer_notes,
        "is_within_window": claim.is_within_window,
        "submitted_at": claim.submitted_at.isoformat(),
        "last_updated": claim.updated_at.strftime("%Y-%m-%d %H:%M UTC"),
        "stages": stages,
        "audit_events": event_trail,
        "disclaimer": (
            "RythuSetu facilitates PMFBY claim preparation and tracking. "
            "Official adjudication is conducted by the Department of Agriculture and Insurance Providers."
        ),
    }
