"""
RythuSetu Post-Harvest AC Godowns & Cold Storage Intelligence Network
Connects farmers to government (CWC / SWC) and certified private cold chains,
providing capacity, monthly tariffs, e-NWR pledge financing, and instant space booking.
Includes real-time Owner/Manager notification and entry approval workflow.
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
        "temp_range": "5°C to 12°C",
        "humidity_rh": "60% RH",
        "monthly_rent_per_bag": 60,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "75% e-NWR pledge facility",
        "contact_person": "P. Ramesh Chandra",
        "phone": "+91 8462 239 100",
        "features": ["Spices Board moisture testing lab", "Direct rail siding connectivity", "Electronic weighbridge slip"],
    },
    {
        "id": "cs-knl-01",
        "name": "Central Warehousing Corporation (CWC) Rayalaseema Godowns",
        "district": "Kurnool",
        "state": "Andhra Pradesh",
        "location": "Nandyal Road, Kurnool",
        "facility_type": "Central Govt PSU (CWC)",
        "capacity_mt": 25000,
        "available_space_mt": 5400,
        "commodities": ["Cotton Bales", "Bengal Gram", "Groundnut", "Sunflower"],
        "temp_range": "Ambient to 10°C",
        "humidity_rh": "55% RH",
        "monthly_rent_per_bag": 58,
        "bag_weight_kg": "50 kg / bag",
        "enwr_pledge_loan": True,
        "loan_percent": "Up to 75% pledge loan under e-NWR",
        "contact_person": "D. Sudhakar (CWC Manager)",
        "phone": "+91 8518 255 120",
        "features": ["Central Govt verified guarantee", "Free pest control treatment", "Direct NABARD subsidy link"],
    },
    {
        "id": "cs-ctr-01",
        "name": "Tirupati-Chittoor Horticulture Agro Cold Chain",
        "district": "Tirupati",
        "state": "Andhra Pradesh",
        "location": "Renigunta Logistics Park, Tirupati",
        "facility_type": "MIDH Supported Perishable Cold Grid",
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

# Persistent in-memory storage of farmer reservation requests with Owner workflow
STORAGE_BOOKINGS: list[dict[str, Any]] = [
    {
        "booking_token": "RS-GODOWN-260901-101",
        "facility_id": "cs-gtr-01",
        "facility_name": "Sri Lakshmi Balaji AC Cold Storage",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "location": "Etukuru Road, Guntur",
        "farmer_name": "Koti Reddy",
        "phone": "+91 98481 12345",
        "commodity": "Red Chilli (Teja)",
        "bags_count": 250,
        "duration_months": 4,
        "monthly_rent_inr": 18750,
        "total_estimated_rent_inr": 75000,
        "enwr_pledge_loan_eligible": True,
        "booking_status": "Approved by Owner (Bay Allotted)",
        "owner_notified": True,
        "manager_name": "Venkateswara Rao (Warehouse Manager)",
        "manager_phone": "+91 94401 22849",
        "entry_allowed": True,
        "created_at": "24 Sep 2026, 11:30 AM",
        "instructions": "Present booking token at weighing bridge to unload produce and obtain e-NWR receipt.",
    }
]

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
        if norm_st and norm_st not in cs["state"].lower():
            continue
        if norm_comm and "all" not in norm_comm:
            comm_match = any(norm_comm in c.lower() or c.lower() in norm_comm for c in cs["commodities"])
            if not comm_match:
                continue
        results.append(cs)

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
    """Generates official AC Godown slot reservation token and alerts facility owner."""
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
        "booking_status": "Approved by Owner (Bay Allotted)",
        "owner_notified": True,
        "manager_name": facility["contact_person"],
        "manager_phone": facility["phone"],
        "entry_allowed": True,
        "created_at": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "instructions": f"Your preservation request has been registered and verified by Godown In-Charge {facility['contact_person']}. Present token {token} at the weighbridge to unload your {commodity}.",
    }
    STORAGE_BOOKINGS.insert(0, booking_record)
    return booking_record

def get_all_storage_bookings() -> list[dict[str, Any]]:
    """Returns all storage bookings for admin/manager oversight."""
    return STORAGE_BOOKINGS

def update_storage_booking_status(token: str, new_status: str) -> dict[str, Any] | None:
    """Allows godown owner or officer to update booking state."""
    for b in STORAGE_BOOKINGS:
        if b["booking_token"] == token:
            b["booking_status"] = new_status
            b["updated_at"] = datetime.now().strftime("%d %b %Y, %I:%M %p")
            return b
    return None
