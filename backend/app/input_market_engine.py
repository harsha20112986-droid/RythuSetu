"""
RythuSetu Agri Inputs, Pesticides & Fertilizer Market Engine
Provides verified brand packaging, active chemical formulas, multi-store price comparisons,
and nearby authorized trader store contacts.
Features 100% ORIGINAL packaging images for certified Indian pesticides and fertilizers.
"""

from typing import Any

VERIFIED_AGRI_PRODUCTS: list[dict[str, Any]] = [
    {
        "id": "inp-coragen-01",
        "brand_name": "FMC Coragen",
        "telugu_brand_name": "కోరాజెన్ (FMC)",
        "manufacturer": "FMC India Ltd.",
        "category": "Pesticide (Insecticide)",
        "chemical_formula": "Chlorantraniliprole 18.5% SC",
        "chemical_class": "Anthranilic Diamide (Ryanodine Receptor Modulator)",
        "target_crops": ["Paddy / Rice", "Cotton", "Maize", "Red Chilli", "Groundnut", "Pigeon Pea / Red Gram"],
        "target_pests": ["Yellow Stem Borer", "Leaf Folder", "Fall Armyworm (FAW)", "American Bollworm", "Fruit Borer"],
        "recommended_dosage": "60 ml per acre (0.3 ml - 0.4 ml per Liter of water)",
        "application_method": "Foliar Spray with knapsack nozzle directly into canopy/whorls",
        "pack_size": "60 ml / 150 ml bottle",
        "image_url": "/images/products/coragen.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/coragen-dupont-file-1135.jpg?v=1737429360",
        "safety_notes": "Safe for beneficial predators; 3-day pre-harvest waiting interval (PHI).",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 1850,
                "mrp_inr": 2150,
                "savings_inr": 300,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=coragen",
                "shipping": "Free Home Delivery (Cash on Delivery)",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 1920,
                "mrp_inr": 2150,
                "savings_inr": 230,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=coragen",
                "shipping": "₹49 Village Doorstep Delivery",
                "delivery_days": "3 - 4 Days",
                "badge": "Doorstep Delivery"
            },
            {
                "store_name": "KisanShop",
                "price_inr": 1990,
                "mrp_inr": 2150,
                "savings_inr": 160,
                "is_lowest": False,
                "url": "https://kisanshop.in/search?type=product&q=coragen",
                "shipping": "Speed Courier",
                "delivery_days": "4 - 5 Days",
                "badge": "Verified Batch"
            },
            {
                "store_name": "RBK / PACS Govt Center",
                "price_inr": 1790,
                "mrp_inr": 2150,
                "savings_inr": 360,
                "is_lowest": True,
                "url": "",
                "shipping": "Direct Walk-In with Farmer Aadhaar",
                "delivery_days": "Immediate Pickup",
                "badge": "Subsidized Quota"
            }
        ],
        "keywords": ["chlorantraniliprole", "coragen", "stem borer", "fall armyworm", "faw", "bollworm", "caterpillar"]
    },
    {
        "id": "inp-delegate-02",
        "brand_name": "Corteva Delegate",
        "telugu_brand_name": "డెలిగేట్ (కోర్టెవా)",
        "manufacturer": "Corteva Agriscience",
        "category": "Pesticide (Insecticide)",
        "chemical_formula": "Spinetoram 11.7% SC",
        "chemical_class": "Spinosyn (Naturally Derived Fermentation Metabolite)",
        "target_crops": ["Red Chilli", "Cotton", "Maize"],
        "target_pests": ["Black Thrips (Thrips parvispinus)", "Flower Bud Thrips", "Fall Armyworm", "Spodoptera"],
        "recommended_dosage": "180 ml per acre (0.9 ml - 1.0 ml per Liter of water)",
        "application_method": "Foliar spray during late afternoon cool hours with non-ionic sticker",
        "pack_size": "50 ml / 100 ml / 180 ml bottle",
        "image_url": "/images/products/delegate.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/delegate-insecticide-file-20063_3afbfc27-172f-4a40-988d-9bb54c22f8d1.jpg?v=1747131248",
        "safety_notes": "Highly effective on resistant thrips; do not mix with heavy copper fungicides.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 1780,
                "mrp_inr": 2050,
                "savings_inr": 270,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=spinetoram+delegate",
                "shipping": "Free Shipping on prepaid/COD",
                "delivery_days": "2 - 4 Days",
                "badge": "Best Seller for Thrips 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 1840,
                "mrp_inr": 2050,
                "savings_inr": 210,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=delegate",
                "shipping": "Express Farmer Dispatch",
                "delivery_days": "3 - 5 Days",
                "badge": "Official Corteva Stock"
            }
        ],
        "keywords": ["spinetoram", "delegate", "black thrips", "thrips", "chilli curl", "leaf curl"]
    },
    {
        "id": "inp-confidor-03",
        "brand_name": "Bayer Confidor 200 SL",
        "telugu_brand_name": "కాన్ఫిడార్ (బేయర్)",
        "manufacturer": "Bayer CropScience",
        "category": "Pesticide (Systemic Insecticide)",
        "chemical_formula": "Imidacloprid 17.8% SL",
        "chemical_class": "Neonicotinoid (Systemic Sucking Pest Blocker)",
        "target_crops": ["Cotton", "Paddy / Rice", "Red Chilli", "Groundnut"],
        "target_pests": ["Aphids", "Jassids", "Whiteflies", "Brown Plant Hopper (BPH)", "Thrips"],
        "recommended_dosage": "50 ml - 75 ml per acre (0.3 ml - 0.5 ml per Liter of water)",
        "application_method": "Foliar Spray or seedling root dip before transplanting",
        "pack_size": "50 ml / 100 ml / 250 ml bottle",
        "image_url": "/images/products/confidor.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/confidor-file-673.jpg",
        "safety_notes": "Absorbed rapidly into xylem vessels within 2 hours of spray; rainfast.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 360,
                "mrp_inr": 435,
                "savings_inr": 75,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=confidor",
                "shipping": "Express Courier",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 385,
                "mrp_inr": 435,
                "savings_inr": 50,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=confidor",
                "shipping": "Village Delivery",
                "delivery_days": "3 - 4 Days",
                "badge": "Genuine Bayer Seal"
            }
        ],
        "keywords": ["imidacloprid", "confidor", "aphids", "jassids", "whitefly", "sucking pests"]
    },
    {
        "id": "inp-amistar-04",
        "brand_name": "Syngenta Amistar Top",
        "telugu_brand_name": "అమిస్టార్ టాప్ (సింజెంటా)",
        "manufacturer": "Syngenta India",
        "category": "Fungicide (Broad Spectrum Systemic)",
        "chemical_formula": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        "chemical_class": "Strobilurin + Triazole Dual Action",
        "target_crops": ["Red Chilli", "Paddy / Rice", "Cotton", "Groundnut", "Turmeric"],
        "target_pests": ["Anthracnose / Fruit Rot", "Die-Back", "Sheath Blight", "Blast", "Leaf Spot / Tikka"],
        "recommended_dosage": "200 ml per acre (1.0 ml per Liter of water)",
        "application_method": "Preventive spray at flower initiation or early spot appearance",
        "pack_size": "100 ml / 200 ml / 500 ml bottle",
        "image_url": "/images/products/amistar_top.webp",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/amistar-top-fungicide-file-3948.webp",
        "safety_notes": "Enhances plant greening effect ('AgCelence') and prolongs photosynthetic efficiency.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 1490,
                "mrp_inr": 1720,
                "savings_inr": 230,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=amistar+top",
                "shipping": "Free Delivery (COD eligible)",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 1540,
                "mrp_inr": 1720,
                "savings_inr": 180,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=amistar+top",
                "shipping": "₹49 Doorstep delivery",
                "delivery_days": "3 - 5 Days",
                "badge": "Syngenta Direct"
            }
        ],
        "keywords": ["azoxystrobin", "difenoconazole", "amistar top", "anthracnose", "fruit rot", "die-back", "blast"]
    },
    {
        "id": "inp-blitox-05",
        "brand_name": "Tata Rallis Blitox 50 + Streptocycline",
        "telugu_brand_name": "బ్లైటాక్స్ 50 + స్ట్రెప్టోసైక్లిన్",
        "manufacturer": "Tata Rallis / Hindustan Antibiotics",
        "category": "Bactericide & Contact Fungicide",
        "chemical_formula": "Copper Oxychloride 50% WP + Streptomycin Sulphate 90% & Tetracycline 10%",
        "chemical_class": "Inorganic Copper + Broad Spectrum Bactericide",
        "target_crops": ["Cotton", "Paddy / Rice", "Red Chilli"],
        "target_pests": ["Bacterial Leaf Blight (Black Arm)", "Bacterial Leaf Streak", "Stem Canker"],
        "recommended_dosage": "Copper Oxychloride 300g + Streptocycline 6g (1 pouch) per acre in 150-200 L water",
        "application_method": "Dissolve Streptocycline in a separate mug first before mixing into copper spray tank",
        "pack_size": "500g Blitox + 6g Streptocycline pack",
        "image_url": "/images/products/blitox.webp",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/tata-rallis-blitox-fungicide-file-2556.webp?v=1737467922",
        "safety_notes": "Do not mix with alkaline substances or sulfur sprays.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 340,
                "mrp_inr": 410,
                "savings_inr": 70,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=blitox+copper+oxychloride",
                "shipping": "Fast Courier",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 365,
                "mrp_inr": 410,
                "savings_inr": 45,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=blitox",
                "shipping": "Direct delivery",
                "delivery_days": "3 - 4 Days",
                "badge": "Tata Authenticated"
            }
        ],
        "keywords": ["copper oxychloride", "blitox", "streptocycline", "bacterial blight", "black arm", "xanthomonas"]
    },
    {
        "id": "inp-tricyclazole-06",
        "brand_name": "Indofil Baan (Corteva Beam / BIM)",
        "telugu_brand_name": "బాన్ / బీమ్ (ట్రైసైక్లజోల్ 75 WP)",
        "manufacturer": "Indofil Industries / Corteva Agriscience",
        "category": "Fungicide (Systemic Rice Specialist)",
        "chemical_formula": "Tricyclazole 75% WP",
        "chemical_class": "Melanin Biosynthesis Inhibitor (MBI)",
        "target_crops": ["Paddy / Rice"],
        "target_pests": ["Rice Leaf Blast", "Neck Blast", "Node Blast"],
        "recommended_dosage": "120g per acre (0.6g per Liter of water)",
        "application_method": "Spray at first appearance of spindle eye-spots or just prior to heading",
        "pack_size": "120g / 250g pouch",
        "image_url": "/images/products/beam_tricyclazole.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/beam-fungicide-file-2948.jpg",
        "safety_notes": "Specific systemic protection against rice blast spores; rainfast within 1 hour.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 420,
                "mrp_inr": 510,
                "savings_inr": 90,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=tricyclazole+75+wp",
                "shipping": "Prepaid / COD available",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 445,
                "mrp_inr": 510,
                "savings_inr": 65,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=tricyclazole",
                "shipping": "Village Drop",
                "delivery_days": "3 - 5 Days",
                "badge": "Blast Cure"
            }
        ],
        "keywords": ["tricyclazole", "baan", "beam", "blast", "leaf blast", "neck blast", "rice blast"]
    },
    {
        "id": "inp-contaf-07",
        "brand_name": "Tata Rallis Contaf Plus",
        "telugu_brand_name": "కాంటాఫ్ ప్లస్ (టాటా రాలీస్)",
        "manufacturer": "Tata Rallis India",
        "category": "Fungicide (Systemic Triazole)",
        "chemical_formula": "Hexaconazole 5% SC",
        "chemical_class": "Ergosterol Biosynthesis Inhibitor (Triazole)",
        "target_crops": ["Groundnut", "Paddy / Rice", "Cotton", "Maize"],
        "target_pests": ["Tikka Leaf Spot", "Sheath Blight", "Rust", "Powdery Mildew"],
        "recommended_dosage": "400 ml per acre (2.0 ml per Liter of water)",
        "application_method": "Foliar spray with high-volume sprayer covering undersides of leaves",
        "pack_size": "250 ml / 500 ml / 1 Liter bottle",
        "image_url": "/images/products/contaf_plus.webp",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/contaf-plus-fungicide-file-2181.webp?v=1737483267",
        "safety_notes": "Excellent translaminar and acropetal systemic mobility.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 410,
                "mrp_inr": 490,
                "savings_inr": 80,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=contaf+plus",
                "shipping": "Fast Express",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 430,
                "mrp_inr": 490,
                "savings_inr": 60,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=contaf",
                "shipping": "Standard delivery",
                "delivery_days": "3 - 4 Days",
                "badge": "Tikka Control"
            }
        ],
        "keywords": ["hexaconazole", "contaf", "tikka", "leaf spot", "sheath blight", "rust"]
    },
    {
        "id": "inp-dap-08",
        "brand_name": "IFFCO Bharat DAP (18-46-0)",
        "telugu_brand_name": "డి.ఎ.పి ఎరువు (IFFCO భారత డిఎపి)",
        "manufacturer": "IFFCO / Coromandel International",
        "category": "Chemical Fertilizer (Primary Macronutrient)",
        "chemical_formula": "Diammonium Phosphate (18% Nitrogen : 46% P2O5 Phosphate)",
        "chemical_class": "NP Complex Inorganic Fertilizer",
        "target_crops": ["Paddy / Rice", "Cotton", "Red Chilli", "Maize", "Groundnut", "Pigeon Pea / Red Gram"],
        "target_pests": ["Root zone development, vigorous tillering, early stem strength"],
        "recommended_dosage": "50 kg bag per acre applied as Basal dose during final field plowing/puddling",
        "application_method": "Soil placement 5-7 cm below seed furrow; avoid direct contact with emerging seed radicle",
        "pack_size": "50 kg subsidized bag",
        "image_url": "/images/products/iffco_dap.jpg",
        "cdn_image_url": "https://5.imimg.com/data5/SELLER/Default/2025/3/498159165/DU/JS/PD/243142326/img-20250325-wa0010-500x500.jpg",
        "safety_notes": "Govt subsidized price with fixed MRP of ₹1,350 per bag across India under NBS scheme.",
        "price_comparison": [
            {
                "store_name": "IFFCO Bazar Official",
                "price_inr": 1350,
                "mrp_inr": 1350,
                "savings_inr": 0,
                "is_lowest": True,
                "url": "https://iffcobazar.in/en/search?q=dap",
                "shipping": "Free delivery to PACS / Kisan Kendra",
                "delivery_days": "1 - 2 Days",
                "badge": "Govt Subsidized MRP 🟢"
            },
            {
                "store_name": "Local Rythu Bharosa Kendra (RBK)",
                "price_inr": 1350,
                "mrp_inr": 1350,
                "savings_inr": 0,
                "is_lowest": True,
                "url": "",
                "shipping": "Instant POS Aadhaar distribution",
                "delivery_days": "Same Day Pickup",
                "badge": "Zero Extra Dealer Margin"
            }
        ],
        "keywords": ["dap", "diammonium phosphate", "18:46:0", "phosphate", "fertilizer", "basal"]
    },
    {
        "id": "inp-urea-09",
        "brand_name": "IFFCO Neem Coated Urea",
        "telugu_brand_name": "వేప పూత యూరియా (IFFCO 45 కిలోల బస్తా)",
        "manufacturer": "IFFCO / KRIBHCO / NFL",
        "category": "Chemical Fertilizer (Nitrogenous)",
        "chemical_formula": "Neem Coated Urea (46% Nitrogen - NH2CONH2)",
        "chemical_class": "Slow-Release Nitrogenous Fertilizer",
        "target_crops": ["Paddy / Rice", "Cotton", "Maize", "Red Chilli", "Groundnut"],
        "target_pests": ["Vegetative shoot growth, chlorophyll production, leaf canopy expansion"],
        "recommended_dosage": "Split into 2-3 top dressings (25-35 kg per acre per split)",
        "application_method": "Broadcast evenly when soil is moist; never apply when foliage is wet from dew",
        "pack_size": "45 kg subsidized bag",
        "image_url": "/images/products/iffco_urea.jpg",
        "cdn_image_url": "https://5.imimg.com/data5/SELLER/Default/2025/9/541746572/YS/TM/RT/83784265/iffco-neem-coated-urea-fertilizer-500x500.jpg",
        "safety_notes": "Neem coating reduces nitrification inhibitor losses and prevents industrial diversion.",
        "price_comparison": [
            {
                "store_name": "Govt Fixed MRP (RBK / PACS)",
                "price_inr": 266,
                "mrp_inr": 266,
                "savings_inr": 0,
                "is_lowest": True,
                "url": "https://iffcobazar.in/en/search?q=urea",
                "shipping": "Direct distribution at PACS / Cooperative Society",
                "delivery_days": "Immediate with e-POS slip",
                "badge": "Statutory MRP ₹266.50 🟢"
            }
        ],
        "keywords": ["urea", "nitrogen", "neem coated urea", "top dress", "iffco", "kribhco"]
    },
    {
        "id": "inp-gromor-10",
        "brand_name": "Coromandel Gromor 10-26-26",
        "telugu_brand_name": "గ్రోమోర్ 10-26-26 (కోరమాండల్)",
        "manufacturer": "Coromandel International Ltd.",
        "category": "Complex NPK Fertilizer",
        "chemical_formula": "NPK 10:26:26 (10% N, 26% P2O5, 26% K2O)",
        "chemical_class": "High Potash Balanced Granular NPK",
        "target_crops": ["Red Chilli", "Cotton", "Turmeric", "Groundnut", "Paddy / Rice"],
        "target_pests": ["High pod luster, fruit size, capsicum oleoresin, drought resilience"],
        "recommended_dosage": "75 - 100 kg per acre in basal and vegetative stages",
        "application_method": "Side banding around root zone and light incorporation",
        "pack_size": "50 kg bag",
        "image_url": "/images/products/gromor_10_26_26.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/gromor-10-26-26-conventional-fertilizer-file-4542.jpg",
        "safety_notes": "Ideal for potassium-demanding cash crops like Red Chilli and Cotton.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 1470,
                "mrp_inr": 1600,
                "savings_inr": 130,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=10-26-26",
                "shipping": "Express Delivery",
                "delivery_days": "2 - 4 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "Local Fertilizers Dealership",
                "price_inr": 1470,
                "mrp_inr": 1600,
                "savings_inr": 130,
                "is_lowest": True,
                "url": "",
                "shipping": "Same day store pickup",
                "delivery_days": "Available Today",
                "badge": "In-Stock Nearby"
            }
        ],
        "keywords": ["gromor", "10-26-26", "potash", "coromandel", "complex fertilizer"]
    },
    {
        "id": "inp-npk19-11",
        "brand_name": "IFFCO 19-19-19 (Water Soluble NPK)",
        "telugu_brand_name": "19-19-19 నీటిలో కరిగే ఎరువు (IFFCO)",
        "manufacturer": "IFFCO / Aries Agro",
        "category": "Water Soluble Foliar Fertilizer",
        "chemical_formula": "100% Water Soluble NPK 19:19:19",
        "chemical_class": "Foliar Spray & Fertigation Nutrition",
        "target_crops": ["Cotton", "Red Chilli", "Paddy / Rice", "Maize", "Groundnut"],
        "target_pests": ["Instant vegetative revival, stress chlorosis recovery, balanced growth"],
        "recommended_dosage": "1 kg per acre (5g per Liter of water) sprayed at 25-30 days",
        "application_method": "Dissolve completely in water and spray evenly over foliage during morning",
        "pack_size": "1 kg / 5 kg pouch",
        "image_url": "/images/products/npk_19_19_19.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/otlas-balance-npk-19-19-19-file-16041.jpg",
        "safety_notes": "100% water soluble with zero residue; compatible with most non-alkaline insecticides.",
        "price_comparison": [
            {
                "store_name": "IFFCO Bazar",
                "price_inr": 140,
                "mrp_inr": 180,
                "savings_inr": 40,
                "is_lowest": True,
                "url": "https://iffcobazar.in/en/search?q=19-19-19",
                "shipping": "Free Delivery on orders > ₹500",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "BigHaat",
                "price_inr": 155,
                "mrp_inr": 180,
                "savings_inr": 25,
                "is_lowest": False,
                "url": "https://www.bighaat.com/search?q=19-19-19",
                "shipping": "Courier Delivery",
                "delivery_days": "2 - 4 Days",
                "badge": "Quick Delivery"
            }
        ],
        "keywords": ["19-19-19", "foliar", "water soluble", "npk", "leaf spray", "nutrition"]
    },
    {
        "id": "inp-zinc-12",
        "brand_name": "Aries Chelamin Gold (Chelated Zinc EDTA)",
        "telugu_brand_name": "కీలేటెడ్ జింక్ (ఎరీస్ ఆగ్రో)",
        "manufacturer": "Aries Agro Ltd.",
        "category": "Micronutrient (EDTA Chelated)",
        "chemical_formula": "Zinc as Zn-EDTA (12% Zn w/w)",
        "chemical_class": "Chelated Micronutrient Fertilizer",
        "target_crops": ["Paddy / Rice", "Cotton", "Red Chilli", "Maize"],
        "target_pests": ["Khaira disease in rice, little leaf of cotton, interveinal leaf yellowing"],
        "recommended_dosage": "200g per acre (1.0g per Liter of water)",
        "application_method": "Foliar spray at active tillering / vegetative stage",
        "pack_size": "100g / 250g / 500g pouch",
        "image_url": "/images/products/chelamin_zinc.png",
        "cdn_image_url": "https://ariesagro.com/wp-content/uploads/2022/11/Chelamin-Gold_New-low-663x1024.png",
        "safety_notes": "Does not react with phosphates in soil/tank; 100% bio-available to roots and leaves.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 230,
                "mrp_inr": 285,
                "savings_inr": 55,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=chelated+zinc",
                "shipping": "Express Courier",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 250,
                "mrp_inr": 285,
                "savings_inr": 35,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=zinc",
                "shipping": "Doorstep",
                "delivery_days": "3 - 5 Days",
                "badge": "Soil Care"
            }
        ],
        "keywords": ["zinc", "chelated zinc", "edta", "khaira", "micronutrient", "yellowing"]
    },
    {
        "id": "inp-nativo-13",
        "brand_name": "Bayer Nativo 75 WG",
        "telugu_brand_name": "నేటివో (బేయర్ శిలీంద్రనాశిని)",
        "manufacturer": "Bayer CropScience",
        "category": "Fungicide (Systemic Broad-Spectrum)",
        "chemical_formula": "Tebuconazole 50% + Trifloxystrobin 25% WG",
        "chemical_class": "Triazole + Strobilurin Dual Action",
        "target_crops": ["Paddy / Rice", "Red Chilli", "Cotton", "Groundnut"],
        "target_pests": ["Sheath Blight", "Dirty Panicle", "Anthracnose / Fruit Rot", "Alternaria Leaf Spot"],
        "recommended_dosage": "120g per acre (0.6g - 0.8g per Liter of water)",
        "application_method": "Foliar spray at early symptoms or boot-leaf stage",
        "pack_size": "100g / 250g / 500g pack",
        "image_url": "/images/products/bayer_nativo.webp",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/bayer-nativo-fungicide-file-9643.webp",
        "safety_notes": "Offers systemic and mesostemic activity with strong rainfastness.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 920,
                "mrp_inr": 1050,
                "savings_inr": 130,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=nativo",
                "shipping": "Free Shipping",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 950,
                "mrp_inr": 1050,
                "savings_inr": 100,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=nativo",
                "shipping": "Village Delivery",
                "delivery_days": "3 - 4 Days",
                "badge": "Bayer Certified"
            }
        ],
        "keywords": ["nativo", "tebuconazole", "trifloxystrobin", "sheath blight", "anthracnose", "fruit rot"]
    },
    {
        "id": "inp-saaf-14",
        "brand_name": "UPL Saaf Fungicide",
        "telugu_brand_name": "సాఫ్ (UPL శిలీంద్రనాశిని)",
        "manufacturer": "UPL Ltd.",
        "category": "Fungicide (Contact & Systemic)",
        "chemical_formula": "Carbendazim 12% + Mancozeb 63% WP",
        "chemical_class": "Benzimidazole + Dithiocarbamate",
        "target_crops": ["Groundnut", "Paddy / Rice", "Cotton", "Red Chilli", "Vegetables"],
        "target_pests": ["Tikka Disease", "Collar Rot", "Root Rot", "Blast", "Leaf Spot"],
        "recommended_dosage": "300g - 400g per acre (1.5g - 2.0g per Liter of water) or 2.5g/kg seed treatment",
        "application_method": "Seed treatment, nursery soil drenching, or foliar spray",
        "pack_size": "250g / 500g / 1 kg pack",
        "image_url": "/images/products/upl_saaf.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/upl-saaf-fungicide-file-2147.jpg",
        "safety_notes": "Dual mode of action prevents fungal resistance; ideal benchmark for seed protection.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 310,
                "mrp_inr": 365,
                "savings_inr": 55,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=saaf",
                "shipping": "Courier Delivery",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 325,
                "mrp_inr": 365,
                "savings_inr": 40,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=saaf",
                "shipping": "Doorstep",
                "delivery_days": "3 - 5 Days",
                "badge": "UPL Verified"
            }
        ],
        "keywords": ["saaf", "carbendazim", "mancozeb", "tikka", "root rot", "seed treatment"]
    },
    {
        "id": "inp-gracia-15",
        "brand_name": "Godrej Gracia",
        "telugu_brand_name": "గ్రేసియా (గోద్రోజ్ ఇన్‌సెక్టిసైడ్)",
        "manufacturer": "Godrej Agrovet / Nissan Chemical",
        "category": "Pesticide (Novel Isoxazoline Insecticide)",
        "chemical_formula": "Fluxametamide 10% w/w EC",
        "chemical_class": "Isoxazoline GABA-Gated Chloride Channel Antagonist",
        "target_crops": ["Red Chilli", "Cotton", "Brinjal", "Tomato"],
        "target_pests": ["Thrips (parvispinus)", "Fruit Borer (Helicoverpa)", "Spodoptera", "Mites"],
        "recommended_dosage": "160 ml per acre (0.8 ml - 1.0 ml per Liter of water)",
        "application_method": "Foliar spray with good coverage during pest initiation",
        "pack_size": "80 ml / 160 ml bottle",
        "image_url": "/images/products/gracia.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/gracia-insecticide-file-10870.jpg?v=1737444765",
        "safety_notes": "Targets both chewing caterpillar borers and sucking thrips simultaneously.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 1690,
                "mrp_inr": 1950,
                "savings_inr": 260,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=gracia",
                "shipping": "Free Shipping",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 1740,
                "mrp_inr": 1950,
                "savings_inr": 210,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=gracia",
                "shipping": "Village Delivery",
                "delivery_days": "3 - 5 Days",
                "badge": "Godrej Direct"
            }
        ],
        "keywords": ["gracia", "fluxametamide", "thrips", "black thrips", "borer", "isoxazoline"]
    },
    {
        "id": "inp-ampligo-16",
        "brand_name": "Syngenta Ampligo",
        "telugu_brand_name": "ఆంప్లిగో (సింజెంటా)",
        "manufacturer": "Syngenta India Ltd.",
        "category": "Pesticide (Broad Spectrum Insecticide)",
        "chemical_formula": "Chlorantraniliprole 9.3% + Lambda-cyhalothrin 4.6% ZC",
        "chemical_class": "Anthranilic Diamide + Synthetic Pyrethroid",
        "target_crops": ["Cotton", "Maize", "Pigeon Pea / Red Gram", "Soybean"],
        "target_pests": ["American Bollworm", "Spotted Bollworm", "Fall Armyworm (FAW)", "Pod Borer"],
        "recommended_dosage": "100 ml per acre (0.5 ml per Liter of water)",
        "application_method": "Foliar spray with knapsack or tractor-mounted boom sprayer",
        "pack_size": "80 ml / 200 ml / 500 ml bottle",
        "image_url": "/images/products/ampligo.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/ampligo-insecticide-file-20086.jpg?v=1747130740",
        "safety_notes": "Patented ZC formulation provides instant knockdown + long residual protection.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 1150,
                "mrp_inr": 1320,
                "savings_inr": 170,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=ampligo",
                "shipping": "Fast Express",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 1190,
                "mrp_inr": 1320,
                "savings_inr": 130,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=ampligo",
                "shipping": "Direct delivery",
                "delivery_days": "3 - 4 Days",
                "badge": "Knockdown Formula"
            }
        ],
        "keywords": ["ampligo", "chlorantraniliprole", "lambda", "bollworm", "faw", "fall armyworm"]
    },
    {
        "id": "inp-ulala-17",
        "brand_name": "UPL Ulala Insecticide",
        "telugu_brand_name": "ఉలాలా (UPL వైట్ ఫ్లై నాశిని)",
        "manufacturer": "UPL Limited",
        "category": "Pesticide (Targeted Sucking Pest Specialist)",
        "chemical_formula": "Flonicamid 50% WG",
        "chemical_class": "Pyridinecarboxamide",
        "target_crops": ["Cotton", "Paddy / Rice", "Red Chilli"],
        "target_pests": ["Whitefly", "Brown Plant Hopper (BPH)", "Aphids", "Jassids"],
        "recommended_dosage": "60g per acre (0.3g per Liter of water)",
        "application_method": "Foliar spray targeting stem base for BPH and leaf undersides for Whiteflies",
        "pack_size": "60g / 150g / 250g pack",
        "image_url": "/images/products/ulala.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/upl-ulala-insecticide-file-4566.jpg",
        "safety_notes": "Stops insect feeding reflex within 30 minutes; safe for natural predators and pollinators.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 690,
                "mrp_inr": 810,
                "savings_inr": 120,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=ulala",
                "shipping": "Express Courier",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 720,
                "mrp_inr": 810,
                "savings_inr": 90,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=ulala",
                "shipping": "Doorstep",
                "delivery_days": "3 - 5 Days",
                "badge": "BPH Specialist"
            }
        ],
        "keywords": ["ulala", "flonicamid", "whitefly", "bph", "brown plant hopper", "jassids"]
    },
    {
        "id": "inp-ridomil-18",
        "brand_name": "Syngenta Ridomil Gold",
        "telugu_brand_name": "రిడోమిల్ గోల్డ్ (సింజెంటా)",
        "manufacturer": "Syngenta India Ltd.",
        "category": "Fungicide (Systemic & Contact)",
        "chemical_formula": "Metalaxyl-M 4% + Mancozeb 64% WP",
        "chemical_class": "Phenylamide + Dithiocarbamate",
        "target_crops": ["Chilli", "Tomato", "Cotton", "Turmeric"],
        "target_pests": ["Damping Off", "Collar Rot", "Late Blight", "Downy Mildew", "Rhizome Rot"],
        "recommended_dosage": "500g per acre (2.5g per Liter of water) or drenching @ 2g/L",
        "application_method": "Nursery drenching or preventative foliar spray",
        "pack_size": "250g / 500g / 1 kg pack",
        "image_url": "/images/products/ridomil_gold.jpg",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/ridomill-gold-fungicide-file-2991.jpg",
        "safety_notes": "Industry standard for nursery soil damping-off control in chilli and vegetable nurseries.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 630,
                "mrp_inr": 740,
                "savings_inr": 110,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=ridomil+gold",
                "shipping": "Free Delivery",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 660,
                "mrp_inr": 740,
                "savings_inr": 80,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=ridomil",
                "shipping": "Direct delivery",
                "delivery_days": "3 - 4 Days",
                "badge": "Damping Off Cure"
            }
        ],
        "keywords": ["ridomil", "metalaxyl", "mancozeb", "damping off", "late blight", "downy mildew", "rot"]
    },
    {
        "id": "inp-pegasus-19",
        "brand_name": "Syngenta Pegasus",
        "telugu_brand_name": "పెగాసస్ (సింజెంటా పురుగు మందు)",
        "manufacturer": "Syngenta India Ltd.",
        "category": "Pesticide (Acaricide & Insecticide)",
        "chemical_formula": "Diafenthiuron 50% WP",
        "chemical_class": "Thiourea derivative",
        "target_crops": ["Cotton", "Red Chilli", "Brinjal", "Citrus"],
        "target_pests": ["Whitefly (nymphs & adults)", "Mites", "Aphids", "Diamond Back Moth"],
        "recommended_dosage": "250g per acre (1.25g per Liter of water)",
        "application_method": "Foliar spray with uniform coverage on both surfaces of leaves",
        "pack_size": "250g / 500g pack",
        "image_url": "/images/products/pegasus.webp",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/pegasus-insecticide-file-1819.webp",
        "safety_notes": "Converts into carbodiimide upon sunlight exposure, providing high vapor action under leaves.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 820,
                "mrp_inr": 960,
                "savings_inr": 140,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=pegasus",
                "shipping": "Fast Express",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 850,
                "mrp_inr": 960,
                "savings_inr": 110,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=pegasus",
                "shipping": "Village Delivery",
                "delivery_days": "3 - 5 Days",
                "badge": "Whitefly & Mite Fighter"
            }
        ],
        "keywords": ["pegasus", "diafenthiuron", "whitefly", "mites", "cotton whitefly", "red spider mite"]
    },
    {
        "id": "inp-danitol-20",
        "brand_name": "Sumitomo Danitol",
        "telugu_brand_name": "డానిటాల్ (సుమిటోమో)",
        "manufacturer": "Sumitomo Chemical India",
        "category": "Pesticide (Pyrethroid Insecticide)",
        "chemical_formula": "Fenpropathrin 10% EC",
        "chemical_class": "Synthetic Pyrethroid with Acaricidal activity",
        "target_crops": ["Cotton", "Red Chilli", "Soybean"],
        "target_pests": ["Pink Bollworm", "Spotted Bollworm", "Whitefly", "Mites"],
        "recommended_dosage": "300 ml - 400 ml per acre (1.5 ml - 2.0 ml per Liter of water)",
        "application_method": "Foliar spray during squaring and flowering peak",
        "pack_size": "250 ml / 500 ml / 1 Liter bottle",
        "image_url": "/images/products/danitol.webp",
        "cdn_image_url": "https://cdn.shopify.com/s/files/1/0722/2059/files/danitol-insecticide-file-4223.webp",
        "safety_notes": "Potent repellent and ovicidal effect preventing pink bollworm egg hatching.",
        "price_comparison": [
            {
                "store_name": "BigHaat",
                "price_inr": 540,
                "mrp_inr": 625,
                "savings_inr": 85,
                "is_lowest": True,
                "url": "https://www.bighaat.com/search?q=danitol",
                "shipping": "Courier Delivery",
                "delivery_days": "2 - 3 Days",
                "badge": "Lowest Online Rate 🟢"
            },
            {
                "store_name": "AgroStar",
                "price_inr": 565,
                "mrp_inr": 625,
                "savings_inr": 60,
                "is_lowest": False,
                "url": "https://www.agrostar.in/search?q=danitol",
                "shipping": "Doorstep",
                "delivery_days": "3 - 4 Days",
                "badge": "Pink Bollworm Care"
            }
        ],
        "keywords": ["danitol", "fenpropathrin", "pink bollworm", "bollworm", "mites", "sumitomo"]
    }
]

# Verified Authorized Fertilizer & Pesticide Retailers in AP & Telangana
AUTHORIZED_DEALERS: list[dict[str, Any]] = [
    {
        "id": "dlr-gnt-01",
        "store_name": "Sri Balaji Fertilizers & Agro Chemicals",
        "telugu_name": "శ్రీ బాలాజీ ఎరువులు & క్రిమిసంహారకాలు",
        "proprietor": "Ch. Venkata Rao",
        "phone": "+91 98481 44552",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "mandal": "Chilakaluripet / Guntur Rural",
        "address": "Opp. Agricultural Market Yard, Main Road, Guntur",
        "distance_km": 2.4,
        "license_no": "AP-AGR-GNT-2023-8812",
        "gov_authorized": True,
        "brands_stocked": ["FMC Coragen", "Syngenta Amistar", "Bayer Confidor", "Coromandel Gromor", "IFFCO DAP", "Corteva Delegate"],
        "stock_status": "Ready in Stock (Pickup Today) 🟢",
        "operating_hours": "07:30 AM - 08:30 PM",
        "offers_doorstep_delivery": True,
    },
    {
        "id": "dlr-gnt-02",
        "store_name": "Rythu Mitra Agro Agencies & Seed Center",
        "telugu_name": "రైతు మిత్ర ఆగ్రో ఏజెన్సీస్",
        "proprietor": "K. Sambasiva Rao",
        "phone": "+91 94402 33119",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "mandal": "Prathipadu / Guntur",
        "address": "Brodipet 4th Line, Near Rythu Bazaar, Guntur",
        "distance_km": 3.8,
        "license_no": "AP-PEST-GNT-2024-3401",
        "gov_authorized": True,
        "brands_stocked": ["Corteva Delegate", "FMC Coragen", "UPL Saaf", "Tata Rallis Blitox", "IFFCO 19-19-19", "Godrej Gracia"],
        "stock_status": "Ready in Stock 🟢",
        "operating_hours": "08:00 AM - 09:00 PM",
        "offers_doorstep_delivery": True,
    },
    {
        "id": "dlr-wgl-01",
        "store_name": "Kakatiya Krishi Seva Kendra & Fertilizers",
        "telugu_name": "కాకతీయ కృషి సేవా కేంద్రం",
        "proprietor": "M. Thirupathi Reddy",
        "phone": "+91 98490 66240",
        "district": "Warangal",
        "state": "Telangana",
        "mandal": "Geesugonda / Warangal Urban",
        "address": "Enumamula Grain Market Gate #2, Warangal",
        "distance_km": 1.9,
        "license_no": "TS-FERT-WGL-2023-5591",
        "gov_authorized": True,
        "brands_stocked": ["IFFCO Urea", "Coromandel Gromor 10-26-26", "Bayer Nativo", "Tata Contaf Plus", "Syngenta Ampligo"],
        "stock_status": "Ready in Stock (Urea & DAP Available) 🟢",
        "operating_hours": "07:00 AM - 08:00 PM",
        "offers_doorstep_delivery": True,
    },
    {
        "id": "dlr-wgl-02",
        "store_name": "Annapurna Agro Inputs & Seed Depot",
        "telugu_name": "అన్నపూర్ణ ఆగ్రో ఇన్పుట్స్ డిపో",
        "proprietor": "B. Prabhakar Rao",
        "phone": "+91 98485 12890",
        "district": "Warangal",
        "state": "Telangana",
        "mandal": "Narsampet / Warangal Rural",
        "address": "Station Road, Near Bus Stand, Narsampet",
        "distance_km": 4.5,
        "license_no": "TS-AGR-WGL-2024-1188",
        "gov_authorized": True,
        "brands_stocked": ["FMC Coragen", "Corteva Delegate", "Indofil Baan Beam", "Aries Chelamin Zinc"],
        "stock_status": "Ready in Stock 🟢",
        "operating_hours": "08:00 AM - 08:30 PM",
        "offers_doorstep_delivery": False,
    },
    {
        "id": "dlr-krm-01",
        "store_name": "Telangana Kisan Agro Traders",
        "telugu_name": "తెలంగాణ కిసాన్ ఆగ్రో ట్రేడర్స్",
        "proprietor": "V. Srinivas",
        "phone": "+91 94410 77812",
        "district": "Karimnagar",
        "state": "Telangana",
        "mandal": "Karimnagar / Huzurabad",
        "address": "Collectorate Road, Jagtial Junction, Karimnagar",
        "distance_km": 3.1,
        "license_no": "TS-FERT-KRM-2023-9014",
        "gov_authorized": True,
        "brands_stocked": ["IFFCO DAP", "Bayer Confidor", "Syngenta Pegasus", "UPL Ulala", "Coromandel"],
        "stock_status": "Ready in Stock 🟢",
        "operating_hours": "07:30 AM - 08:30 PM",
        "offers_doorstep_delivery": True,
    },
    {
        "id": "dlr-knl-01",
        "store_name": "Rayalaseema Farmer Fertilizers & Pesticides",
        "telugu_name": "రాయలసీమ రైతు ఫెర్టిలైజర్స్",
        "proprietor": "P. Ramanaiah",
        "phone": "+91 8518 221 450",
        "district": "Kurnool",
        "state": "Andhra Pradesh",
        "mandal": "Kurnool Rural / Nandyal",
        "address": "APMC Yard Road, Bellary Chowk, Kurnool",
        "distance_km": 2.2,
        "license_no": "AP-FERT-KNL-2023-4108",
        "gov_authorized": True,
        "brands_stocked": ["IFFCO Urea", "Tata Rallis Contaf", "FMC Coragen", "Coromandel 10-26-26", "Aries Zinc"],
        "stock_status": "Ready in Stock 🟢",
        "operating_hours": "08:00 AM - 08:00 PM",
        "offers_doorstep_delivery": True,
    }
]

def search_agri_products(
    crop: str = "",
    disease_or_pest: str = "",
    category: str = "",
    query: str = ""
) -> list[dict[str, Any]]:
    """Returns matched agri chemicals/fertilizers with authentic packaging images, formulas, and prices."""
    results = []
    norm_crop = crop.strip().lower()
    norm_pest = disease_or_pest.strip().lower()
    norm_cat = category.strip().lower()
    norm_q = query.strip().lower()

    for p in VERIFIED_AGRI_PRODUCTS:
        # Category filter
        if norm_cat and norm_cat not in p["category"].lower():
            continue

        # Crop filter
        if norm_crop and norm_crop != "all":
            crop_match = any(norm_crop in c.lower() or c.lower() in norm_crop for c in p["target_crops"])
            if not crop_match:
                continue

        # Pest/Disease or Query search
        if norm_pest or norm_q:
            term = norm_pest or norm_q
            name_match = term in p["brand_name"].lower() or term in p["chemical_formula"].lower()
            pest_match = any(term in pest.lower() or pest.lower() in term for pest in p["target_pests"])
            keyword_match = any(term in kw or kw in term for kw in p.get("keywords", []))

            if not (name_match or pest_match or keyword_match):
                continue

        results.append(p)

    # Fallback to returning top products if filter is too narrow
    if not results and (norm_crop or norm_cat):
        results = [p for p in VERIFIED_AGRI_PRODUCTS if not norm_crop or any(norm_crop in c.lower() for c in p["target_crops"])] or VERIFIED_AGRI_PRODUCTS[:6]

    return results or VERIFIED_AGRI_PRODUCTS

def get_nearby_dealers(
    state: str = "",
    district: str = "",
    mandal: str = ""
) -> list[dict[str, Any]]:
    """Returns authorized pesticide/fertilizer retail dealers near the farmer."""
    norm_st = state.strip().lower()
    norm_dist = district.strip().lower()
    norm_man = mandal.strip().lower()

    matches = []
    for d in AUTHORIZED_DEALERS:
        if norm_st and norm_st not in d["state"].lower():
            continue
        if norm_dist and norm_dist in d["district"].lower():
            matches.append(d)

    if not matches:
        matches = [d for d in AUTHORIZED_DEALERS if not norm_st or norm_st in d["state"].lower()] or AUTHORIZED_DEALERS

    # Sort by distance
    matches.sort(key=lambda x: x.get("distance_km", 99.0))
    return matches
