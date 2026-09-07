from __future__ import annotations

from typing import Any

from app.conversation_memory import add_exchange, get_history
from app.llm_assistant import build_llm_reply


def _language_name(language: str) -> str:
    value = language.strip().lower()
    if value == "telugu":
        return "Telugu"
    if value == "hindi":
        return "Hindi"
    return "English"


def _fallback_reply(
    *,
    question: str,
    language: str,
    farmer: Any,
    climate: dict | None,
    schemes: list[dict],
    benefits: dict | None,
) -> str:
    q = question.lower().strip()
    lang = _language_name(language)
    name = farmer.name
    crop = farmer.crop
    season = farmer.season
    district = farmer.district
    state = farmer.state
    area = farmer.land_area_acres

    climate_level = (climate or {}).get("risk", {}).get("level", "Unavailable")
    climate_action = (climate or {}).get("risk", {}).get("suggested_action", "Weather data is unavailable right now.")
    temp = (climate or {}).get("current", {}).get("temperature_c")
    rain = (climate or {}).get("today_forecast", {}).get("rain_probability_percent")

    if any(word in q for word in ["scheme", "schemes", "yojana", "benefit", "support", "పథకం", "పథకాలు", "లాభం", "పథకము"]):
        if lang == "Telugu":
            if schemes:
                names = ", ".join(item.get("name", "") for item in schemes[:3])
                return f"{name}, మీ {crop} పంటకు సంబంధించి ప్రస్తుతం గుర్తించిన పథకాలు: {names}. ప్రతి పథకానికి అధికారిక అర్హత, పత్రాలు మరియు నమోదు నియమాలు వర్తిస్తాయి."
            return f"{name}, మీ ప్రొఫైల్‌కు ప్రస్తుతం సరిపోయే పథకాలు కనిపించలేదు. అధికారిక వ్యవసాయ శాఖ పోర్టల్‌ను కూడా తనిఖీ చేయండి."
        if lang == "Hindi":
            names = ", ".join(item.get("name", "") for item in schemes[:3]) if schemes else "कोई स्पष्ट मिलान नहीं"
            return f"{name}, आपकी {crop} फसल के लिए अभी दिखने वाली योजनाएँ: {names}. अंतिम पात्रता और दस्तावेज़ की पुष्टि आधिकारिक पोर्टल से करें।"
        names = ", ".join(item.get("name", "") for item in schemes[:3]) if schemes else "No strong match found"
        return f"{name}, schemes currently matched to your {crop} farm include: {names}. Final eligibility, documents, and enrollment must be verified with the official scheme authority."

    if any(word in q for word in ["weather", "rain", "temperature", "climate", "risk", "వాతావరణ", "వర్షం", "ఉష్ణోగ్రత", "ప్రమాదం"]):
        if climate:
            if lang == "Telugu":
                return f"{name}, {district} కోసం ప్రస్తుతం ఉష్ణోగ్రత సుమారు {temp}°C, ఈరోజు వర్షం వచ్చే అవకాశం {rain}%, మరియు RythuSetu వాతావరణ ప్రమాద స్థాయి {climate_level}. సూచన: {climate_action}"
            if lang == "Hindi":
                return f"{name}, {district} में तापमान लगभग {temp}°C है, आज बारिश की संभावना {rain}% है, और RythuSetu मौसम जोखिम स्तर {climate_level} है। सुझाव: {climate_action}"
            return f"{name}, in {district} the current temperature is about {temp}°C, today's rain chance is {rain}%, and the RythuSetu weather-risk level is {climate_level}. Suggested action: {climate_action}"
        return "Live climate data is unavailable right now. Please try again shortly."

    if any(word in q for word in ["how much", "amount", "money", "support amount", "ఎంత", "డబ్బు", "మొత్తం", "कितना", "राशि"]):
        total = (benefits or {}).get("estimated_total") if benefits else None
        if lang == "Telugu":
            reply = f"{name}, మీ {area} ఎకరాల ప్రొఫైల్‌కు స్థిర నియమాల ఆధారంగా అంచనా మొత్తం ₹{total:,.0f} గా ఉంది." if total is not None else "ప్రస్తుత స్థిర-నియమాల ఆధారంగా అంచనా లభించలేదు."
        elif lang == "Hindi":
            reply = f"{name}, आपकी {area} एकड़ प्रोफ़ाइल के लिए स्थिर नियमों पर आधारित संभावित वार्षिक राशि ₹{total:,.0f} है।" if total is not None else "स्थिर नियमों के आधार पर अभी अनुमान उपलब्ध नहीं है।"
        else:
            reply = f"{name}, the current fixed-rule estimate for your {area} acre profile is ₹{total:,.0f} per year." if total is not None else "A fixed-rule estimate is not available right now."
        return reply + " This is an estimate, not a guaranteed payment."

    if any(word in q for word in ["loss", "damage", "damaged", "crop loss", "నష్టం", "పంట నష్టం", "फसल नुकसान"]):
        if lang == "Telugu":
            return f"{name}, పంట నష్టం జరిగితే RythuSetuలో నష్టం రిపోర్ట్ పంపండి. తేదీ, ప్రభావిత విస్తీర్ణం, రైతు అంచనా నష్టం శాతం మరియు ఫోటో ఆధారాలు ఇవ్వవచ్చు. రైతు నివేదించిన శాతం అధికారిక నష్టం అంచనా కాదు."
        if lang == "Hindi":
            return f"{name}, फसल नुकसान होने पर RythuSetu में नुकसान रिपोर्ट दर्ज करें। तारीख, प्रभावित क्षेत्र, किसान द्वारा अनुमानित नुकसान प्रतिशत और फोटो दे सकते हैं। किसान द्वारा बताया गया प्रतिशत आधिकारिक आकलन नहीं है।"
        return f"{name}, for crop damage you can submit a Crop Loss report with the loss date, affected area, farmer-reported damage percentage, description, and optional photo evidence. The farmer-reported percentage is not an official loss assessment."

    if any(word in q for word in ["hello", "hi", "namaste", "help", "నమస్కారం", "హాయ్", "नमस्ते"]):
        if lang == "Telugu":
            return f"నమస్కారం {name}! నేను మీ RythuSetu Krishi Assistant. వాతావరణం, పథకాలు, అంచనా లాభాలు లేదా పంట నష్టం గురించి అడగండి."
        if lang == "Hindi":
            return f"नमस्ते {name}! मैं आपका RythuSetu Krishi Assistant हूँ। मौसम, योजनाओं, संभावित लाभ या फसल नुकसान के बारे में पूछें।"
        return f"Namaste {name}! I’m your RythuSetu Krishi Assistant. Ask me about weather, schemes, estimated support, or crop-loss reporting."

    if lang == "Telugu":
        return f"{name}, మీ ప్రొఫైల్: {state}, {district}, {crop}, {season}, {area} ఎకరాలు. వాతావరణం, పథకాలు, లాభాల అంచనా లేదా పంట నష్టం గురించి అడగండి."
    if lang == "Hindi":
        return f"{name}, आपकी प्रोफ़ाइल: {state}, {district}, {crop}, {season}, {area} एकड़। मौसम, योजनाएँ, संभावित लाभ या फसल नुकसान के बारे में पूछें।"
    return f"{name}, your profile is {state}, {district}, {crop}, {season}, {area} acres. Ask about weather, schemes, benefit estimates, or crop-loss reporting."


def build_assistant_reply(
    *,
    question: str,
    language: str,
    farmer: Any,
    climate: dict | None,
    schemes: list[dict],
    benefits: dict | None,
) -> dict:
    lang = _language_name(language)
    history = get_history(farmer.id)

    answer = build_llm_reply(
        question=question,
        language=lang,
        farmer=farmer,
        climate=climate,
        schemes=schemes,
        benefits=benefits,
        history=history,
    )

    llm_used = answer is not None

    if answer is None:
        answer = _fallback_reply(
            question=question,
            language=lang,
            farmer=farmer,
            climate=climate,
            schemes=schemes,
            benefits=benefits,
        )

    add_exchange(farmer.id, question, answer)

    return {
        "language": lang,
        "answer": answer,
        "profile_context": {
            "name": farmer.name,
            "state": farmer.state,
            "district": farmer.district,
            "crop": farmer.crop,
            "season": farmer.season,
            "land_area_acres": farmer.land_area_acres,
        },
        "grounding": {
            "climate_used": climate is not None,
            "scheme_count": len(schemes),
            "benefits_used": benefits is not None,
            "llm_used": llm_used,
            "conversation_memory_used": bool(history),
        },
        "disclaimer": "Assistant guidance is informational. Verify important weather, scheme, insurance, and benefit decisions with the relevant official authority.",
    }
