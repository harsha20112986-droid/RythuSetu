from __future__ import annotations

from datetime import datetime

ALLOWED_DAMAGE_TYPES = {
    "Flood / Heavy Rain",
    "Drought / Heat",
    "Pest Attack",
    "Crop Disease",
    "Hail / Storm",
    "Other",
}


def build_next_step(status: str) -> str:
    if status == "Submitted":
        return "Keep the original photos and supporting records. Check the applicable official government or crop-insurance process for your area."
    return "Follow the official process linked from RythuSetu and keep your supporting records."


def make_report_payload(*, crop: str, damage_type: str, loss_date: str, affected_area_acres: float, damage_percent: float, description: str, evidence_filename: str | None) -> dict:
    return {
        "crop": crop,
        "damage_type": damage_type,
        "loss_date": loss_date,
        "affected_area_acres": affected_area_acres,
        "damage_percent": damage_percent,
        "description": description,
        "evidence_filename": evidence_filename,
        "status": "Submitted",
        "submitted_at": datetime.utcnow(),
    }
