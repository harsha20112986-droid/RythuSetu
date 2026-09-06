from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "benefits.json"


def load_benefits() -> list[dict[str, Any]]:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def estimate_benefits(*, state: str, crop: str, season: str, land_area_acres: float) -> dict[str, Any]:
    items: list[dict[str, Any]] = []
    fixed_total = 0.0
    per_acre_total = 0.0

    for benefit in load_benefits():
        calculation = benefit.get("calculation")
        states = benefit.get("states", ["All"])

        if "All" not in states and state not in states:
            continue

        if calculation == "fixed":
            amount = float(benefit["annual_amount"])
            fixed_total += amount
            items.append({
                "id": benefit["id"],
                "name": benefit["name"],
                "category": benefit["category"],
                "type": "Estimated fixed annual support",
                "estimated_amount": amount,
                "calculation": f"₹{amount:,.0f} per eligible farmer family per year",
                "basis": benefit["basis"],
                "official_url": benefit["official_url"],
                "last_verified": benefit["last_verified"],
            })
        elif calculation == "per_acre":
            rate = float(benefit["annual_amount_per_acre"])
            amount = rate * land_area_acres
            per_acre_total += amount
            items.append({
                "id": benefit["id"],
                "name": benefit["name"],
                "category": benefit["category"],
                "type": "Estimated annual support based on farm area",
                "estimated_amount": amount,
                "calculation": f"₹{rate:,.0f} × {land_area_acres:g} acres = ₹{amount:,.0f} per year",
                "basis": benefit["basis"],
                "official_url": benefit["official_url"],
                "last_verified": benefit["last_verified"],
            })
        elif calculation == "variable":
            items.append({
                "id": benefit["id"],
                "name": benefit["name"],
                "category": benefit["category"],
                "type": "Variable insurance protection",
                "estimated_amount": None,
                "calculation": "No fixed rupee amount estimated",
                "basis": benefit["basis"],
                "official_url": benefit["official_url"],
                "last_verified": benefit["last_verified"],
            })

    return {
        "state": state,
        "crop": crop,
        "season": season,
        "land_area_acres": land_area_acres,
        "estimated_total": fixed_total + per_acre_total,
        "items": items,
        "disclaimer": "This is an informational estimate, not a guarantee of payment or insurance claim. Official eligibility, land records, exclusions, notified crops/areas, enrollment, verification, and assessed losses determine actual outcomes.",
    }
