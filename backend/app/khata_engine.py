"""
RythuSetu Digital Agri Khata & Breakeven Price Calculator Engine
Calculates real-world cost-of-cultivation per acre, cost of production per quintal,
and provides minimum benchmark selling prices to protect farmers against distress sales.
"""

from typing import Any
from datetime import datetime

CROP_COST_TEMPLATES: dict[str, dict[str, Any]] = {
    "red chilli": {
        "crop_name": "Red Chilli (తేజా / బైదగి మిరప)",
        "default_acres": 1.0,
        "default_yield_quintals": 22.0,
        "expenses": {
            "land_preparation": 9500.0,
            "seed_nursery": 14000.0,
            "fertilizers": 22000.0,
            "pesticides_plant_protection": 26000.0,
            "irrigation_electricity": 5500.0,
            "weeding_intercultural": 12000.0,
            "harvesting_picking_labor": 32000.0,
            "post_harvest_drying_bags": 6500.0,
            "transport_to_mandi": 4500.0,
        },
        "msp_inr": None,  # Chilli is non-MSP commercial crop
        "standard_market_price_inr": 18500.0,
        "storage_alternative": "Guntur Cold Storage (₹140/bag for 6 months) + Negotiable Warehouse Receipt (e-NWR) loan at 7% interest.",
        "advisory_te": "ఎకరాకు మిరప పెట్టుబడి సుమారు ₹1,32,000 అవుతుంది. క్వింటాలుకు ₹6,000 కంటే తక్కువ అమ్మితే నష్టం వస్తుంది. గిట్టుబాటు ధర క్వింటాలుకు ₹16,000 - ₹20,000 వరకు డిమాండ్ చేయండి.",
    },
    "cotton": {
        "crop_name": "BT Cotton (పత్తి)",
        "default_acres": 1.0,
        "default_yield_quintals": 12.0,
        "expenses": {
            "land_preparation": 7500.0,
            "seed_nursery": 3600.0,
            "fertilizers": 11500.0,
            "pesticides_plant_protection": 14500.0,
            "irrigation_electricity": 3500.0,
            "weeding_intercultural": 8000.0,
            "harvesting_picking_labor": 18000.0,
            "post_harvest_drying_bags": 2500.0,
            "transport_to_mandi": 3000.0,
        },
        "msp_inr": 7521.0,  # Govt MSP 2024-25 medium staple
        "standard_market_price_inr": 7400.0,
        "storage_alternative": "CCI (Cotton Corporation of India) procurement center or nearby CWC godown.",
        "advisory_te": "పత్తి కనీస మద్దతు ధర (MSP) క్వింటాలుకు ₹7,521 ఉంది. ప్రైవేట్ దళారులు అంతకంటే తక్కువ ఇస్తే CCI కొనుగోలు కేంద్రానికి తీసుకెళ్లండి.",
    },
    "paddy": {
        "crop_name": "Paddy / Rice (వరి)",
        "default_acres": 1.0,
        "default_yield_quintals": 26.0,
        "expenses": {
            "land_preparation": 8000.0,
            "seed_nursery": 3200.0,
            "fertilizers": 9500.0,
            "pesticides_plant_protection": 5500.0,
            "irrigation_electricity": 4000.0,
            "weeding_intercultural": 5500.0,
            "harvesting_picking_labor": 7500.0,  # Combined harvester
            "post_harvest_drying_bags": 2000.0,
            "transport_to_mandi": 2800.0,
        },
        "msp_inr": 2320.0,  # Grade A Paddy MSP
        "standard_market_price_inr": 2350.0,
        "storage_alternative": "PACS / Rythu Bharosa Kendra (RBK) direct procurement or State Warehousing Corp.",
        "advisory_te": "వరికి ప్రభుత్వం క్వింటాలుకు ₹2,320 MSP ప్రకటించింది. తేమ శాతం 17% లోపు ఉండేలా చూసుకుని ఆర్బీకే/సహకార సంఘానికి విక్రయించండి.",
    },
    "maize": {
        "crop_name": "Maize (మొక్కజొన్న)",
        "default_acres": 1.0,
        "default_yield_quintals": 28.0,
        "expenses": {
            "land_preparation": 6500.0,
            "seed_nursery": 4500.0,
            "fertilizers": 10500.0,
            "pesticides_plant_protection": 4500.0,
            "irrigation_electricity": 3500.0,
            "weeding_intercultural": 4500.0,
            "harvesting_picking_labor": 6500.0,
            "post_harvest_drying_bags": 2000.0,
            "transport_to_mandi": 2500.0,
        },
        "msp_inr": 2225.0,
        "standard_market_price_inr": 2180.0,
        "storage_alternative": "State Civil Supplies or Poultry Feed Mills direct purchase.",
        "advisory_te": "మొక్కజొన్న MSP క్వింటాలుకు ₹2,225. తేమ 14% లోపు ఉంటే కోళ్ల దాణా తయారీ మిల్లులకు నేరుగా ఎక్కువ ధరకు అమ్మవచ్చు.",
    }
}

# In-memory cache for fallback when db is not provided
SAVED_KHATA_ENTRIES: list[dict[str, Any]] = []

def get_crop_cost_template(crop: str = "Red Chilli") -> dict[str, Any]:
    """Returns baseline cultivation budget template for the crop."""
    norm = crop.strip().lower()
    for key, data in CROP_COST_TEMPLATES.items():
        if key in norm or norm in key:
            return {"crop_key": key, **data}
    return {"crop_key": "red chilli", **CROP_COST_TEMPLATES["red chilli"]}

def calculate_breakeven_cost(
    crop: str,
    acres: float,
    expenses: dict[str, float],
    expected_yield_quintals: float,
    expected_market_price_per_qtl: float = 0.0,
    farmer_name: str = "Cultivator",
    user_id: int | None = None,
    db: Any = None,
) -> dict[str, Any]:
    """
    Computes accurate cultivation cost per acre, breakeven cost per quintal,
    profit margin, and anti-distress sale advice. Persists in database.
    """
    import json
    from datetime import datetime, timezone
    from app.models import AgriKhataEntry
    
    total_cost = sum(expenses.values())
    cost_per_acre = total_cost / max(acres, 0.1)
    
    total_yield = max(expected_yield_quintals * acres, 0.5)
    breakeven_per_qtl = round(total_cost / total_yield, 2)
    
    # Recommended target price: Cost of Production + 50% profit (Swaminathan Formula A2+FL/C2)
    fair_target_price_per_qtl = round(breakeven_per_qtl * 1.5, 2)
    
    # Compare with current expected selling price
    if expected_market_price_per_qtl <= 0:
        template = get_crop_cost_template(crop)
        expected_market_price_per_qtl = template.get("standard_market_price_inr", fair_target_price_per_qtl)

    total_revenue = expected_market_price_per_qtl * total_yield
    net_profit = round(total_revenue - total_cost, 2)
    profit_margin_pct = round((net_profit / total_cost) * 100, 1) if total_cost > 0 else 0.0

    is_distress_loss = expected_market_price_per_qtl < breakeven_per_qtl
    
    status_label = "Profitable Sale 🟢"
    status_color = "emerald"
    action_guidance = f"Current offer ₹{expected_market_price_per_qtl}/qtl covers production cost (₹{breakeven_per_qtl}/qtl) with healthy profit of ₹{net_profit:,.0f}."

    if is_distress_loss:
        status_label = "Severe Distress Loss Warning 🔴"
        status_color = "rose"
        loss_amount = abs(net_profit)
        action_guidance = (
            f"STOP! Selling at ₹{expected_market_price_per_qtl}/qtl causes a total loss of ₹{loss_amount:,.0f} "
            f"(₹{breakeven_per_qtl - expected_market_price_per_qtl:.0f}/qtl below your production cost). "
            f"Preserve your produce in a nearby verified cold storage/godown and apply for an e-NWR warehouse loan."
        )
    elif profit_margin_pct < 20:
        status_label = "Marginal Return 🟡"
        status_color = "amber"
        action_guidance = f"Returns are thin ({profit_margin_pct}%). Consider negotiating with direct buyers or holding in storage."

    now = datetime.now(timezone.utc)
    calculation_id = f"KHT-{now.strftime('%y%m%d%H%M%S')}"

    entry = {
        "id": calculation_id,
        "crop": crop,
        "acres": acres,
        "expenses": expenses,
        "total_cost": round(total_cost, 2),
        "cost_per_acre": round(cost_per_acre, 2),
        "expected_yield_per_acre": expected_yield_quintals,
        "total_yield_quintals": round(total_yield, 2),
        "breakeven_per_qtl": breakeven_per_qtl,
        "fair_target_price_per_qtl": fair_target_price_per_qtl,
        "offered_price_per_qtl": expected_market_price_per_qtl,
        "total_revenue": round(total_revenue, 2),
        "net_profit": net_profit,
        "profit_margin_pct": profit_margin_pct,
        "is_distress_loss": is_distress_loss,
        "status_label": status_label,
        "status_color": status_color,
        "action_guidance": action_guidance,
        "storage_alternative": get_crop_cost_template(crop).get("storage_alternative", ""),
        "created_at": now.strftime("%d %b %Y, %I:%M %p"),
    }

    if db is not None:
        try:
            db_entry = AgriKhataEntry(
                entry_code=calculation_id,
                user_id=user_id,
                farmer_name=farmer_name,
                crop=crop,
                acres=float(acres),
                total_cost=float(total_cost),
                total_yield_quintals=float(total_yield),
                breakeven_price_per_qtl=float(breakeven_per_qtl),
                expected_market_price_per_qtl=float(expected_market_price_per_qtl),
                net_profit_projected=float(net_profit),
                expenses_json=json.dumps(expenses),
                created_at=now,
            )
            db.add(db_entry)
            db.commit()
            db.refresh(db_entry)
            entry["db_id"] = db_entry.id
        except Exception as e:
            db.rollback()
            print(f"[KHATA PERSISTENCE ERROR] {e}")

    SAVED_KHATA_ENTRIES.insert(0, entry)
    return entry

def get_saved_khata_entries(db: Any = None, user_id: int | None = None) -> list[dict[str, Any]]:
    """Returns saved ledger history from database."""
    from app.models import AgriKhataEntry
    import json
    
    if db is not None:
        try:
            query = db.query(AgriKhataEntry)
            if user_id:
                query = query.filter(AgriKhataEntry.user_id == user_id)
            entries = query.order_by(AgriKhataEntry.created_at.desc()).all()
            results = []
            for e in entries:
                exp = json.loads(e.expenses_json) if e.expenses_json else {}
                results.append({
                    "id": e.entry_code,
                    "db_id": e.id,
                    "farmer_name": e.farmer_name,
                    "crop": e.crop,
                    "acres": e.acres,
                    "expenses": exp,
                    "total_cost": e.total_cost,
                    "cost_per_acre": round(e.total_cost / max(e.acres, 0.1), 2),
                    "total_yield_quintals": e.total_yield_quintals,
                    "breakeven_per_qtl": e.breakeven_price_per_qtl,
                    "offered_price_per_qtl": e.expected_market_price_per_qtl,
                    "net_profit": e.net_profit_projected,
                    "profit_margin_pct": round((e.net_profit_projected / max(e.total_cost, 1.0)) * 100, 1),
                    "is_distress_loss": e.expected_market_price_per_qtl < e.breakeven_price_per_qtl,
                    "created_at": e.created_at.strftime("%d %b %Y, %I:%M %p") if e.created_at else "",
                })
            if results:
                return results
        except Exception:
            pass

    return SAVED_KHATA_ENTRIES
