"""
RythuSetu Smart Crop Recommendation & Agronomic Package of Practices (POP) Engine
Matches farm soil type, irrigation source, season, and district with high-profit crops,
providing exact fertilizer schedules, pest vulnerabilities, and CIBRC chemical/organic sprays.
"""

from typing import Any

# Comprehensive Crop Knowledge Base for Andhra Pradesh & Telangana Agro-Climatic Zones
CROP_AGRONOMIC_KNOWLEDGE: dict[str, dict[str, Any]] = {
    "Cotton": {
        "crop_name": "Cotton",
        "telugu_name": "పత్తి (Pathi)",
        "category": "Commercial & Fiber",
        "suitable_soils": ["Black Cotton Clay", "Alluvial Loam", "Red Sandy Loam"],
        "suitable_seasons": ["Kharif"],
        "min_water": "Medium (Borewell / Semi-irrigated)",
        "duration_days": "150 - 180 days",
        "expected_yield_qtl_acre": "10 - 14 Quintals / acre",
        "avg_market_price_qtl": 7540,
        "cultivation_cost_acre": 26000,
        "estimated_net_profit_acre": 49400,
        "fertilizer_protocol": {
            "basal": "DAP 50 kg + MOP 20 kg + Urea 20 kg + Zinc Sulphate 10 kg at sowing",
            "vegetative_30d": "Urea 35 kg + Magnesium Sulphate 10 kg (Square stage)",
            "flowering_60d": "Urea 30 kg + MOP 15 kg + Borax 2 kg foliar spray (0.2%)",
            "boll_development_90d": "13-0-45 (Potassium Nitrate) foliar spray @ 10g/L",
        },
        "pest_management": [
            {
                "pest_or_disease": "Pink Bollworm (Pectinophora gossypiella)",
                "symptoms": "Rosetted flowers, premature boll opening, stained lint",
                "chemical_spray": "Profenofos 50% EC @ 2ml/L or Emamectin Benzoate 5% SG @ 5g/10L",
                "organic_spray": "Install 8 Pheromone traps/acre + Spray NSKE 5% at flowering",
            },
            {
                "pest_or_disease": "Sucking Pests (Whitefly / Aphids / Jassids)",
                "symptoms": "Leaf curling, honey-dew excretion, sooty mold",
                "chemical_spray": "Flonicamid 50% WG @ 0.4g/L or Diafenthiuron 50% WP @ 1.2g/L",
                "organic_spray": "Neem Oil 10,000 ppm @ 2ml/L + Yellow sticky traps (10/acre)",
            },
            {
                "pest_or_disease": "Bacterial Blight / Black Arm",
                "symptoms": "Angular water-soaked leaf spots, blackened twigs",
                "chemical_spray": "Copper Oxychloride 50 WP @ 30g + Streptocycline @ 1g per 10L water",
                "organic_spray": "Pseudomonas fluorescens @ 10g/L foliar spray",
            }
        ],
        "intercrop_suitability": "Cotton + Pigeon Pea (Red Gram) in 4:1 or 8:2 row ratio",
    },
    "Paddy / Rice": {
        "crop_name": "Paddy / Rice",
        "telugu_name": "వరి (Vari)",
        "category": "Cereals & Millets",
        "suitable_soils": ["Alluvial Loam", "Black Cotton Clay", "Red Sandy Loam"],
        "suitable_seasons": ["Kharif", "Rabi"],
        "min_water": "High (Canal / Borewell assured)",
        "duration_days": "125 - 145 days",
        "expected_yield_qtl_acre": "24 - 32 Quintals / acre",
        "avg_market_price_qtl": 2580,
        "cultivation_cost_acre": 22000,
        "estimated_net_profit_acre": 39920,
        "fertilizer_protocol": {
            "basal": "DAP 50 kg + MOP 25 kg + Zinc Sulphate 20 kg before final puddling",
            "tillering_25d": "Urea 30 kg + Neem Cake 10 kg",
            "panicle_initiation_50d": "Urea 25 kg + MOP 15 kg",
            "grain_filling_75d": "0-52-34 (Monopotassium phosphate) foliar spray @ 10g/L",
        },
        "pest_management": [
            {
                "pest_or_disease": "Yellow Stem Borer (Scirpophaga incertulas)",
                "symptoms": "Dead heart in vegetative stage, White earhead at heading",
                "chemical_spray": "Chlorantraniliprole 18.5% SC @ 0.3ml/L or Cartap Hydrochloride 50% SP @ 2g/L",
                "organic_spray": "Release Trichogramma japonicum egg parasitoid @ 40,000/acre",
            },
            {
                "pest_or_disease": "Rice Leaf Blast (Magnaporthe oryzae)",
                "symptoms": "Spindle shaped lesions with grey centers and brown borders",
                "chemical_spray": "Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L",
                "organic_spray": "Foliar spray of Panchagavya 3% or fermented cow urine",
            },
            {
                "pest_or_disease": "Brown Plant Hopper (BPH)",
                "symptoms": "Hopper burn, circular drying patches in dense canopy",
                "chemical_spray": "Trifflumezopyrim 10% SC @ 0.5ml/L or Pymetrozine 50% WDG @ 0.6g/L",
                "organic_spray": "Drain standing water for 3 days; spray Beauveria bassiana @ 5g/L",
            }
        ],
        "intercrop_suitability": "Relay cropping of Black Gram or Green Gram in standing paddy 3 days before harvest",
    },
    "Red Chilli": {
        "crop_name": "Red Chilli",
        "telugu_name": "మిరప (Mirapa)",
        "category": "Spices & Condiments",
        "suitable_soils": ["Black Cotton Clay", "Alluvial Loam", "Red Sandy Loam"],
        "suitable_seasons": ["Kharif", "Rabi"],
        "min_water": "High (Drip Irrigation / Borewell)",
        "duration_days": "160 - 210 days",
        "expected_yield_qtl_acre": "20 - 28 Quintals dry pods / acre",
        "avg_market_price_qtl": 16800,
        "cultivation_cost_acre": 85000,
        "estimated_net_profit_acre": 251000,
        "fertilizer_protocol": {
            "basal": "10-26-26 (Complex) 75 kg + Zinc 10 kg + Sulphur 10 kg + 5 tons FYM",
            "vegetative_40d": "Urea 35 kg + Calcium Nitrate 15 kg via fertigation",
            "fruit_set_75d": "0-52-34 5 kg + MOP 20 kg + Micronutrient combo spray",
            "picking_stages": "13-0-45 (Multi-K) 5 kg / acre every 15 days",
        },
        "pest_management": [
            {
                "pest_or_disease": "Black Thrips (Thrips parvispinus)",
                "symptoms": "Severe upward leaf curl, blackened flowers, shed buds",
                "chemical_spray": "Spinetoram 11.7% SC @ 1ml/L or Broflanilide 300 SC @ 0.15ml/L",
                "organic_spray": "Blue sticky traps (25/acre) + Verticillium lecanii @ 5g/L",
            },
            {
                "pest_or_disease": "Anthracnose / Fruit Rot / Die-Back",
                "symptoms": "Sunken circular dark lesions on ripe chillies, tip drying",
                "chemical_spray": "Azoxystrobin 23% SC @ 1ml/L or Difenoconazole 25% EC @ 0.5ml/L",
                "organic_spray": "Trichoderma harzianum soil application + 3% Neem oil spray",
            }
        ],
        "intercrop_suitability": "Border crop of Maize or Sorghum (4 rows) to prevent thrips entry",
    },
    "Groundnut": {
        "crop_name": "Groundnut",
        "telugu_name": "వేరుశనగ (Verusenaga)",
        "category": "Oilseeds",
        "suitable_soils": ["Red Sandy Loam", "Alluvial Loam", "Laterite / Red Gravelly"],
        "suitable_seasons": ["Kharif", "Rabi", "Summer"],
        "min_water": "Medium (Borewell or Rainfed with protective irrigation)",
        "duration_days": "105 - 120 days",
        "expected_yield_qtl_acre": "12 - 18 Quintals / acre",
        "avg_market_price_qtl": 7150,
        "cultivation_cost_acre": 20000,
        "estimated_net_profit_acre": 65800,
        "fertilizer_protocol": {
            "basal": "Urea 15 kg + SSP (Single Super Phosphate) 100 kg + MOP 25 kg + Gypsum 100 kg",
            "pegging_stage_40d": "Gypsum 100 kg / acre top dressed around root zone and earthed up",
            "pod_filling_60d": "Borax 2g/L + 19-19-19 foliar spray for sound kernel filling",
        },
        "pest_management": [
            {
                "pest_or_disease": "Tikka Leaf Spot (Cercospora)",
                "symptoms": "Dark brown circular leaf spots with yellow halo, early defoliation",
                "chemical_spray": "Hexaconazole 5% EC @ 2ml/L or Mancozeb 75% WP @ 2.5g/L",
                "organic_spray": "Foliar spray of Cow urine 5% + Fermented butter milk",
            },
            {
                "pest_or_disease": "Spodoptera / Leaf Miner",
                "symptoms": "Skeletonized leaves, blisters on foliage, caterpillar feeding",
                "chemical_spray": "Novaluron 10% EC @ 1.5ml/L or Chlorantraniliprole @ 0.3ml/L",
                "organic_spray": "Pheromone traps (5/acre) + NPV virus solution @ 250 LE/acre",
            }
        ],
        "intercrop_suitability": "Groundnut + Red Gram (7:1 ratio) or Groundnut + Castor",
    },
    "Maize": {
        "crop_name": "Maize",
        "telugu_name": "మొక్కజొన్న (Mokka Jonna)",
        "category": "Cereals & Millets",
        "suitable_soils": ["Red Sandy Loam", "Alluvial Loam", "Black Cotton Clay"],
        "suitable_seasons": ["Kharif", "Rabi"],
        "min_water": "Medium to High",
        "duration_days": "100 - 115 days",
        "expected_yield_qtl_acre": "25 - 35 Quintals / acre",
        "avg_market_price_qtl": 2290,
        "cultivation_cost_acre": 18000,
        "estimated_net_profit_acre": 39250,
        "fertilizer_protocol": {
            "basal": "DAP 50 kg + MOP 20 kg + Zinc Sulphate 10 kg / acre",
            "knee_high_30d": "Urea 40 kg top dressed",
            "tasseling_55d": "Urea 30 kg + MOP 15 kg",
        },
        "pest_management": [
            {
                "pest_or_disease": "Fall Armyworm (Spodoptera frugiperda)",
                "symptoms": "Window pane feeding on leaves, fecal pellets in central whorl",
                "chemical_spray": "Spinetoram 11.7% SC @ 0.5ml/L directed into the whorl",
                "organic_spray": "Sand + Lime mix (9:1) placed in central leaf whorl",
            }
        ],
        "intercrop_suitability": "Maize + Cowpea or Maize + Soybean in 2:2 ratio",
    },
    "Turmeric": {
        "crop_name": "Turmeric",
        "telugu_name": "పసుపు (Pasupu)",
        "category": "Spices & Condiments",
        "suitable_soils": ["Alluvial Loam", "Red Sandy Loam", "Black Cotton Clay"],
        "suitable_seasons": ["Kharif"],
        "min_water": "High (Assured Irrigation)",
        "duration_days": "240 - 270 days",
        "expected_yield_qtl_acre": "22 - 30 Quintals cured rhizomes / acre",
        "avg_market_price_qtl": 14800,
        "cultivation_cost_acre": 70000,
        "estimated_net_profit_acre": 299600,
        "fertilizer_protocol": {
            "basal": "DAP 60 kg + MOP 30 kg + Neem Cake 100 kg + 6 tons FYM",
            "rhizome_initiation_60d": "Urea 40 kg + MOP 25 kg + Ferrous Sulphate 10 kg",
            "bulking_120d": "0-0-50 (SOP) 5 kg / acre via drip or spray",
        },
        "pest_management": [
            {
                "pest_or_disease": "Rhizome Rot (Pythium aphanidermatum)",
                "symptoms": "Yellowing of lower leaves, collar rot, rotting foul smell rhizomes",
                "chemical_spray": "Drenching with Metalaxyl + Mancozeb (Ridomil MZ) @ 2.5g/L",
                "organic_spray": "Seed rhizome treatment with Trichoderma viride @ 10g/kg",
            }
        ],
        "intercrop_suitability": "Intercropped with Onion, Coriander or Fenugreek on bed ridges",
    },
    "Pigeon Pea / Red Gram": {
        "crop_name": "Pigeon Pea / Red Gram (Tur)",
        "telugu_name": "కందులు (Kandulu)",
        "category": "Pulses",
        "suitable_soils": ["Black Cotton Clay", "Red Sandy Loam", "Laterite / Red Gravelly"],
        "suitable_seasons": ["Kharif"],
        "min_water": "Low (Drought Tolerant / Rainfed)",
        "duration_days": "150 - 180 days",
        "expected_yield_qtl_acre": "8 - 12 Quintals / acre",
        "avg_market_price_qtl": 8100,
        "cultivation_cost_acre": 15000,
        "estimated_net_profit_acre": 66000,
        "fertilizer_protocol": {
            "basal": "DAP 50 kg + Sulphur 10 kg + Rhizobium seed treatment",
            "flowering_75d": "Pulse wonder foliar spray @ 2g/L or 1% urea spray",
        },
        "pest_management": [
            {
                "pest_or_disease": "Pod Borer (Helicoverpa armigera)",
                "symptoms": "Holes in pods, caterpillars feeding on developing seeds",
                "chemical_spray": "Chlorantraniliprole 18.5% SC @ 0.3ml/L or Indoxacarb 14.5% SC @ 1ml/L",
                "organic_spray": "HaNPV @ 250 LE/acre + Bird perches (20/acre)",
            }
        ],
        "intercrop_suitability": "Ideal intercrop with Cotton (1:4), Groundnut (1:7) or Soybean (1:4)",
    },
    "Finger Millet (Ragi)": {
        "crop_name": "Finger Millet (Ragi)",
        "telugu_name": "రాగులు (Ragulu)",
        "category": "Cereals & Millets",
        "suitable_soils": ["Red Sandy Loam", "Laterite / Red Gravelly", "Alluvial Loam"],
        "suitable_seasons": ["Kharif", "Rabi", "Summer"],
        "min_water": "Low (Highly Climate Resilient)",
        "duration_days": "95 - 110 days",
        "expected_yield_qtl_acre": "14 - 18 Quintals / acre",
        "avg_market_price_qtl": 4376,
        "cultivation_cost_acre": 12000,
        "estimated_net_profit_acre": 53640,
        "fertilizer_protocol": {
            "basal": "DAP 35 kg + MOP 15 kg + FYM 3 tons",
            "tillering_25d": "Urea 25 kg top dress",
        },
        "pest_management": [
            {
                "pest_or_disease": "Ragi Blast (Pyricularia grisea)",
                "symptoms": "Neck and finger blast turning brown and breaking",
                "chemical_spray": "Tricyclazole 75% WP @ 0.6g/L",
                "organic_spray": "Pseudomonas fluorescens @ 5g/L seed treatment & foliar spray",
            }
        ],
        "intercrop_suitability": "Ragi + Field bean / Cowpea in 8:2 row ratio",
    }
}

def recommend_crops(
    state: str,
    district: str,
    soil_type: str,
    season: str,
    water_source: str,
) -> list[dict[str, Any]]:
    """Evaluates agronomic parameters and returns prioritized crop recommendations with POP."""
    scored_crops = []

    for crop_name, details in CROP_AGRONOMIC_KNOWLEDGE.items():
        score = 0
        reasons = []

        # Soil Match
        if soil_type in details["suitable_soils"]:
            score += 35
            reasons.append(f"Highly suited to your {soil_type} soil texture.")
        elif any("Loam" in s for s in details["suitable_soils"]) and "Loam" in soil_type:
            score += 25
            reasons.append("Adaptable to your loamy soil conditions.")
        else:
            score += 10

        # Season Match
        if season in details["suitable_seasons"]:
            score += 35
            reasons.append(f"Optimal planting window during {season} season.")
        else:
            score += 5

        # Water/Irrigation Match
        water_req = details["min_water"]
        if "Canal" in water_source or "Borewell" in water_source:
            score += 20
            reasons.append("Water supply meets requirement.")
        elif "Rainfed" in water_source:
            if "Low" in water_req:
                score += 25
                reasons.append("Excellent drought-resilience for rainfed drylands.")
            elif "Medium" in water_req:
                score += 15
            else:
                score -= 10
                reasons.append("Caution: Requires supplemental irrigation during dry spells.")

        # District heritage bonus
        dist_lower = district.lower()
        if "guntur" in dist_lower and "chilli" in crop_name.lower():
            score += 10
            reasons.append("Guntur is the world hub for chilli marketing and processing.")
        elif "warangal" in dist_lower and "cotton" in crop_name.lower():
            score += 10
            reasons.append("Warangal black soil region boasts premier cotton yields and ginning.")
        elif "nizamabad" in dist_lower and ("turmeric" in crop_name.lower() or "rice" in crop_name.lower()):
            score += 10
            reasons.append("Nizamabad APMC offers top tier price discovery for this produce.")
        elif "anantapur" in dist_lower and "groundnut" in crop_name.lower():
            score += 10
            reasons.append("Anantapur red soils are traditionally optimal for groundnut cultivation.")

        scored_crops.append({
            **details,
            "suitability_score": min(score, 98),
            "match_reasons": reasons,
        })

    scored_crops.sort(key=lambda x: x["suitability_score"], reverse=True)
    return scored_crops
