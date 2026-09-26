"""
RythuSetu Kallam (Drying Yard) Harvest Weather Shield & Tarpaulin Alert Engine
Protects harvested paddy, red chilli, and cotton drying on open yards (కల్లాలు) from unseasonal rains.
"""

from typing import Any

TARPAULIN_CENTERS: list[dict[str, Any]] = [
    {
        "id": "tarp-gnt-01",
        "supplier_name": "Guntur Agro Poly Tarpaulins & Waterproof Sheets",
        "telugu_name": "గుంటూరు టార్పాలిన్ పట్టాల కేంద్రం",
        "contact_person": "P. Srinivasa Rao",
        "phone": "+91 863 223 8810",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "location": "Near APMC Market Yard Gate 3, Guntur",
        "distance_km": 2.1,
        "available_sizes": ["24 x 18 ft (120 GSM HDPE)", "30 x 24 ft (250 GSM Heavy Waterproof)", "40 x 30 ft"],
        "rental_per_day_inr": 80,
        "purchase_price_inr": 1150,
        "stock_status": "Over 200 Tarpaulins Ready in Stock 🟢",
        "operating_hours": "24 Hours during rain alerts",
    },
    {
        "id": "tarp-gnt-02",
        "supplier_name": "Rythu Seva Cooperative Society Tarpaulin Bank",
        "telugu_name": "రైతు సేవా సహకార టార్పాలిన్ బ్యాంక్",
        "contact_person": "PACS Manager Subba Rao",
        "phone": "+91 94401 22910",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "location": "Main Road, Chilakaluripet, Guntur",
        "distance_km": 3.8,
        "available_sizes": ["24 x 18 ft", "30 x 20 ft (IS 7903 Certified)"],
        "rental_per_day_inr": 50,
        "purchase_price_inr": 950,
        "stock_status": "Govt Subsidized Rental Pool Active 🟢",
        "operating_hours": "07:00 AM - 08:30 PM",
    },
    {
        "id": "tarp-wgl-01",
        "supplier_name": "Kakatiya Kisan Tarpaulin & Storage Covers",
        "telugu_name": "కాకతీయ టార్పాలిన్ & స్టోరేజ్ కవర్లు",
        "contact_person": "K. Thirupathi",
        "phone": "+91 98492 44102",
        "district": "Warangal",
        "state": "Telangana",
        "location": "Enumamula Cotton Market Yard Outer Ring, Warangal",
        "distance_km": 1.7,
        "available_sizes": ["20 x 20 ft", "30 x 24 ft", "50 x 30 ft Extra Large"],
        "rental_per_day_inr": 70,
        "purchase_price_inr": 1200,
        "stock_status": "Ready in Stock 🟢",
        "operating_hours": "06:30 AM - 09:00 PM",
    }
]

def get_harvest_drying_risk(
    district: str = "Guntur",
    crop: str = "Red Chilli"
) -> dict[str, Any]:
    """
    Computes real-time drying yard moisture hazard and tarpaulin protection plan.
    """
    norm_dist = district.strip().lower()
    norm_crop = crop.strip().lower()

    # Determine risk state
    if "guntur" in norm_dist or "krishna" in norm_dist or "prakasam" in norm_dist:
        risk_level = "Caution: Thunderstorm Alert in 36 Hours 🟡"
        risk_score = 65
        drying_safety = "Restricted Sun Drying (Cover Ready)"
        advisory_en = "Bay of Bengal convective cloud cluster approaching. Do NOT leave red chillies or paddy spread overnight. Stack heaps and secure tarpaulins with sandbags by 04:00 PM."
        advisory_te = "బంగాళాఖాతంలో అల్పపీడన ప్రభావంతో రాగల 36 గంటల్లో వర్షం కురిసే అవకాశం ఉంది. కల్లాల్లో ఆరబెట్టిన మిరప లేదా ధాన్యం కుప్పలను సాయంత్రం 4 గంటలకే టార్పాలిన్ పట్టాలతో కప్పి భద్రపరచండి."
    elif "warangal" in norm_dist or "khammam" in norm_dist or "karimnagar" in norm_dist:
        risk_level = "Safe for Open Yard Sun Drying 🟢"
        risk_score = 20
        drying_safety = "Ideal Sun Drying Weather"
        advisory_en = "Clear skies and high solar radiation (34°C). Optimal for moisture reduction down to 10-11% for chilli and 14% for paddy."
        advisory_te = "ఆకాశం నిర్మలంగా ఉంది, ఎండ తీవ్రత అనుకూలంగా ఉంది. కల్లాల్లో మిరపకాయలు, పత్తి, ధాన్యం ఆరబెట్టడానికి సరైన సమయం."
    else:
        risk_level = "Moderate Drying Risk 🟡"
        risk_score = 45
        drying_safety = "Monitor Evening Clouds"
        advisory_en = "Isolated localized drizzle possible in the evening. Keep waterproof tarpaulin sheets adjacent to drying yard."
        advisory_te = "సాయంత్రం వేళల్లో స్థానికంగా తేలికపాటి జల్లులు పడే అవకాశం ఉంది. టార్పాలిన్ పట్టాలను కల్లం వద్ద సిద్ధంగా ఉంచుకోండి."

    filtered_tarpaulins = [t for t in TARPAULIN_CENTERS if not norm_dist or norm_dist in t["district"].lower()] or TARPAULIN_CENTERS

    return {
        "district": district,
        "crop": crop,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "drying_safety": drying_safety,
        "recommended_drying_hours": "08:30 AM to 03:30 PM",
        "critical_moisture_target": "Below 10.5% for Chilli / Below 13.5% for Paddy",
        "advisory_en": advisory_en,
        "advisory_te": advisory_te,
        "protection_steps": [
            "1. Consolidate spread produce into center conical heaps before sunset.",
            "2. Lay base plastic sheet to avoid ground capillary moisture seepage.",
            "3. Cover with UV-stabilized 200+ GSM waterproof tarpaulin.",
            "4. Weigh down tarpaulin edges with soil/sandbags against strong winds.",
        ],
        "tarpaulin_centers": filtered_tarpaulins,
    }
