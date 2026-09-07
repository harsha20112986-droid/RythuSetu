"""
RythuSetu Direct Farm-to-Factory Zero-Broker Linkage Engine
Enables farmers to bypass mandi commission agents and sell harvested crops
directly to verified processing factories, ginning mills, rice mills, and exporters.
"""

from typing import Any
from datetime import datetime

VERIFIED_FACTORIES_DATA: list[dict[str, Any]] = [
    {
        "id": "fac-cot-01",
        "factory_name": "Kakatiya Mega Cotton Ginning & Spinning Mills Ltd",
        "category": "Textile & Ginning Industry",
        "district": "Warangal",
        "state": "Telangana",
        "location": "Enumamula Textile Park, Warangal",
        "crop": "Cotton",
        "direct_offer_price_qtl": 7860,
        "mandi_benchmark_price_qtl": 7540,
        "broker_commission_saved_percent": 6.5,
        "extra_profit_per_qtl": 320,
        "total_demand_qtl": 8500,
        "procured_so_far_qtl": 3200,
        "quality_specs": {
            "moisture_max": "Below 8.5%",
            "staple_length": "29mm to 31mm (Long Staple Bunny/Brahma)",
            "trash_content_max": "Under 3.0%",
            "min_lot_size_qtl": 10,
        },
        "payment_terms": "Same-day RTGS / NEFT transfer directly to farmer bank account upon weighment.",
        "procurement_officer": "Srikanth Reddy (Procurement GM)",
        "phone": "+91 94405 11092",
        "verified_license": "TS-GIN-2024-8841",
    },
    {
        "id": "fac-ric-01",
        "factory_name": "Miryalaguda Modern Mega Rice Industry",
        "category": "Paddy Milling & Parboiled Industry",
        "district": "Nalgonda",
        "state": "Telangana",
        "location": "Industrial Corridor, Miryalaguda",
        "crop": "Paddy / Rice",
        "direct_offer_price_qtl": 2720,
        "mandi_benchmark_price_qtl": 2580,
        "broker_commission_saved_percent": 5.5,
        "extra_profit_per_qtl": 140,
        "total_demand_qtl": 25000,
        "procured_so_far_qtl": 11400,
        "quality_specs": {
            "moisture_max": "Below 14.0% (Clean dry grain)",
            "staple_length": "BPT 5204 (Sona Masuri) / HMT Superfine",
            "trash_content_max": "Under 1.0% foreign matter",
            "min_lot_size_qtl": 25,
        },
        "payment_terms": "Instant payment receipt; bank transfer within 24 hours.",
        "procurement_officer": "V. Koti Reddy (Mill Director)",
        "phone": "+91 98480 33491",
        "verified_license": "TS-RIC-2023-1102",
    },
    {
        "id": "fac-chl-01",
        "factory_name": "Guntur Global Spices & Oleoresin Exporters Ltd",
        "category": "Spice Extraction & Global Export Unit",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "location": "Autonagar Industrial Area, Guntur",
        "crop": "Red Chilli",
        "direct_offer_price_qtl": 17800,
        "mandi_benchmark_price_qtl": 16800,
        "broker_commission_saved_percent": 7.0,
        "extra_profit_per_qtl": 1000,
        "total_demand_qtl": 6000,
        "procured_so_far_qtl": 2100,
        "quality_specs": {
            "moisture_max": "Below 10.0%",
            "staple_length": "Teja / Deluxe Dry Red (SHU > 45,000)",
            "trash_content_max": "No stem discoloration, zero aflatoxin",
            "min_lot_size_qtl": 5,
        },
        "payment_terms": "Digital payment directly on unloading and laboratory moisture assay.",
        "procurement_officer": "K. Srinivasulu (Head of Agricultural Sourcing)",
        "phone": "+91 863 234 9012",
        "verified_license": "AP-SPICE-2022-7719",
    },
    {
        "id": "fac-tur-01",
        "factory_name": "Nizamabad Curcumin Refining & Processing Industry",
        "category": "Pharma & Spice Oleoresin",
        "district": "Nizamabad",
        "state": "Telangana",
        "location": "Armoor Highway Agro Park, Nizamabad",
        "crop": "Turmeric",
        "direct_offer_price_qtl": 15600,
        "mandi_benchmark_price_qtl": 14800,
        "broker_commission_saved_percent": 6.0,
        "extra_profit_per_qtl": 800,
        "total_demand_qtl": 4500,
        "procured_so_far_qtl": 1800,
        "quality_specs": {
            "moisture_max": "Below 9.0%",
            "staple_length": "Finger Turmeric (Curcumin content > 3.2%)",
            "trash_content_max": "Polished, mud-free rhizomes",
            "min_lot_size_qtl": 8,
        },
        "payment_terms": "Instant weighbridge receipt; DBT direct credit within 12 hours.",
        "procurement_officer": "B. Anji Reddy",
        "phone": "+91 94901 77312",
        "verified_license": "TS-SPICE-2024-9043",
    },
    {
        "id": "fac-gnt-01",
        "factory_name": "Kurnool Premium Edible Oils & Expellers Complex",
        "category": "Edible Oil Refining",
        "district": "Kurnool",
        "state": "Andhra Pradesh",
        "location": "Dhone Road Industrial Estate, Kurnool",
        "crop": "Groundnut",
        "direct_offer_price_qtl": 7550,
        "mandi_benchmark_price_qtl": 7150,
        "broker_commission_saved_percent": 5.8,
        "extra_profit_per_qtl": 400,
        "total_demand_qtl": 12000,
        "procured_so_far_qtl": 4800,
        "quality_specs": {
            "moisture_max": "Below 7.0%",
            "staple_length": "Kadir 6 / Bold Pods (Oil recovery > 48%)",
            "trash_content_max": "Under 2.0% empty shells",
            "min_lot_size_qtl": 10,
        },
        "payment_terms": "Spot bank transfer upon quality check.",
        "procurement_officer": "G. Mallikarjuna",
        "phone": "+91 8518 241 890",
        "verified_license": "AP-OIL-2023-4518",
    },
    {
        "id": "fac-mze-01",
        "factory_name": "Telangana Feeds & Starch Industries Corp",
        "category": "Animal Feed & Starch Manufacturing",
        "district": "Karimnagar",
        "state": "Telangana",
        "location": "Peddapalli Industrial Zone, Karimnagar",
        "crop": "Maize",
        "direct_offer_price_qtl": 2420,
        "mandi_benchmark_price_qtl": 2290,
        "broker_commission_saved_percent": 5.0,
        "extra_profit_per_qtl": 130,
        "total_demand_qtl": 30000,
        "procured_so_far_qtl": 14200,
        "quality_specs": {
            "moisture_max": "Below 13.5%",
            "staple_length": "Yellow Hybrid Grain",
            "trash_content_max": "Under 1.5% broken grains",
            "min_lot_size_qtl": 20,
        },
        "payment_terms": "Zero deduction for brokerage; NEFT direct transfer same evening.",
        "procurement_officer": "S. Rajeshwar",
        "phone": "+91 98485 66720",
        "verified_license": "TS-FEED-2023-3391",
    },
    {
        "id": "fac-pul-01",
        "factory_name": "Tandur Dal Millers Consortium & Processing Plant",
        "category": "Pulses Processing & Packaging",
        "district": "Vikarabad",
        "state": "Telangana",
        "location": "Tandur Industrial Hub, Vikarabad",
        "crop": "Pigeon Pea / Red Gram (Tur)",
        "direct_offer_price_qtl": 8550,
        "mandi_benchmark_price_qtl": 8100,
        "broker_commission_saved_percent": 6.2,
        "extra_profit_per_qtl": 450,
        "total_demand_qtl": 5000,
        "procured_so_far_qtl": 1900,
        "quality_specs": {
            "moisture_max": "Below 10.0%",
            "staple_length": "Tandur GI Tagged Red Gram (Uniform bold seed)",
            "trash_content_max": "Under 1.0% foreign debris",
            "min_lot_size_qtl": 5,
        },
        "payment_terms": "Spot payment via UPI / Bank account directly to farmer.",
        "procurement_officer": "Md. Ismail",
        "phone": "+91 8411 224 509",
        "verified_license": "TS-PULSE-2024-1194",
    },
]

DIRECT_DELIVERY_PASSES: list[dict[str, Any]] = []

def get_factory_contracts(
    state: str = "",
    district: str = "",
    crop: str = "",
) -> list[dict[str, Any]]:
    """Returns factory procurement tenders with extra profit comparison against Mandi."""
    results = []
    norm_st = state.strip().lower()
    norm_crop = crop.strip().lower()

    for fac in VERIFIED_FACTORIES_DATA:
        if norm_st and norm_st not in fac["state"].lower():
            continue
        if norm_crop and "all" not in norm_crop:
            if norm_crop not in fac["crop"].lower() and fac["crop"].lower() not in norm_crop:
                continue
        results.append(fac)

    if not results:
        results = [fac for fac in VERIFIED_FACTORIES_DATA if not norm_st or norm_st in fac["state"].lower()] or VERIFIED_FACTORIES_DATA

    return results

def create_factory_delivery_pass(
    factory_id: str,
    farmer_name: str,
    phone: str,
    district: str,
    village: str,
    crop: str,
    quantity_qtl: float,
    delivery_date: str,
) -> dict[str, Any]:
    """Generates official Zero-Broker Direct Factory Delivery Pass."""
    factory = next((f for fac in [VERIFIED_FACTORIES_DATA] for f in fac if f["id"] == factory_id), VERIFIED_FACTORIES_DATA[0])
    
    total_factory_payout = quantity_qtl * factory["direct_offer_price_qtl"]
    mandi_baseline_payout = quantity_qtl * factory["mandi_benchmark_price_qtl"]
    broker_commission_savings = total_factory_payout - mandi_baseline_payout
    
    pass_number = f"DIRECT-PASS-{datetime.now().strftime('%y%m%d')}-{len(DIRECT_DELIVERY_PASSES) + 201}"
    delivery_pass = {
        "pass_number": pass_number,
        "factory_id": factory["id"],
        "factory_name": factory["factory_name"],
        "factory_location": factory["location"],
        "factory_district": factory["district"],
        "factory_state": factory["state"],
        "procurement_officer": factory["procurement_officer"],
        "officer_phone": factory["phone"],
        "farmer_name": farmer_name,
        "phone": phone,
        "origin_village": village,
        "origin_district": district,
        "crop": crop,
        "allocated_quantity_qtl": quantity_qtl,
        "agreed_rate_per_qtl": factory["direct_offer_price_qtl"],
        "total_estimated_payout_inr": round(total_factory_payout, 2),
        "broker_commission_saved_inr": round(broker_commission_savings, 2),
        "delivery_date": delivery_date,
        "status": "Gate Pass Active (Direct Entry Approved)",
        "generated_at": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        "instructions": "Present this digital or printed Delivery Pass at the Factory Weighbridge. This entitles you to priority unloading with ZERO deductions for mandi commissions, brokerage, or dalal cuts.",
    }
    DIRECT_DELIVERY_PASSES.append(delivery_pass)
    return delivery_pass
