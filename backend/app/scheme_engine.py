from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "schemes.json"


def load_schemes() -> list[dict[str, Any]]:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def find_matching_schemes(*, state: str, crop: str, season: str) -> list[dict[str, Any]]:
    matches: list[dict[str, Any]] = []
    crop_clean = crop.lower()

    for scheme in load_schemes():
        rules = scheme.get("match", {})
        states = rules.get("states", ["All"])
        crops = rules.get("crops", ["All"])
        score = 0
        reasons: list[str] = []

        if "All" in states or state in states:
            score += 2
            reasons.append(f"Available for {state} or nationally.")
        else:
            continue

        if "All" in crops or any(c.lower() in crop_clean or crop_clean in c.lower() for c in crops):
            score += 2
            reasons.append(f"Relevant to {crop} farming.")
        else:
            continue

        if season in {"Kharif", "Rabi", "Summer"}:
            reasons.append(f"Your current season is {season}.")

        matches.append({
            **scheme,
            "match_score": score,
            "match_label": "Potentially relevant",
            "reasons": reasons,
            "season": season,
        })

    matches.sort(key=lambda item: item["match_score"], reverse=True)
    return matches
