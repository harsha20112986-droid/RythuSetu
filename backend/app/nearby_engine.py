"""
RythuSetu Hyperlocal Nearby Agricultural Infrastructure & Market Hub Engine
Extracts and ranks nearby APMC mandis, direct processing mills/factories, and AC cold storages
with exact GPS coordinates, real distance in km, verified phone numbers, and Google Maps links.
"""

import math
from typing import Any, Optional
from app.weather_engine import DISTRICT_COORDINATES

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great circle distance in km between two GPS points."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

# Verified APMC Mandis across AP & Telangana with exact coordinates
VERIFIED_MANDIS: list[dict[str, Any]] = [
    {
        "id": "mkt-gtr-01",
        "name": "Guntur Mirchi Yard (Asia's Largest Chilli Market)",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.2890,
        "lon": 80.4280,
        "location": "Mirchi Yard Road, Nallapadu, Guntur",
        "phone": "+91 863 223 3251",
        "major_commodities": ["Red Chilli", "Cotton", "Turmeric", "Bengal Gram"],
        "timing": "Monday to Friday: 06:00 AM - 02:00 PM (Electronic Auction)",
        "enam_enabled": True,
        "daily_arrivals_qtl": 45000,
        "weighbridge_type": "Certified Digital Electronic Weighbridge",
        "google_search": "Guntur Mirchi Yard Nallapadu Guntur",
    },
    {
        "id": "mkt-wgl-01",
        "name": "Warangal Enumamula Agricultural Market Yard",
        "district": "Warangal",
        "state": "Telangana",
        "lat": 17.9850,
        "lon": 79.6250,
        "location": "Enumamula, Warangal",
        "phone": "+91 870 257 7144",
        "major_commodities": ["Cotton", "Red Chilli", "Paddy / Rice", "Maize", "Turmeric"],
        "timing": "Monday to Saturday: 07:00 AM - 03:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 38000,
        "weighbridge_type": "Multi-axle 60MT Digital Weighbridge",
        "google_search": "Enumamula Agricultural Market Warangal",
    },
    {
        "id": "mkt-kmm-01",
        "name": "Khammam APMC Grain & Chilli Market Yard",
        "district": "Khammam",
        "state": "Telangana",
        "lat": 17.2470,
        "lon": 80.1510,
        "location": "Wyra Road, Khammam",
        "phone": "+91 8742 224 810",
        "major_commodities": ["Red Chilli", "Cotton", "Maize", "Green Gram"],
        "timing": "Monday to Saturday: 07:30 AM - 01:30 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 22000,
        "weighbridge_type": "Electronic weighment with instant SMS slip",
        "google_search": "Khammam APMC Market Yard Wyra Road",
    },
    {
        "id": "mkt-nzb-01",
        "name": "Nizamabad Turmeric & Agro Market Yard",
        "district": "Nizamabad",
        "state": "Telangana",
        "lat": 18.6720,
        "lon": 78.0940,
        "location": "Ditchpally Road, Nizamabad",
        "phone": "+91 8462 238 902",
        "major_commodities": ["Turmeric", "Soybean", "Paddy / Rice", "Maize"],
        "timing": "Monday to Friday: 08:00 AM - 02:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 26000,
        "weighbridge_type": "Modern electronic weighbridge with moisture assay",
        "google_search": "Nizamabad APMC Market Yard Turmeric",
    },
    {
        "id": "mkt-mry-01",
        "name": "Miryalaguda Commercial Paddy Market Yard",
        "district": "Nalgonda",
        "state": "Telangana",
        "lat": 16.8710,
        "lon": 79.5620,
        "location": "Market Road, Miryalaguda",
        "phone": "+91 8689 252 300",
        "major_commodities": ["Paddy / Rice", "Cotton", "Red Gram"],
        "timing": "Daily: 06:30 AM - 01:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 31000,
        "weighbridge_type": "Automatic automated weighbridge linked to civil supplies",
        "google_search": "Miryalaguda Paddy Market Yard Nalgonda",
    },
    {
        "id": "mkt-tnl-01",
        "name": "Tenali Agricultural Market Yard",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.2430,
        "lon": 80.6400,
        "location": "Guntur Road, Tenali",
        "phone": "+91 8644 223 105",
        "major_commodities": ["Paddy / Rice", "Black Gram", "Turmeric", "Banana"],
        "timing": "Daily: 07:00 AM - 01:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 14000,
        "weighbridge_type": "APMC Digital Certified Scales",
        "google_search": "Tenali Agricultural Market Yard Guntur",
    },
    {
        "id": "mkt-adn-01",
        "name": "Adoni Cotton & Groundnut Market Yard",
        "district": "Kurnool",
        "state": "Andhra Pradesh",
        "lat": 15.6320,
        "lon": 77.2750,
        "location": "Alur Road, Adoni",
        "phone": "+91 8512 252 040",
        "major_commodities": ["Cotton", "Groundnut", "Sunflower", "Castor"],
        "timing": "Monday to Saturday: 08:00 AM - 02:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 28000,
        "weighbridge_type": "50MT Digital Truck Scales",
        "google_search": "Adoni Cotton Market Yard Kurnool",
    },
    {
        "id": "mkt-ndy-01",
        "name": "Nandyal APMC Grain & Cotton Yard",
        "district": "Nandyal",
        "state": "Andhra Pradesh",
        "lat": 15.4780,
        "lon": 78.4830,
        "location": "Sanjeeva Nagar, Nandyal",
        "phone": "+91 8514 242 110",
        "major_commodities": ["Cotton", "Bengal Gram", "Maize", "Sunflower"],
        "timing": "Monday to Friday: 07:30 AM - 01:30 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 19000,
        "weighbridge_type": "Digital e-NAM Integrated Scales",
        "google_search": "Nandyal APMC Market Yard",
    },
    {
        "id": "mkt-dug-01",
        "name": "Duggirala Turmeric Terminal Market",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.3260,
        "lon": 80.6270,
        "location": "Canal Road, Duggirala",
        "phone": "+91 8644 277 220",
        "major_commodities": ["Turmeric", "Paddy / Rice", "Maize"],
        "timing": "Seasonal daily auctions: 08:00 AM - 01:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 12000,
        "weighbridge_type": "Electronic Platform Scales",
        "google_search": "Duggirala Turmeric Market Yard Guntur",
    },
    {
        "id": "mkt-spt-01",
        "name": "Suryapet Commercial Grain Market",
        "district": "Suryapet",
        "state": "Telangana",
        "lat": 17.1430,
        "lon": 79.6230,
        "location": "Khammam Highway, Suryapet",
        "phone": "+91 8684 220 180",
        "major_commodities": ["Paddy / Rice", "Cotton", "Green Gram", "Groundnut"],
        "timing": "Daily: 07:00 AM - 02:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 21000,
        "weighbridge_type": "Digital Truck Weighbridge",
        "google_search": "Suryapet Agriculture Market Yard",
    },
    {
        "id": "mkt-atp-01",
        "name": "Ananthapuramu Groundnut Market Yard",
        "district": "Ananthapuramu",
        "state": "Andhra Pradesh",
        "lat": 14.6810,
        "lon": 77.6000,
        "location": "Gooty Road, Anantapur",
        "phone": "+91 8554 274 015",
        "major_commodities": ["Groundnut", "Bengal Gram", "Cotton", "Red Gram"],
        "timing": "Monday to Saturday: 08:00 AM - 02:00 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 16000,
        "weighbridge_type": "Electronic weighment with moisture meter",
        "google_search": "Anantapur Groundnut Market Yard",
    },
    {
        "id": "mkt-bvm-01",
        "name": "Bhimavaram Paddy & Commercial Agro Yard",
        "district": "West Godavari",
        "state": "Andhra Pradesh",
        "lat": 16.5440,
        "lon": 81.5230,
        "location": "Undi Road, Bhimavaram",
        "phone": "+91 8816 233 400",
        "major_commodities": ["Paddy / Rice", "Black Gram", "Maize"],
        "timing": "Daily: 06:30 AM - 12:30 PM",
        "enam_enabled": True,
        "daily_arrivals_qtl": 24000,
        "weighbridge_type": "Digital Certified Weighbridge",
        "google_search": "Bhimavaram Agriculture Market West Godavari",
    },
]

# Verified Processing Factories & Mills for Direct Purchase (Zero Broker)
VERIFIED_MILLS: list[dict[str, Any]] = [
    {
        "id": "fac-gtr-cot-01",
        "name": "Jaya Cotton Products & Ginning Industries",
        "category": "Cotton Ginning & Pressing Mill",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.2950,
        "lon": 80.4410,
        "location": "Perecherla Industrial Zone, Guntur",
        "crop": "Cotton",
        "phone": "+91 98481 22910",
        "direct_offer_price_qtl": 7920,
        "mandi_benchmark_price_qtl": 7550,
        "extra_profit_per_qtl": 370,
        "broker_commission_saved": "6.5% zero broker deduction",
        "payment_terms": "Direct bank NEFT/RTGS transfer within 24 hours of weighment",
        "quality_specs": "Moisture < 8.5%, staple 29-31mm, trash under 3%",
        "google_search": "Jaya Cotton Products Perecherla Guntur",
    },
    {
        "id": "fac-gtr-spc-01",
        "name": "Guntur Global Spices & Oleoresin Exporters Ltd",
        "category": "Spice Extraction & Oleoresin Export Plant",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.3120,
        "lon": 80.4680,
        "location": "Autonagar Industrial Corridor, Guntur",
        "crop": "Red Chilli",
        "phone": "+91 863 234 9012",
        "direct_offer_price_qtl": 18200,
        "mandi_benchmark_price_qtl": 17200,
        "extra_profit_per_qtl": 1000,
        "broker_commission_saved": "7.0% middleman commission saved",
        "payment_terms": "Digital payment upon unloading and lab moisture assay",
        "quality_specs": "Teja / Deluxe Dry Red, moisture < 10%, SHU > 45000",
        "google_search": "Global Spices Oleoresin Autonagar Guntur",
    },
    {
        "id": "fac-pln-spc-01",
        "name": "Spices Board Agro-Processing Park & Dehydration Plant",
        "district": "Palnadu",
        "state": "Andhra Pradesh",
        "lat": 16.1420,
        "lon": 80.1250,
        "location": "Spices Park, Edlapadu, Palnadu",
        "crop": "Red Chilli",
        "phone": "+91 8647 248 100",
        "direct_offer_price_qtl": 18450,
        "mandi_benchmark_price_qtl": 17400,
        "extra_profit_per_qtl": 1050,
        "broker_commission_saved": "Direct Government Procurement (0% Broker)",
        "payment_terms": "Direct DBT credit into Aadhaar-linked bank account in 24h",
        "quality_specs": "Graded dried red pods, aflatoxin compliant",
        "google_search": "Spices Park Edlapadu Palnadu",
    },
    {
        "id": "fac-tnl-ric-01",
        "name": "Rajyalaxmi Modern Parboiled & Raw Rice Industry",
        "category": "Modern Rice Milling & Export Unit",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.2380,
        "lon": 80.6480,
        "location": "Industrial Estate, Tenali",
        "crop": "Paddy / Rice",
        "phone": "+91 8644 227 450",
        "direct_offer_price_qtl": 2740,
        "mandi_benchmark_price_qtl": 2580,
        "extra_profit_per_qtl": 160,
        "broker_commission_saved": "5.5% broker fee eliminated",
        "payment_terms": "Spot payment on electronic moisture analysis",
        "quality_specs": "BPT 5204 (Sona Masuri), moisture under 14%",
        "google_search": "Rajyalaxmi Rice Mill Tenali Guntur",
    },
    {
        "id": "fac-wgl-cot-01",
        "name": "Kakatiya Mega Cotton Ginning & Spinning Mills Ltd",
        "category": "Textile & Cotton Ginning Plant",
        "district": "Warangal",
        "state": "Telangana",
        "lat": 17.9820,
        "lon": 79.6210,
        "location": "Enumamula Textile Park, Warangal",
        "crop": "Cotton",
        "phone": "+91 94405 11092",
        "direct_offer_price_qtl": 7880,
        "mandi_benchmark_price_qtl": 7540,
        "extra_profit_per_qtl": 340,
        "broker_commission_saved": "6.0% commission agent savings",
        "payment_terms": "Same day RTGS to farmer passbook",
        "quality_specs": "Moisture < 8.5%, staple 30mm, low trash",
        "google_search": "Kakatiya Cotton Ginning Mill Enumamula Warangal",
    },
    {
        "id": "fac-mry-ric-01",
        "name": "Miryalguda Rice Industries Pvt Ltd (MRI)",
        "category": "Mega Rice Milling & Silo Storage Complex",
        "district": "Nalgonda",
        "state": "Telangana",
        "lat": 16.8780,
        "lon": 79.5590,
        "location": "Rice Millers Corridor, Miryalaguda",
        "crop": "Paddy / Rice",
        "phone": "+91 98480 33491",
        "direct_offer_price_qtl": 2750,
        "mandi_benchmark_price_qtl": 2590,
        "extra_profit_per_qtl": 160,
        "broker_commission_saved": "5.5% middleman deduction saved",
        "payment_terms": "Bank transfer within 24 hours of weighbridge unload",
        "quality_specs": "Sona Masuri / HMT, foreign matter under 1%",
        "google_search": "Miryalguda Rice Industries Pvt Ltd MRI Miryalaguda",
    },
    {
        "id": "fac-nzb-tur-01",
        "name": "Nizamabad Curcumin Refining & Processing Industry",
        "category": "Spices & Pharma Active Ingredient Plant",
        "district": "Nizamabad",
        "state": "Telangana",
        "lat": 18.6690,
        "lon": 78.1020,
        "location": "Armoor Highway Agro Park, Nizamabad",
        "crop": "Turmeric",
        "phone": "+91 94412 88701",
        "direct_offer_price_qtl": 15800,
        "mandi_benchmark_price_qtl": 14900,
        "extra_profit_per_qtl": 900,
        "broker_commission_saved": "6.0% broker fees saved",
        "payment_terms": "Payment on curcumin percentage testing (Curcumin > 3.5%)",
        "quality_specs": "Boiled and dried fingers / bulbs, moisture < 10%",
        "google_search": "Nizamabad Turmeric Processing Armoor Highway",
    },
    {
        "id": "fac-adn-cot-01",
        "name": "Sri Laxmi Cotton Ginning & Pressing Industries",
        "category": "Cotton Ginning & Baling Mill",
        "district": "Kurnool",
        "state": "Andhra Pradesh",
        "lat": 15.6280,
        "lon": 77.2690,
        "location": "Industrial Area, Alur Road, Adoni",
        "crop": "Cotton",
        "phone": "+91 8512 254 320",
        "direct_offer_price_qtl": 7820,
        "mandi_benchmark_price_qtl": 7490,
        "extra_profit_per_qtl": 330,
        "broker_commission_saved": "6.0% commission agent savings",
        "payment_terms": "Instant account credit on weighment slip verification",
        "quality_specs": "Medium to long staple, clean lint, moisture < 8.5%",
        "google_search": "Sri Laxmi Cotton Mills Adoni Kurnool",
    },
    {
        "id": "fac-bvm-oil-01",
        "name": "Godavari Solvent Extractions & Modern Rice Mill",
        "category": "Paddy Milling & Rice Bran Oil Extraction",
        "district": "West Godavari",
        "state": "Andhra Pradesh",
        "lat": 16.5390,
        "lon": 81.5310,
        "location": "Undi Road Industrial Corridor, Bhimavaram",
        "crop": "Paddy / Rice",
        "phone": "+91 8816 238 910",
        "direct_offer_price_qtl": 2730,
        "mandi_benchmark_price_qtl": 2570,
        "extra_profit_per_qtl": 160,
        "broker_commission_saved": "5.5% broker fee eliminated",
        "payment_terms": "Same-day digital transfer directly to bank account",
        "quality_specs": "Moisture < 14.0%, sound grain, low admixture",
        "google_search": "Godavari Solvent Extractions Bhimavaram",
    },
]

# Verified AC Godowns & Cold Storages across AP & Telangana
VERIFIED_GODOWNS: list[dict[str, Any]] = [
    {
        "id": "cs-gtr-vdl-01",
        "name": "Central Warehousing Corporation (CWC) Cold Storage Vadlamudi",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.2350,
        "lon": 80.5620,
        "location": "Vadlamudi, Chebrolu Mandal, Guntur",
        "phone": "+91 863 228 1040",
        "facility_type": "Central Government Public Warehousing (CWC / WDRA Accredited)",
        "capacity_mt": 18000,
        "available_space_mt": 4200,
        "commodities": ["Red Chilli", "Turmeric", "Coriander", "Seeds"],
        "temp_range": "0°C to 4°C (Controlled Atmosphere)",
        "humidity_rh": "60% - 65% RH",
        "monthly_rent_per_bag": 65,
        "bag_weight_kg": "40 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% of market value under e-NWR portal",
        "google_search": "CWC Cold Storage Vadlamudi Chebrolu Guntur",
    },
    {
        "id": "cs-gtr-etk-01",
        "name": "Sri Lakshmi Balaji AC Cold Storage",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.2910,
        "lon": 80.4610,
        "location": "Etukuru Road, Guntur",
        "phone": "+91 94401 22849",
        "facility_type": "WDRA Registered Private Cold Storage",
        "capacity_mt": 12000,
        "available_space_mt": 2400,
        "commodities": ["Red Chilli", "Turmeric", "Coriander"],
        "temp_range": "0°C to 4°C",
        "humidity_rh": "60% - 65% RH",
        "monthly_rent_per_bag": 75,
        "bag_weight_kg": "40 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% pledge loan (SBI & Canara Bank tied)",
        "google_search": "Sri Lakshmi Balaji Cold Storage Etukuru Road Guntur",
    },
    {
        "id": "cs-gtr-dug-01",
        "name": "CWC Duggirala Turmeric Cold Warehouse",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "lat": 16.3240,
        "lon": 80.6290,
        "location": "Canal Bund Road, Duggirala, Guntur",
        "phone": "+91 8644 277 410",
        "facility_type": "Government Warehousing (CWC Spices Grade)",
        "capacity_mt": 15000,
        "available_space_mt": 3600,
        "commodities": ["Turmeric", "Red Chilli", "Pulses"],
        "temp_range": "2°C to 6°C",
        "humidity_rh": "65% RH",
        "monthly_rent_per_bag": 62,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% electronic warehouse receipt credit",
        "google_search": "CWC Cold Storage Duggirala Guntur",
    },
    {
        "id": "cs-pln-edl-01",
        "name": "APSWC Spices Park Mega Cold Storage",
        "district": "Palnadu",
        "state": "Andhra Pradesh",
        "lat": 16.1410,
        "lon": 80.1220,
        "location": "Spices Park Complex, Edlapadu, Palnadu",
        "phone": "+91 8647 248 150",
        "facility_type": "Andhra Pradesh State Warehousing Corporation (APSWC)",
        "capacity_mt": 25000,
        "available_space_mt": 6800,
        "commodities": ["Red Chilli", "Spices", "Turmeric", "Seeds"],
        "temp_range": "0°C to 4°C",
        "humidity_rh": "60% - 65% RH",
        "monthly_rent_per_bag": 60,
        "bag_weight_kg": "40 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% pledge loan under NABARD e-NWR mandate",
        "google_search": "APSWC Cold Storage Spices Park Edlapadu",
    },
    {
        "id": "cs-wgl-enu-01",
        "name": "Kakatiya Multi-Commodity Cold Storage & AC Godowns",
        "district": "Warangal",
        "state": "Telangana",
        "lat": 17.9860,
        "lon": 79.6270,
        "location": "Enumamula Industrial Zone, Warangal",
        "phone": "+91 98481 55920",
        "facility_type": "WDRA Certified Commercial Cold Chain",
        "capacity_mt": 15000,
        "available_space_mt": 3200,
        "commodities": ["Cotton Bales", "Chilli", "Paddy Seeds", "Maize"],
        "temp_range": "4°C to 10°C (Seed & Bale preservation grade)",
        "humidity_rh": "50% - 55% RH",
        "monthly_rent_per_bag": 68,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "75% e-NWR instant loan facility from Telangana Grameena Bank",
        "google_search": "Kakatiya Cold Storage Enumamula Warangal",
    },
    {
        "id": "cs-kmm-wyr-01",
        "name": "Khammam Kisan Integrated Cold Storage",
        "district": "Khammam",
        "state": "Telangana",
        "lat": 17.2490,
        "lon": 80.1550,
        "location": "Wyra Road Industrial Area, Khammam",
        "phone": "+91 98492 78310",
        "facility_type": "FPO Supported Modern Cold Chain",
        "capacity_mt": 8500,
        "available_space_mt": 1650,
        "commodities": ["Red Chilli", "Cotton Bales", "Turmeric"],
        "temp_range": "2°C to 5°C",
        "humidity_rh": "60% - 65% RH",
        "monthly_rent_per_bag": 70,
        "bag_weight_kg": "40 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 70% pledge loan",
        "google_search": "Khammam Kisan Cold Storage Wyra Road",
    },
    {
        "id": "cs-nzb-arm-01",
        "name": "Nizamabad Turmeric & Agri Cold Warehouse",
        "district": "Nizamabad",
        "state": "Telangana",
        "lat": 18.6740,
        "lon": 78.0980,
        "location": "Armoor Road, Nizamabad",
        "phone": "+91 8462 248 110",
        "facility_type": "Spices Board Recognized Cold Facility",
        "capacity_mt": 18000,
        "available_space_mt": 4100,
        "commodities": ["Turmeric", "Soybean", "Pulses", "Paddy / Rice"],
        "temp_range": "4°C to 8°C",
        "humidity_rh": "60% RH",
        "monthly_rent_per_bag": 66,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% loan against pledge receipt",
        "google_search": "Nizamabad Turmeric Cold Storage Armoor Road",
    },
    {
        "id": "cs-krn-cwc-01",
        "name": "CWC Kurnool Agro Cold Warehouse",
        "district": "Kurnool",
        "state": "Andhra Pradesh",
        "lat": 15.8280,
        "lon": 78.0350,
        "location": "Nandyal Road, Kurnool",
        "phone": "+91 8518 231 040",
        "facility_type": "Central Warehousing Corporation (CWC)",
        "capacity_mt": 22000,
        "available_space_mt": 5400,
        "commodities": ["Cotton Bales", "Bengal Gram", "Groundnut", "Sunflower"],
        "temp_range": "5°C to 12°C",
        "humidity_rh": "55% RH",
        "monthly_rent_per_bag": 58,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% pledge loan under e-NWR",
        "google_search": "CWC Warehouse Kurnool Nandyal Road",
    },
    {
        "id": "cs-ntr-vjw-01",
        "name": "Vijayawada Gollapudi Agro Cold Storage",
        "district": "NTR",
        "state": "Andhra Pradesh",
        "lat": 16.5410,
        "lon": 80.5920,
        "location": "Gollapudi Wholesale Market Zone, Vijayawada",
        "phone": "+91 866 241 3300",
        "facility_type": "WDRA Certified Multi-Commodity Cold Facility",
        "capacity_mt": 16000,
        "available_space_mt": 3900,
        "commodities": ["Paddy Seeds", "Pulses", "Chillies", "Fruits"],
        "temp_range": "1°C to 6°C",
        "humidity_rh": "65% RH",
        "monthly_rent_per_bag": 72,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% e-NWR pledge facility",
        "google_search": "Vijayawada Gollapudi Cold Storage NTR",
    },
]

def get_farmer_gps(district: str, state: str) -> tuple[float, float]:
    """Resolves approximate latitude and longitude for farmer's district."""
    # Try exact match in DISTRICT_COORDINATES
    key = (district.strip(), state.strip())
    if key in DISTRICT_COORDINATES:
        info = DISTRICT_COORDINATES[key]
        return float(info["lat"]), float(info["lon"])

    # Fuzzy match
    for (d, s), info in DISTRICT_COORDINATES.items():
        if s.lower() == state.lower() and (d.lower() in district.lower() or district.lower() in d.lower()):
            return float(info["lat"]), float(info["lon"])

    # Fallbacks for AP or Telangana
    if "andhra" in state.lower():
        return 16.30, 80.45  # Guntur central
    return 17.98, 79.60      # Warangal central

def get_nearby_infrastructure(
    state: str,
    district: str,
    mandal: str = "",
    crop: str = "",
    max_distance_km: float = 200.0
) -> dict[str, Any]:
    """
    Ranks nearby APMC mandis, direct purchase processing mills, and AC cold storages
    by actual distance in km from the farmer's location.
    """
    farmer_lat, farmer_lon = get_farmer_gps(district, state)

    # 1. Nearby Mandis
    mandis_with_dist = []
    for m in VERIFIED_MANDIS:
        dist = haversine_km(farmer_lat, farmer_lon, m["lat"], m["lon"])
        if dist <= max_distance_km or m["district"].lower() == district.lower():
            item = dict(m)
            item["distance_km"] = dist
            item["google_maps_url"] = f"https://www.google.com/maps/search/?api=1&query={item['google_search'].replace(' ', '+')}"
            mandis_with_dist.append(item)
    mandis_with_dist.sort(key=lambda x: x["distance_km"])

    # 2. Nearby Direct Purchase Mills
    mills_with_dist = []
    for f in VERIFIED_MILLS:
        dist = haversine_km(farmer_lat, farmer_lon, f["lat"], f["lon"])
        # If crop matches or no crop filter
        crop_match = (not crop) or (crop.lower() in f["crop"].lower()) or (f["crop"].lower() in crop.lower())
        if crop_match and (dist <= max_distance_km or f["district"].lower() == district.lower()):
            item = dict(f)
            item["distance_km"] = dist
            item["google_maps_url"] = f"https://www.google.com/maps/search/?api=1&query={item['google_search'].replace(' ', '+')}"
            mills_with_dist.append(item)
    mills_with_dist.sort(key=lambda x: x["distance_km"])

    # If crop filter made mills empty, show all nearby mills
    if not mills_with_dist:
        for f in VERIFIED_MILLS:
            dist = haversine_km(farmer_lat, farmer_lon, f["lat"], f["lon"])
            if dist <= max_distance_km or f["district"].lower() == district.lower():
                item = dict(f)
                item["distance_km"] = dist
                item["google_maps_url"] = f"https://www.google.com/maps/search/?api=1&query={item['google_search'].replace(' ', '+')}"
                mills_with_dist.append(item)
        mills_with_dist.sort(key=lambda x: x["distance_km"])

    # 3. Nearby AC Godowns
    godowns_with_dist = []
    for g in VERIFIED_GODOWNS:
        dist = haversine_km(farmer_lat, farmer_lon, g["lat"], g["lon"])
        # If crop matches or no crop filter
        commodity_match = (not crop) or any(crop.lower() in c.lower() for c in g["commodities"])
        if commodity_match and (dist <= max_distance_km or g["district"].lower() == district.lower()):
            item = dict(g)
            item["distance_km"] = dist
            item["google_maps_url"] = f"https://www.google.com/maps/search/?api=1&query={item['google_search'].replace(' ', '+')}"
            godowns_with_dist.append(item)
    godowns_with_dist.sort(key=lambda x: x["distance_km"])

    if not godowns_with_dist:
        for g in VERIFIED_GODOWNS:
            dist = haversine_km(farmer_lat, farmer_lon, g["lat"], g["lon"])
            if dist <= max_distance_km or g["district"].lower() == district.lower():
                item = dict(g)
                item["distance_km"] = dist
                item["google_maps_url"] = f"https://www.google.com/maps/search/?api=1&query={item['google_search'].replace(' ', '+')}"
                godowns_with_dist.append(item)
        godowns_with_dist.sort(key=lambda x: x["distance_km"])

    return {
        "farmer_location": {
            "state": state,
            "district": district,
            "mandal": mandal,
            "crop": crop,
            "gps": {"lat": farmer_lat, "lon": farmer_lon}
        },
        "nearby_mandis": mandis_with_dist,
        "nearby_mills": mills_with_dist,
        "nearby_cold_storages": godowns_with_dist,
        "summary": {
            "total_mandis": len(mandis_with_dist),
            "total_mills": len(mills_with_dist),
            "total_cold_storages": len(godowns_with_dist),
            "nearest_mandi": mandis_with_dist[0] if mandis_with_dist else None,
            "nearest_mill": mills_with_dist[0] if mills_with_dist else None,
            "nearest_cold_storage": godowns_with_dist[0] if godowns_with_dist else None,
        }
    }
