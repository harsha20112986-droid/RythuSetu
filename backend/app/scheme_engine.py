"""
RythuSetu Scheme Navigator Engine
Architecture: Agricultural Intelligence + Farmer Action Platform
Flow: KNOW -> COMPARE -> PREPARE -> ACT

Important:
RythuSetu is an agricultural intelligence platform and is NOT a government department
or intermediary. It matches potentially relevant schemes based on crop, state, and farm size.
Final eligibility, sanction, and subsidy disbursement are determined exclusively by the
respective government authority.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "schemes.json"

SCHEME_NAVIGATOR_DISCLAIMER = (
    "RythuSetu provides informational guidance only. "
    "Final eligibility, document verification, and benefit disbursement are determined exclusively by the respective government authority."
)


def load_schemes() -> list[dict[str, Any]]:
    """Loads verified agricultural schemes from the local curated repository."""
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def find_matching_schemes(*, state: str, crop: str, season: str, land_area_acres: float = 2.0) -> list[dict[str, Any]]:
    """
    Evaluates farmer farm parameters against scheme criteria and returns potentially
    relevant programs with clear eligibility guidance, required documents, and official links.
    """
    matches: list[dict[str, Any]] = []
    crop_clean = crop.lower()
    state_clean = state.lower()

    for scheme in load_schemes():
        rules = scheme.get("match", {})
        states = rules.get("states", ["All"])
        crops = rules.get("crops", ["All"])
        score = 0
        reasons: list[str] = []

        # 1. State Scope Check
        if "All" in states:
            score += 2
            reasons.append("National central government program applicable across all states.")
        elif any(s.lower() in state_clean or state_clean in s.lower() for s in states):
            score += 3
            reasons.append(f"Specifically designated for cultivators in {state}.")
        else:
            continue

        # 2. Crop Suitability Check
        if "All" in crops:
            score += 2
            reasons.append(f"Applicable to general agriculture including {crop} farming.")
        elif any(c.lower() in crop_clean or crop_clean in c.lower() for c in crops):
            score += 3
            reasons.append(f"Notified crop match: Program specifically prioritizes {crop} cultivation.")
        else:
            continue

        # 3. Seasonal & Operational Context
        if season in {"Kharif", "Rabi", "Summer"}:
            reasons.append(f"Relevant for current {season} cultivation season planning.")

        if land_area_acres <= 5.0:
            reasons.append("Small & Marginal Farmer category: Higher subsidy allocation priority.")

        matches.append({
            "id": scheme["id"],
            "name": scheme.get("name", scheme.get("scheme_name")),
            "scheme_name": scheme.get("scheme_name", scheme.get("name")),
            "government_department": scheme.get("government_department", "Ministry of Agriculture & Farmers Welfare"),
            "category": scheme.get("category", "General Scheme"),
            "scope": scheme.get("scope", "Central"),
            "state": scheme.get("state", state),
            "icon": scheme.get("icon", "🌾"),
            "summary": scheme.get("summary", ""),
            "benefit": scheme.get("benefit", ""),
            "eligibility_rules": scheme.get("eligibility_rules", scheme.get("eligibility_note", "")),
            "crop_occupation_criteria": scheme.get("crop_occupation_criteria", "Smallholders & Cultivators"),
            "application_channel": scheme.get("application_channel", "Official Government Portal / CSC"),
            "required_documents": scheme.get("required_documents", [
                "Aadhaar Card",
                "Land Ownership Record (Pahani / 1-B / RoR)",
                "Aadhaar-linked Bank Account Passbook",
            ]),
            "official_url": scheme.get("official_url", "https://agricoop.nic.in/"),
            "helpline": scheme.get("helpline", "1800-180-1551 (Kisan Call Centre)"),
            "last_verified": scheme.get("last_verified", "2026-09-26"),
            "last_verified_date": scheme.get("last_verified", "2026-09-26"),
            "match_score": score,
            "match_label": "Potentially relevant",
            "eligibility_guidance_disclaimer": SCHEME_NAVIGATOR_DISCLAIMER,
            "reasons": reasons,
            "season": season,
        })

    matches.sort(key=lambda item: item["match_score"], reverse=True)
    return matches
