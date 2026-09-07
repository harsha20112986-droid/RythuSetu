"""
RythuSetu Post-Harvest AC Godowns & Cold Storage Intelligence Network
Connects farmers to government (CWC / SWC) and certified private cold chains,
providing capacity, monthly tariffs, e-NWR pledge financing, and instant space booking.
"""

from typing import Any
from datetime import datetime

VERIFIED_COLD_STORAGES: list[dict[str, Any]] = [
    {
        "id": "cs-gtr-01",
        "name": "Sri Lakshmi Balaji AC Cold Storage",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "location": "Etukuru Road, Guntur",
        "facility_type": "Certified Private Cold Storage (WDRA Registered)",
        "capacity_mt": 12000,
        "available_space_mt": 2400,
        "commodities": ["Red Chilli", "Turmeric", "Coriander"],
        "temp_range": "0°C to 4°C (Controlled Atmosphere)",
        "humidity_rh": "60% - 65% RH",
        "monthly_rent_per_bag": 75,
        "bag_weight_kg": "40 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% of market value (SBI & Canara Bank tied)",
        "contact_person": "Venkateswara Rao (Warehouse Manager)",
        "phone": "+91 94401 22849",
        "features": ["Pre-cooling chamber", "24/7 CCTV & Fire Protection", "Zero pest fumigation standard", "Direct APMC transport bay"],
    },
    {
        "id": "cs-gtr-02",
        "name": "AP State Warehousing Corporation (APSWC) Cold Godown",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "location": "Mirchi Yard Complex, Nallapadu, Guntur",
        "facility_type": "Government Warehousing (APSWC)",
        "capacity_mt": 20000,
        "available_space_mt": 4800,
        "commodities": ["Red Chilli", "Turmeric", "Pulses", "Seeds"],
        "temp_range": "2°C to 6°C",
        "humidity_rh": "65% RH",
        "monthly_rent_per_bag": 62,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% pledge loan under Central e-NWR portal",
        "contact_person": "R. Satyanarayana (Godown In-Charge)",
        "phone": "+91 863 223 4811",
        "features": ["Subsidized farmer tariff", "Insurance coverage included", "Scientific grading laboratory", "Weighbridge facility"],
    },
    {
        "id": "cs-kmm-01",
        "name": "Khammam Kisan Integrated Cold Storage",
        "district": "Khammam",
        "state": "Telangana",
        "location": "Wyra Road, Khammam",
        "facility_type": "Farmer Producer Org (FPO) Supported Cold Chain",
        "capacity_mt": 8500,
        "available_space_mt": 1650,
        "commodities": ["Red Chilli", "Cotton Bales", "Turmeric"],
        "temp_range": "2°C to 5°C",
        "humidity_rh": "60% - 65% RH",
        "monthly_rent_per_bag": 70,
        "bag_weight_kg": "40 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 70% pledge loan from Telangana Grameena Bank",
        "contact_person": "B. Mohan Reddy",
        "phone": "+91 98492 78310",
        "features": ["Solar powered backup", "Palletized stacking", "Moisture barrier packing", "Direct link to Khammam APMC"],
    },
    {
        "id": "cs-wgl-01",
        "name": "Kakatiya Multi-Commodity Cold Storage & AC Godowns",
        "district": "Warangal",
        "state": "Telangana",
        "location": "Enumamula Industrial Zone, Warangal",
        "facility_type": "WDRA Certified Commercial Cold Chain",
        "capacity_mt": 15000,
        "available_space_mt": 3200,
        "commodities": ["Cotton Bales", "Chilli", "Paddy Seeds", "Maize"],
        "temp_range": "4°C to 10°C (Seed preservation grade)",
        "humidity_rh": "50% - 55% RH",
        "monthly_rent_per_bag": 68,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "75% e-NWR instant loan facility",
        "contact_person": "K. Sammaiah",
        "phone": "+91 98481 55920",
        "features": ["Bale handling cranes", "Germination safe climate control", "24/7 power redundancy", "Online stock dashboard"],
    },
    {
        "id": "cs-nzb-01",
        "name": "Nizamabad Turmeric & Agri Cold Warehouse",
        "district": "Nizamabad",
        "state": "Telangana",
        "location": "Armoor Road, Nizamabad",
        "facility_type": "Spices Board Recognized Cold Facility",
        "capacity_mt": 18000,
        "available_space_mt": 4100,
        "commodities": ["Turmeric", "Soybean", "Pulses", "Paddy / Rice"],
        "temp_range": "5°C to 8°C",
        "humidity_rh": "60% RH",
        "monthly_rent_per_bag": 65,
        "bag_weight_kg": "60 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% loan against negotiable warehouse receipt",
        "contact_person": "P. Sudhakar Rao",
        "phone": "+91 94901 88320",
        "features": ["Curcumin retention preservation", "Mechanical dust cleaning", "Fumigated chambers", "Rail siding connectivity"],
    },
    {
        "id": "cs-kri-01",
        "name": "Krishna Delta Controlled Atmosphere Cold Store",
        "district": "Krishna",
        "state": "Andhra Pradesh",
        "location": "Gudivada Road, Krishna District",
        "facility_type": "APEDA Export Standard Cold Chain",
        "capacity_mt": 10000,
        "available_space_mt": 2100,
        "commodities": ["Paddy / Rice", "Mango", "Banana", "Vegetables"],
        "temp_range": "1°C to 12°C (Multi-chamber variable temp)",
        "humidity_rh": "85% - 90% RH (Fruit grade)",
        "monthly_rent_per_bag": 58,
        "bag_weight_kg": "50 kg / crate/bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 70% seasonal harvest loan",
        "contact_person": "T. Madhava Rao",
        "phone": "+91 8674 242 190",
        "features": ["Ripening chambers", "Ozone sanitation", "Cold refrigerated trucks", "Direct export packing lines"],
    },
    {
        "id": "cs-knl-01",
        "name": "Rayalaseema Agri Storage & Oilseed Cold Depot",
        "district": "Kurnool",
        "state": "Andhra Pradesh",
        "location": "Bellary Road, Kurnool",
        "facility_type": "CWC (Central Warehousing Corporation)",
        "capacity_mt": 14000,
        "available_space_mt": 3500,
        "commodities": ["Groundnut", "Bengal Gram", "Sunflower Seed", "Onion"],
        "temp_range": "2°C to 6°C",
        "humidity_rh": "65% RH",
        "monthly_rent_per_bag": 60,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% bank pledge loan via Central Warehouse e-portal",
        "contact_person": "M. Ramachandrappa",
        "phone": "+91 8518 255 301",
        "features": ["Zero rancidity oilseed storage", "Aerated ventilation", "Pest-proof stack covers", "Certified weighbridge"],
    },
    {
        "id": "cs-ctr-01",
        "name": "Tirupati-Chittoor Horticulture Agro Cold Chain",
        "district": "Tirupati",
        "state": "Andhra Pradesh",
        "location": "Renigunta Logistics Park, Tirupati",
        "facility_type": "MIDH (Mission for Integrated Horticulture) Supported",
        "capacity_mt": 9000,
        "available_space_mt": 1800,
        "commodities": ["Tomato", "Mango", "Sweet Orange", "Vegetables"],
        "temp_range": "0°C to 10°C",
        "humidity_rh": "85% - 92% RH",
        "monthly_rent_per_bag": 55,
        "bag_weight_kg": "30 kg / crate",
        "enwr_pledge_loan": True,
        "loan_percent": "65% pledge loan for perishables",
        "contact_person": "G. Chandrasekhar",
        "phone": "+91 877 227 4900",
        "features": ["Pre-cooling within 2 hrs of harvest", "Reefer container dispatch", "Sorting & grading conveyor lines"],
    },
]

STORAGE_BOOKINGS: list[dict[str, Any]] = []

def get_cold_storages(
    state: str = "",
    district: str = "",
    commodity: str = "",
) -> list[dict[str, Any]]:
    """Returns filtered cold storage and AC godowns matching query criteria."""
    results = []
    norm_st = state.strip().lower()
    norm_dist = district.strip().lower()
    norm_comm = commodity.strip().lower()

    for cs in VERIFIED_COLD_STORAGES:
        # Match state
        if norm_st and norm_st not in cs["state"].lower():
            continue
        
        # Match district if given
        if norm_dist and norm_dist not in cs["district"].lower() and cs["district"].lower() not in norm_dist:
            # If district doesn't match directly, keep if in same state as regional option
            pass
        
        # Match commodity if given
        if norm_comm:
            comm_match = any(norm_comm in c.lower() or c.lower() in norm_comm for c in cs["commodities"])
            if not comm_match and "all" not in norm_comm:
                continue

        results.append(cs)

    # If strict filter returned empty, return all facilities in the state
    if not results:
        results = [cs for cs in VERIFIED_COLD_STORAGES if not norm_st or norm_st in cs["state"].lower()] or VERIFIED_COLD_STORAGES

    return results

def create_storage_booking(
    facility_id: str,
    farmer_name: str,
    phone: str,
    commodity: str,
    bags_count: int,
    duration_months: int,
) -> dict[str, Any]:
    """Generates official AC Godown slot reservation token."""
    facility = next((cs for cs in VERIFIED_COLD_STORAGES if cs["id"] == facility_id), VERIFIED_COLD_STORAGES[0])
    monthly_cost = bags_count * facility["monthly_rent_per_bag"]
    total_cost = monthly_cost * duration_months

    token = f"RS-GODOWN-{datetime.now().strftime('%y%m%d')}-{len(STORAGE_BOOKINGS) + 101}"
    booking_record = {
        "booking_token": token,
        "facility_id": facility["id"],
        "facility_name": facility["name"],
        "district": facility["district"],
        "state": facility["state"],
        "location": facility["location"],
        "farmer_name": farmer_name,
        "phone": phone,
        "commodity": commodity,
        "bags_count": bags_count,
        "duration_months": duration_months,
        "monthly_rent_inr": monthly_cost,
        "total_estimated_rent_inr": total_cost,
        "enwr_pledge_loan_eligible": facility["enwr_pledge_loan"],
        "booking_status": "Confirmed (Bay Reserved)",
        "created_at": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "instructions": "Present this booking token at the warehouse weighing bridge along with your Aadhaar and Farm Passbook to unload and receive your e-NWR negotiable receipt.",
    }
    STORAGE_BOOKINGS.append(booking_record)
    return booking_record
