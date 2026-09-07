from __future__ import annotations

from typing import Any

IVR_MENUS = {
    "welcome": {
        "prompt_en": "Welcome to RythuSetu Kisan Hotline. For Telugu, press 1. For Hindi, press 2. For English, press 3.",
        "prompt_te": "రైతుసేతు కిసాన్ హెల్ప్‌లైన్‌కు స్వాగతం. తెలుగు కోసం 1 నొక్కండి. హిందీ కోసం 2 నొక్కండి. ఇంగ్లీష్ కోసం 3 నొక్కండి.",
        "prompt_hi": "रैथुसेतु किसान हेल्पलाइन में आपका स्वागत है। तेलुगु के लिए 1 दबाएं। हिंदी के लिए 2 दबाएं। अंग्रेजी के लिए 3 दबाएं।",
    },
    "main_menu": {
        "prompt_en": "Press 1 for Weather Risk. Press 2 for Government Schemes. Press 3 for Crop Loss reporting.",
        "prompt_te": "వాతావరణ సమాచారం కోసం 1, ప్రభుత్వ పథకాల కోసం 2, పంట నష్టం నివేదిక కోసం 3 నొక్కండి.",
        "prompt_hi": "मौसम जोखिम के लिए 1 दबाएं, सरकारी योजनाओं के लिए 2 दबाएं, फसल नुकसान के लिए 3 दबाएं।",
    },
}

def process_ivr_step(
    step: str,
    digit: str | None = None,
    language: str = "English",
    farmer: Any = None,
) -> dict[str, Any]:
    """State-machine processor for interactive phone simulator and Twilio/Exotel webhooks."""
    digit = str(digit).strip() if digit else ""
    
    # Step 1: Language selection from root
    if step == "welcome":
        if digit == "1":
            selected_lang = "Telugu"
        elif digit == "2":
            selected_lang = "Hindi"
        else:
            selected_lang = "English"

        prompt = (
            IVR_MENUS["main_menu"]["prompt_te"]
            if selected_lang == "Telugu"
            else IVR_MENUS["main_menu"]["prompt_hi"]
            if selected_lang == "Hindi"
            else IVR_MENUS["main_menu"]["prompt_en"]
        )

        return {
            "next_step": "main_menu",
            "language": selected_lang,
            "speech": prompt,
            "options": [
                {"key": "1", "label": "1: Weather Risk"},
                {"key": "2", "label": "2: Eligible Schemes"},
                {"key": "3", "label": "3: Crop Loss Desk"},
            ],
        }

    # Step 2: Main menu choices
    name = farmer.name if farmer else "Farmer"
    crop = farmer.crop if farmer else "Cotton"
    district = farmer.district if farmer else "Warangal"

    if digit == "1":
        # Weather Risk
        if language == "Telugu":
            speech = f"నమస్కారం {name}. {district} జిల్లాలో ఈ రోజు వాతావరణ ప్రమాదం తక్కువగా ఉంది. వర్షం పడే అవకాశం 71 శాతం. పత్తి పంటను సురక్షితంగా ఉంచండి."
        elif language == "Hindi":
            speech = f"नमस्ते {name}। {district} में आज मौसम जोखिम कम है। बारिश की संभावना 71 प्रतिशत है। अपनी {crop} फसल का ध्यान रखें।"
        else:
            speech = f"Namaste {name}. In {district}, your {crop} weather risk today is Low. Rain probability is 71 percent with light rain expected."

        return {
            "next_step": "complete",
            "language": language,
            "speech": speech,
            "action": "weather_info",
        }

    elif digit == "2":
        # Schemes
        if language == "Telugu":
            speech = f"{name}, మీ ప్రొఫైల్‌కు పీఎం-కిసాన్ మరియు రైతు భరోసా పథకాలు అర్హత పొందాయి. ఏడాదికి గరిష్టంగా 48 వేల రూపాయల వరకు సహాయం లభించవచ్చు."
        elif language == "Hindi":
            speech = f"{name}, आपकी प्रोफ़ाइल के लिए पीएम-किसान और राज्य योजनाएं पात्र हैं। कुल संभावित सहायता 48,000 रुपये प्रति वर्ष तक हो सकती है।"
        else:
            speech = f"{name}, your profile is matched to PM-KISAN and Rythu Bharosa with potential annual support up to 48,000 rupees."

        return {
            "next_step": "complete",
            "language": language,
            "speech": speech,
            "action": "schemes_info",
        }

    elif digit == "3":
        # Crop Loss
        if language == "Telugu":
            speech = f"పంట నష్టం జరిగితే 72 గంటల్లోపు నమోదు చేసుకోవాలి. ఉచిత టోల్ ఫ్రీ నెంబర్ 14447 కు కాల్ చేయండి లేదా రైతుసేతు యాప్‌లో ఫోటోలు అప్‌లోడ్ చేయండి."
        elif language == "Hindi":
            speech = f"फसल नुकसान की सूचना 72 घंटे के भीतर दी जानी चाहिए। टोल फ्री नंबर 14447 पर कॉल करें या रैथुसेतु ऐप पर फोटो अपलोड करें।"
        else:
            speech = f"For crop damage, intimation must be submitted within 72 hours under PMFBY. Call toll-free 14447 or upload photo evidence on RythuSetu."

        return {
            "next_step": "complete",
            "language": language,
            "speech": speech,
            "action": "loss_info",
        }

    # Default fallback prompt
    return {
        "next_step": "welcome",
        "language": "English",
        "speech": IVR_MENUS["welcome"]["prompt_en"],
        "options": [
            {"key": "1", "label": "1: Telugu (తెలుగు)"},
            {"key": "2", "label": "2: Hindi (हिन्दी)"},
            {"key": "3", "label": "3: English"},
        ],
    }

def generate_twiml_response(speech_text: str) -> str:
    """Generate standard TwiML XML response for production telecom carrier integration."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="en-IN">{speech_text}</Say>
    <Gather numDigits="1" timeout="5" action="/api/v1/telephony/ivr-webhook" method="POST"/>
</Response>"""
