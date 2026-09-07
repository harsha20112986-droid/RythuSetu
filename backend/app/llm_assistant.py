from __future__ import annotations

import json
from typing import Any

from app.core.config import settings


def build_llm_reply(
    *,
    question: str,
    language: str,
    farmer: Any,
    climate: dict | None,
    schemes: list[dict],
    benefits: dict | None,
    history: list[dict[str, str]] | None = None,
) -> str | None:
    """Generate a natural-language answer using supplied RythuSetu context.

    Returns None when no API key is configured or the provider call fails, so
    the deterministic assistant can remain the fallback.
    """
    if not settings.openai_api_key:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.openai_api_key)

        context = {
            "farmer": {
                "name": farmer.name,
                "state": farmer.state,
                "district": farmer.district,
                "mandal": farmer.mandal,
                "village": farmer.village,
                "crop": farmer.crop,
                "season": farmer.season,
                "land_area_acres": farmer.land_area_acres,
            },
            "climate": climate,
            "schemes": schemes[:5],
            "benefits": benefits,
        }

        system_prompt = """You are RythuSetu Krishi Assistant, a farmer-support assistant.

Rules:
1. Answer in the requested language.
2. Use only the supplied RythuSetu context for specific facts about weather, schemes, benefits, and the farmer.
3. Use recent conversation history to understand follow-up questions such as crop age, crop stage, "tomorrow", or "that scheme".
4. Never invent scheme eligibility, compensation, guaranteed payments, crop-loss decisions, government orders, or weather warnings.
5. Treat RythuSetu risk scores as informational heuristics, not official warnings.
6. Treat benefit estimates as informational estimates, not guaranteed payments.
7. For official eligibility, enrollment, insurance claims, or loss assessment, tell the farmer to verify with the relevant official authority.
8. Keep answers practical and farmer-friendly. Prefer short paragraphs and clear next actions.
9. If the supplied context and conversation history do not contain an answer, say that the information is unavailable rather than guessing.
"""

        history_text = json.dumps(
            (history or [])[-8:],
            ensure_ascii=False,
            default=str,
        )

        user_prompt = (
            f"Requested language: {language}\n"
            f"Farmer question: {question}\n\n"
            f"Recent conversation history (JSON):\n{history_text}\n\n"
            "RythuSetu context (JSON):\n"
            f"{json.dumps(context, ensure_ascii=False, default=str)}"
        )

        response = client.responses.create(
            model=settings.openai_model,
            instructions=system_prompt,
            input=user_prompt,
            max_output_tokens=500,
        )

        answer = (response.output_text or "").strip()
        return answer or None
    except Exception:
        return None
