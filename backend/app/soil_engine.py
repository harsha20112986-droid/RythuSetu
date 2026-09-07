"""
RythuSetu Soil Health & Smart Fertilizer Dosage Optimizer Engine
Computes scientific N:P:K split applications, soil conditioners, and micronutrient schedules per acre.
"""

from typing import Any

SOIL_CHARACTERISTICS = {
    "Black Cotton Clay": {
        "retention": "Very High",
        "drainage": "Moderate to Poor",
        "organic_carbon": "Medium (0.45 - 0.60%)",
        "ph_range": "7.5 - 8.5 (Slightly Alkaline)",
        "caution": "Avoid waterlogging; split nitrogen into 3 splits to prevent leaching.",
    },
    "Red Sandy Loam": {
        "retention": "Low to Moderate",
        "drainage": "Excellent",
        "organic_carbon": "Low (< 0.40%)",
        "ph_range": "6.0 - 7.0 (Slightly Acidic to Neutral)",
        "caution": "Prone to rapid nitrogen leaching; top dress urea in small doses.",
    },
    "Alluvial Loam": {
        "retention": "High",
        "drainage": "Good",
        "organic_carbon": "High (> 0.75%)",
        "ph_range": "6.8 - 7.4 (Neutral)",
        "caution": "Balanced nutrients, ideal for intensive paddy & vegetable cultivation.",
    },
    "Laterite / Red Gravelly": {
        "retention": "Low",
        "drainage": "Excessive",
        "organic_carbon": "Low (< 0.35%)",
        "ph_range": "5.5 - 6.2 (Acidic)",
        "caution": "Requires liming and regular organic farmyard manure additions.",
    },
}

# Standard Recommended Dose of Fertilizer (RDF) in kg/acre for Indian agro-climatic zones
CROP_RDF = {
    "Cotton": {
        "nitrogen_kg": 48.0,
        "phosphorus_kg": 24.0,
        "potash_kg": 24.0,
        "zinc_sulphate_kg": 10.0,
        "stages": [
            {
                "stage_name": "Basal Dose (At Sowing / Field Prep)",
                "timing": "Day 0 to 5",
                "urea_kg": 20.0,
                "dap_kg": 50.0, # 1 bag
                "mop_potash_kg": 20.0,
                "micronutrients": "Zinc Sulphate 10 kg + 2 tons Farmyard Manure",
                "notes": "Place 5 cm away from seeds to avoid seedling scorch.",
            },
            {
                "stage_name": "1st Top Dressing (Square / Vegetative Stage)",
                "timing": "Day 30 to 35",
                "urea_kg": 35.0,
                "dap_kg": 0.0,
                "mop_potash_kg": 10.0,
                "micronutrients": "Neem cake blend (20 kg) to slow nitrogen release",
                "notes": "Apply when soil has adequate moisture after intercultivation.",
            },
            {
                "stage_name": "2nd Top Dressing (Boll Formation Stage)",
                "timing": "Day 60 to 70",
                "urea_kg": 35.0,
                "dap_kg": 0.0,
                "mop_potash_kg": 15.0,
                "micronutrients": "19:19:19 foliar spray (10 g/L) + Boron (1 g/L)",
                "notes": "Prevents square drop and promotes larger boll size.",
            },
        ],
    },
    "Paddy / Rice": {
        "nitrogen_kg": 40.0,
        "phosphorus_kg": 20.0,
        "potash_kg": 20.0,
        "zinc_sulphate_kg": 10.0,
        "stages": [
            {
                "stage_name": "Basal Dose (Final Puddling)",
                "timing": "Before transplanting",
                "urea_kg": 15.0,
                "dap_kg": 45.0, # ~1 bag
                "mop_potash_kg": 15.0,
                "micronutrients": "Zinc Sulphate 10 kg / acre",
                "notes": "Incorporate evenly into puddle soil.",
            },
            {
                "stage_name": "Tillering Stage",
                "timing": "20 to 25 days after transplanting",
                "urea_kg": 30.0,
                "dap_kg": 0.0,
                "mop_potash_kg": 0.0,
                "micronutrients": "Azospirillum bio-fertilizer",
                "notes": "Drain excess water before broadcasting urea; re-flood after 24 hrs.",
            },
            {
                "stage_name": "Panicle Initiation",
                "timing": "40 to 45 days after transplanting",
                "urea_kg": 25.0,
                "dap_kg": 0.0,
                "mop_potash_kg": 15.0,
                "micronutrients": "Potassium nitrate (13:0:45) foliar 10g/L",
                "notes": "Crucial for grain filling and minimizing chaffy grains.",
            },
        ],
    },
    "Groundnut": {
        "nitrogen_kg": 12.0,
        "phosphorus_kg": 20.0,
        "potash_kg": 20.0,
        "zinc_sulphate_kg": 10.0,
        "stages": [
            {
                "stage_name": "Basal Application",
                "timing": "At sowing",
                "urea_kg": 12.0,
                "dap_kg": 40.0,
                "mop_potash_kg": 25.0,
                "micronutrients": "Gypsum 200 kg/acre + Rhizobium seed treatment",
                "notes": "Gypsum provides essential Calcium for pod formation and kernel filling.",
            },
            {
                "stage_name": "Pegging Stage Top Dressing",
                "timing": "Day 40 to 45",
                "urea_kg": 10.0,
                "dap_kg": 0.0,
                "mop_potash_kg": 10.0,
                "micronutrients": "Second dose of Gypsum (100 kg/acre) around root zone",
                "notes": "Crucial: do not disturb the pegs entering the soil.",
            },
        ],
    },
}

def calculate_fertilizer_plan(crop: str, soil_type: str, acres: float) -> dict[str, Any]:
    norm_crop = "Cotton"
    if "paddy" in crop.lower() or "rice" in crop.lower():
        norm_crop = "Paddy / Rice"
    elif "groundnut" in crop.lower():
        norm_crop = "Groundnut"
    
    rdf = CROP_RDF.get(norm_crop, CROP_RDF["Cotton"])
    soil_info = SOIL_CHARACTERISTICS.get(soil_type, SOIL_CHARACTERISTICS["Black Cotton Clay"])
    
    acre_factor = max(acres, 0.5)

    # Calculate total bag requirements (standard Indian fertilizer packaging: Urea 45kg, DAP 50kg, MOP 50kg)
    total_urea_kg = sum(s["urea_kg"] for s in rdf["stages"]) * acre_factor
    total_dap_kg = sum(s["dap_kg"] for s in rdf["stages"]) * acre_factor
    total_mop_kg = sum(s["mop_potash_kg"] for s in rdf["stages"]) * acre_factor

    urea_bags_45kg = round(total_urea_kg / 45.0, 1)
    dap_bags_50kg = round(total_dap_kg / 50.0, 1)
    mop_bags_50kg = round(total_mop_kg / 50.0, 1)

    # Scale stages for farmer's land acreage
    scaled_stages = []
    for s in rdf["stages"]:
        scaled_stages.append({
            "stage_name": s["stage_name"],
            "timing": s["timing"],
            "urea_kg": round(s["urea_kg"] * acre_factor, 1),
            "dap_kg": round(s["dap_kg"] * acre_factor, 1),
            "mop_potash_kg": round(s["mop_potash_kg"] * acre_factor, 1),
            "micronutrients": s["micronutrients"],
            "notes": s["notes"],
        })

    return {
        "crop": crop,
        "soil_type": soil_type,
        "acres": acres,
        "soil_profile": soil_info,
        "total_bag_requirements": {
            "urea_45kg_bags": urea_bags_45kg,
            "dap_50kg_bags": dap_bags_50kg,
            "mop_potash_50kg_bags": mop_bags_50kg,
            "zinc_sulphate_kg": round(rdf["zinc_sulphate_kg"] * acre_factor, 1),
        },
        "growth_stages_schedule": scaled_stages,
        "organic_alternatives": [
            "Farmyard Manure (FYM): Apply 4 to 5 tonnes / acre during summer deep ploughing.",
            "Neem-Coated Urea: Delays nitrification and reduces volatilization loss by up to 25%.",
            "Bio-fertilizers: Seed treatment with Rhizobium (legumes) or Azospirillum + PSB (cereals).",
            "Green Manuring: Grow Dhaincha or Sunn hemp and incorporate before main crop sowing.",
        ],
        "soil_health_advisory": soil_info["caution"],
    }
