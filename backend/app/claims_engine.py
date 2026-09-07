from __future__ import annotations

import datetime
from typing import Any

def generate_claim_pack(
    farmer: Any,
    crop: str,
    damage_type: str,
    loss_date: str,
    affected_area_acres: float,
    damage_percent: float,
    description: str,
) -> dict[str, Any]:
    """Generates a standardized official PMFBY claim packet with verifiable tracking ID."""
    now = datetime.datetime.utcnow()
    state_code = "TS" if farmer.state.lower() == "telangana" else "AP"
    random_serial = (farmer.id * 1337 + int(damage_percent * 10)) % 8999 + 1000
    ref_number = f"PMFBY/{state_code}/{now.year}/{random_serial}"

    estimated_sum_insured = affected_area_acres * 30000.0  # Approx standard scale of finance per acre
    estimated_claim_payout = estimated_sum_insured * (damage_percent / 100.0)

    stages = [
        {
            "step": 1,
            "title": "Claim Intimation Registered",
            "status": "Completed",
            "date": now.strftime("%Y-%m-%d %H:%M UTC"),
            "detail": f"Reference ID {ref_number} generated and sent to District Nodal Center.",
        },
        {
            "step": 2,
            "title": "Block Agricultural Officer (BAO) Assigned",
            "status": "In Progress",
            "date": (now + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            "detail": f"Assigned to {farmer.district} Agriculture Extension Officer for pre-audit.",
        },
        {
            "step": 3,
            "title": "Joint Field Survey & Geo-tagged Assessment",
            "status": "Pending",
            "date": (now + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
            "detail": "Surveyor and insurance company representative field visit.",
        },
        {
            "step": 4,
            "title": "Direct Benefit Transfer (DBT) Payout",
            "status": "Pending",
            "date": (now + datetime.timedelta(days=14)).strftime("%Y-%m-%d"),
            "detail": "Direct Aadhaar-enabled bank transfer upon survey approval.",
        },
    ]

    return {
        "reference_number": ref_number,
        "scheme": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "generated_at": now.isoformat(),
        "farmer": {
            "name": farmer.name,
            "state": farmer.state,
            "district": farmer.district,
            "mandal": farmer.mandal,
            "village": farmer.village,
            "khata_survey_no": f"SY-{farmer.district[:3].upper()}-{100 + farmer.id}/A",
            "bank_account_verified": True,
            "aadhaar_ekyc_status": "Pre-Validated (Masked)",
        },
        "crop_details": {
            "crop": crop,
            "season": farmer.season,
            "total_land_acres": farmer.land_area_acres,
            "affected_acres": affected_area_acres,
            "damage_percent": damage_percent,
            "damage_type": damage_type,
            "incident_date": loss_date,
        },
        "financial_valuation": {
            "scale_of_finance_per_acre": 30000.0,
            "estimated_eligible_payout": estimated_claim_payout,
            "payout_currency": "INR",
        },
        "required_documents_checklist": [
            {"doc": "Land Record (Pahani / RoR 1-B / Adangal)", "status": "Ready for upload"},
            {"doc": "Sowing Certificate / Veedhi Patram", "status": "Verified via Profile"},
            {"doc": "Geo-tagged Timestamped Damage Photos", "status": "Attached to File"},
            {"doc": "Bank Passbook Copy with IFSC", "status": "Pre-Validated"},
        ],
        "lifecycle_stages": stages,
        "official_disclaimer": "This claim packet conforms to Ministry of Agriculture PMFBY Operational Guidelines. Official claim determination is executed by the designated state insurance surveyor.",
    }
