"""
RythuSetu Crop Loss Assistant & PMFBY Preparation Pack Engine
Architecture: Agricultural Intelligence + Farmer Action Platform
Flow: KNOW -> COMPARE -> PREPARE -> ACT

Important:
RythuSetu is NOT a government department or insurance intermediary.
RythuSetu prepares information and helps farmers navigate the statutory PMFBY 72-hour process.
Final submission, approval, and settlement are determined exclusively by the official authority.
"""

from __future__ import annotations

import datetime
from typing import Any
from sqlalchemy.orm import Session
from app.models import CropLossReport, ClaimEvent, FarmerProfile
from app.db_init import log_audit


PMFBY_OFFICIAL_PORTAL = "https://pmfby.gov.in"
PMFBY_OFFICIAL_HELPLINE = "14447"
PMFBY_ALTERNATIVE_HELPLINE = "1800-180-1551"


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
            "Within mandatory 72-hour statutory PMFBY intimation window."
            if is_within
            else f"Occurred {round(hours_elapsed - 72.0, 1)} hours past standard 72-hour window. Official insurance condonation may be required."
        ),
    }


def validate_crop_loss_completeness(
    crop: str,
    damage_type: str,
    loss_date: str,
    affected_area_acres: float,
    description: str,
    district: str,
    mandal: str | None = None,
    village: str | None = None,
    survey_number: str | None = None,
    evidence_filename: str | None = None,
) -> dict[str, Any]:
    """
    Validates completeness of farmer loss data before generating preparation pack.
    Identifies missing mandatory information and recommended official items.
    """
    missing_mandatory: list[str] = []
    missing_recommended: list[str] = []

    if not crop or not crop.strip():
        missing_mandatory.append("Crop Name")
    if not damage_type or not damage_type.strip():
        missing_mandatory.append("Cause of Damage (e.g. Inundation, Hailstorm, Cyclone)")
    if not loss_date or not loss_date.strip():
        missing_mandatory.append("Date of Loss Occurrence")
    if affected_area_acres is None or affected_area_acres <= 0:
        missing_mandatory.append("Affected Land Area (in acres)")
    if not description or len(description.strip()) < 10:
        missing_mandatory.append("Detailed Loss Description (at least 10 characters)")
    if not district or not district.strip():
        missing_mandatory.append("District")

    # Recommended for official PMFBY filing
    if not mandal or not mandal.strip():
        missing_recommended.append("Mandal / Taluk")
    if not village or not village.strip():
        missing_recommended.append("Village / Revenue Village")
    if not survey_number or not survey_number.strip():
        missing_recommended.append("Survey / Field Identifier (Pahani / Khasra number)")
    if not evidence_filename:
        missing_recommended.append("Geotagged Damage Photographs")

    total_checks = 10
    passed_checks = total_checks - len(missing_mandatory) - len(missing_recommended)
    completeness_score = int((passed_checks / total_checks) * 100)

    is_complete = len(missing_mandatory) == 0

    return {
        "is_complete": is_complete,
        "completeness_score": completeness_score,
        "missing_mandatory": missing_mandatory,
        "missing_recommended": missing_recommended,
        "can_generate_pack": is_complete,
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
    survey_number: str | None = None,
    mandal: str | None = None,
    village: str | None = None,
) -> dict[str, Any]:
    """
    Generates a structured 'Crop Loss Preparation Pack' for official filing.
    Provides verified official PMFBY portal links, helplines, and actionable checklists.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    window_info = calculate_reporting_window(loss_date)

    if not reference_number:
        farmer_id = getattr(farmer, "id", 101)
        serial = (farmer_id * 31 + int(damage_percent * 7)) % 8999 + 1000
        ref_number = f"RYTHU-PACK-2026-{serial:04d}"
    else:
        ref_number = reference_number

    # District & Mandal resolution
    dist = getattr(farmer, "district", "Warangal")
    man = mandal or getattr(farmer, "mandal", "")
    vil = village or getattr(farmer, "village", "")
    surv = survey_number or ""

    # Scale of finance reference benchmark (~INR 30,000 to 45,000 per acre depending on crop)
    scale_of_finance = 35000.0 if "chilli" in crop.lower() else (30000.0 if "cotton" in crop.lower() else 25000.0)
    estimated_sum_insured = affected_area_acres * scale_of_finance
    estimated_eligible_relief = estimated_sum_insured * (damage_percent / 100.0)

    stages = [
        {
            "step": 1,
            "title": "Preparation Dossier Ready",
            "status": "Completed",
            "date": now.strftime("%Y-%m-%d %H:%M UTC"),
            "detail": f"RythuSetu Preparation Pack {ref_number} assembled with farm details and damage narrative.",
        },
        {
            "step": 2,
            "title": "Report to Official PMFBY Channel",
            "status": "Action Required by Farmer",
            "date": "Within 72 hours of damage",
            "detail": f"File intimation directly on {PMFBY_OFFICIAL_PORTAL} or call Toll-Free {PMFBY_OFFICIAL_HELPLINE}.",
        },
        {
            "step": 3,
            "title": "Save Official Docket / Reference Number",
            "status": "Pending Farmer Input",
            "date": "Upon official reporting",
            "detail": "Record the official reference number provided by PMFBY / Insurance Company in RythuSetu Action Center.",
        },
        {
            "step": 4,
            "title": "Official Survey & Adjudication",
            "status": "Official Determination",
            "date": "Subject to Official Agricultural Authority",
            "detail": "Joint field survey conducted by official surveyor. Status must be tracked directly on the official PMFBY portal.",
        },
    ]

    return {
        "reference_number": ref_number,
        "pack_id": ref_number,
        "title": "PMFBY Crop Loss Preparation Pack",
        "scheme": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "generated_at": now.isoformat(),
        "reporting_compliance": window_info,
        "farmer": {
            "name": getattr(farmer, "name", "Cultivator"),
            "state": getattr(farmer, "state", "Telangana"),
            "district": dist,
            "mandal": man,
            "village": vil,
            "survey_number": surv,
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
            "valuation_note": "Indicative planning estimate based on SLBC crop finance scale. Official settlement depends entirely on official joint field survey.",
        },
        "required_documents_checklist": [
            {"doc": "Land Record (Pahani / RoR 1-B / Adangal / Tenancy Passbook)", "status": "Required for Official Filing"},
            {"doc": "Crop Sowing Certificate / Adangal verification", "status": "Required for Official Filing"},
            {"doc": "Timestamped Geo-tagged Crop Loss Photographs", "status": "Ready in Dossier"},
            {"doc": "Aadhaar-Seeded Bank Passbook Copy (NPCI active)", "status": "Required for Official Filing"},
        ],
        "official_reporting_instructions": [
            f"1. Open the official PMFBY portal at {PMFBY_OFFICIAL_PORTAL} or the PMFBY Crop Insurance mobile app.",
            f"2. Alternatively, dial the 24/7 Kisan Call Centre / PMFBY Helpline at {PMFBY_OFFICIAL_HELPLINE} or {PMFBY_ALTERNATIVE_HELPLINE}.",
            "3. State your Aadhaar number, policy/application number, survey number, and incident date.",
            "4. Receive your official PMFBY Docket / Claim Intimation Reference Number.",
            "5. Return to RythuSetu and save your official reference number to maintain your personal action records.",
        ],
        "official_action_links": {
            "portal_url": PMFBY_OFFICIAL_PORTAL,
            "helpline": PMFBY_OFFICIAL_HELPLINE,
            "alternative_helpline": PMFBY_ALTERNATIVE_HELPLINE,
        },
        "lifecycle_stages": stages,
        "official_disclaimer": (
            "RythuSetu is an agricultural intelligence and preparation platform, NOT a government department or insurance intermediary. "
            "RythuSetu does NOT submit your claim to the government or insurance provider. "
            "Final claim registration, survey assessment, and payout decisions are made exclusively by the authorized government agency and insurance company."
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
    survey_number: str | None = None,
    mandal: str | None = None,
    village: str | None = None,
) -> CropLossReport:
    """
    Persists a crop loss preparation dossier into the database with audit tracking.
    Initial status is 'PREPARATION_READY'.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    window_info = calculate_reporting_window(loss_date)

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
        survey_number=survey_number,
        mandal=mandal,
        village=village,
        status="PREPARATION_READY",
        farmer_self_status="PREPARATION_READY",
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
        new_status="PREPARATION_READY",
        notes=f"Crop Loss Preparation Pack generated. 72hr statutory compliance: {window_info['is_within_window']}",
        created_at=now,
    )
    db.add(initial_event)
    db.commit()
    db.refresh(claim)

    log_audit(
        db=db,
        action="PREPARE_CROP_LOSS_PACK",
        resource_type="claim",
        resource_id=claim.reference_number,
        details={
            "farmer_id": farmer_id,
            "crop": crop,
            "damage_type": damage_type,
            "survey_number": survey_number,
            "is_within_window": claim.is_within_window,
        },
    )

    return claim


def update_farmer_self_status(
    db: Session,
    claim_id: int,
    user: Any,
    official_reference_number: str,
    farmer_self_status: str = "SUBMITTED_BY_FARMER",
    submission_date: str | None = None,
    follow_up_date: str | None = None,
    notes: str | None = None,
) -> dict[str, Any]:
    """
    Enables the farmer to save their self-entered official PMFBY claim reference number,
    filing date, and follow-up reminders.
    """
    claim = db.get(CropLossReport, claim_id)
    if not claim:
        raise ValueError(f"Crop loss record #{claim_id} not found.")

    old_status = claim.status
    now = datetime.datetime.now(datetime.timezone.utc)
    sub_date = submission_date or now.strftime("%Y-%m-%d")

    claim.official_reference_number = official_reference_number.strip()
    claim.farmer_self_status = farmer_self_status
    claim.status = farmer_self_status
    claim.submission_date = sub_date
    if follow_up_date:
        claim.follow_up_date = follow_up_date
    if notes:
        claim.farmer_notes = notes
    claim.updated_at = now

    event = ClaimEvent(
        claim_id=claim.id,
        actor_id=getattr(user, "id", None),
        actor_role="farmer",
        actor_name=getattr(user, "name", "Cultivator"),
        old_status=old_status,
        new_status=farmer_self_status,
        notes=f"Farmer recorded official PMFBY reference number: {official_reference_number}. Notes: {notes or 'None'}",
        created_at=now,
    )
    db.add(event)
    db.commit()
    db.refresh(claim)

    log_audit(
        db=db,
        action="RECORD_OFFICIAL_CLAIM_REF",
        resource_type="claim",
        resource_id=claim.reference_number,
        details={
            "official_reference_number": official_reference_number,
            "farmer_self_status": farmer_self_status,
        },
    )

    return {
        "status": "success",
        "reference_number": claim.reference_number,
        "official_reference_number": claim.official_reference_number,
        "farmer_self_status": claim.farmer_self_status,
        "submission_date": claim.submission_date,
        "follow_up_date": claim.follow_up_date,
        "notes": claim.farmer_notes,
        "notice": "Official reference number saved by you. Official status must be checked directly on pmfby.gov.in.",
    }


def get_claim_lifecycle_status(db: Session, reference_number: str) -> dict[str, Any] | None:
    """
    Retrieves the authentic preparation and self-tracked state of a crop loss dossier.
    Distinguishes RythuSetu preparation state from official status.
    """
    raw_ref = reference_number.strip()
    claim = db.query(CropLossReport).filter(CropLossReport.reference_number == raw_ref).first()
    if not claim and raw_ref.isdigit():
        claim = db.get(CropLossReport, int(raw_ref))

    if not claim:
        return None

    events = (
        db.query(ClaimEvent)
        .filter(ClaimEvent.claim_id == claim.id)
        .order_by(ClaimEvent.created_at.asc())
        .all()
    )

    has_official_ref = bool(claim.official_reference_number)

    stages = [
        {
            "step": 1,
            "title": "Preparation Dossier Created",
            "status": "Completed",
            "date": claim.submitted_at.strftime("%Y-%m-%d %H:%M UTC"),
            "detail": f"RythuSetu Preparation Pack {claim.reference_number} generated with farm & loss details.",
        },
        {
            "step": 2,
            "title": "Report via Official PMFBY Channel",
            "status": "Completed by Farmer" if has_official_ref else "Action Required",
            "date": claim.submission_date or "Within 72 hours of damage",
            "detail": f"Official Portal: {PMFBY_OFFICIAL_PORTAL} | Kisan Helpline: {PMFBY_OFFICIAL_HELPLINE}",
        },
        {
            "step": 3,
            "title": "Official Application / Reference Number",
            "status": f"Saved: {claim.official_reference_number}" if has_official_ref else "Not Yet Recorded",
            "date": claim.submission_date or "Pending farmer input",
            "detail": (
                f"Official Reference Number '{claim.official_reference_number}' saved by you."
                if has_official_ref
                else "Record the official reference number issued by PMFBY / insurance provider."
            ),
        },
        {
            "step": 4,
            "title": "Official Status Tracking",
            "status": "Official Status Unavailable — Check Official Portal",
            "date": "Ongoing",
            "detail": f"Track official survey & payment status directly on {PMFBY_OFFICIAL_PORTAL} using reference #{claim.official_reference_number or '[Your Reference No]'}.",
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
        "survey_number": claim.survey_number or "",
        "mandal": claim.mandal or "",
        "village": claim.village or "",
        "official_reference_number": claim.official_reference_number or "",
        "farmer_self_status": claim.farmer_self_status or "PREPARATION_READY",
        "submission_date": claim.submission_date or "",
        "follow_up_date": claim.follow_up_date or "",
        "farmer_notes": claim.farmer_notes or "",
        "verifier_notes": claim.verifier_notes or claim.officer_notes or "",
        "officer_notes": claim.officer_notes or claim.verifier_notes or "",
        "is_within_window": claim.is_within_window,
        "submitted_at": claim.submitted_at.isoformat(),
        "last_updated": claim.updated_at.strftime("%Y-%m-%d %H:%M UTC"),
        "stages": stages,
        "audit_events": event_trail,
        "official_portal_link": PMFBY_OFFICIAL_PORTAL,
        "official_helpline": PMFBY_OFFICIAL_HELPLINE,
        "disclaimer": (
            "RythuSetu is an independent advisory and preparation platform. "
            "RythuSetu does not submit claims or approve government funds. "
            "Official adjudication is conducted exclusively by the Department of Agriculture and Insurance Providers."
        ),
    }
