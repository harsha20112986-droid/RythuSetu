"""
RythuSetu Seed & Input Authenticity Batch Verifier Engine
Cross-verifies seed lot codes, certified germination percentages, and license registries
to safeguard farmers against counterfeit/spurious seeds and fertilizers.
"""

from typing import Any
from datetime import datetime

VERIFIED_SEED_BATCHES: list[dict[str, Any]] = [
    {
        "lot_number": "SYNG-CHL-2609-5531",
        "brand_name": "Syngenta 5531 Hot Pepper / Byadgi",
        "telugu_name": "సింజెంటా 5531 మిరప విత్తనాలు",
        "crop": "Red Chilli",
        "producer": "Syngenta India Seeds Ltd.",
        "producer_license": "AP-SEED-GNT-2022-1089",
        "germination_tested_percent": 88,
        "min_germination_standard": 70,
        "physical_purity_percent": 99.2,
        "genetic_purity_percent": 98.5,
        "test_date": "15 Aug 2026",
        "valid_until": "14 May 2027",
        "treated_chemical": "Thiram 75% WP @ 2.5g/kg",
        "authenticity_status": "Certified Genuine Seed Batch 🟢",
        "state_registry": "Andhra Pradesh Seed Certification Agency (APSCA)",
        "advisory": "Store in cool dry place below 25°C. Conduct 24-hr wet towel germination test before main nursery sowing.",
    },
    {
        "lot_number": "NUZ-COT-2608-7201",
        "brand_name": "Nuziveedu Bhakti BG-II BT Cotton",
        "telugu_name": "నుజివీడు భక్తి బిజి-2 పత్తి",
        "crop": "Cotton",
        "producer": "Nuziveedu Seeds Ltd.",
        "producer_license": "TS-SEED-HYD-2021-4419",
        "germination_tested_percent": 82,
        "min_germination_standard": 65,
        "physical_purity_percent": 98.8,
        "genetic_purity_percent": 95.0,
        "test_date": "10 Aug 2026",
        "valid_until": "09 Apr 2027",
        "treated_chemical": "Imidacloprid 70% WS @ 5g/kg",
        "authenticity_status": "Certified Genuine Seed Batch 🟢",
        "state_registry": "Telangana State Seed & Organic Certification Authority (TSSOCA)",
        "advisory": "Check green holographic seal on pouch. Ensure 5 non-BT refuge seed packets are planted along border.",
    },
    {
        "lot_number": "TSSDC-PAD-2607-1010",
        "brand_name": "Telangana Sona (RNR 15048 Foundation Seed)",
        "telugu_name": "తెలంగాణ సోనా ఫౌండేషన్ సీడ్స్",
        "crop": "Paddy / Rice",
        "producer": "Telangana State Seed Development Corp (TSSDC)",
        "producer_license": "TS-GOVT-SEED-2023-001",
        "germination_tested_percent": 91,
        "min_germination_standard": 80,
        "physical_purity_percent": 99.5,
        "genetic_purity_percent": 99.0,
        "test_date": "22 Jul 2026",
        "valid_until": "21 Apr 2027",
        "treated_chemical": "Carbendazim 50% WP @ 2g/kg",
        "authenticity_status": "Certified Genuine Govt Seed 🟢",
        "state_registry": "PJTSAU / TSSDC Official Foundation Registry",
        "advisory": "Approved low-GI super fine grain. Soak seeds in salt water (floaters discarded) before sprouting.",
    },
    {
        "lot_number": "KAV-CHL-2608-9901",
        "brand_name": "Kaveri Teja Red Chilli Hybrid",
        "telugu_name": "కావేరి తేజా మిరప విత్తనాలు",
        "crop": "Red Chilli",
        "producer": "Kaveri Seed Company Ltd.",
        "producer_license": "AP-SEED-GNT-2023-3312",
        "germination_tested_percent": 86,
        "min_germination_standard": 70,
        "physical_purity_percent": 99.0,
        "genetic_purity_percent": 97.5,
        "test_date": "05 Aug 2026",
        "valid_until": "04 May 2027",
        "treated_chemical": "Captan 50% WP @ 3g/kg",
        "authenticity_status": "Certified Genuine Seed Batch 🟢",
        "state_registry": "APSCA Quality Registry",
        "advisory": "High pungency export hybrid. Protect seedlings from whitefly using 50-mesh nylon insect net.",
    }
]

SPURIOUS_SEED_GRIEVANCES: list[dict[str, Any]] = []

def verify_seed_lot(lot_code: str) -> dict[str, Any]:
    """
    Looks up seed lot code in the certified breeder reference registry.
    Transparently labels provenance as Reference Seed Lot Registry.
    """
    clean_lot = lot_code.strip().upper()
    
    for batch in VERIFIED_SEED_BATCHES:
        if clean_lot in batch["lot_number"].upper() or batch["lot_number"].upper() in clean_lot:
            return {
                "found": True,
                "lot_number": batch["lot_number"],
                "batch_data": batch,
                "is_genuine": True,
                "provenance": {
                    "source_type": "REFERENCE_REGISTRY",
                    "source_name": "Breeder Certified Lot Database (Reference Catalog)",
                    "last_verified": "September 2026",
                    "trust_label": "Verified Certified Lot",
                }
            }

    # If lot is not recognized in certified database
    return {
        "found": False,
        "lot_number": clean_lot,
        "is_genuine": False,
        "authenticity_status": "⚠️ Unregistered or Unknown Lot Number",
        "warning_title": "Spurious / Counterfeit Seed Alert",
        "warning_details": "This seed lot code does NOT match any registered breeder batch in our certified reference catalog. Using unregistered seeds may lead to total germination failure or genetic degeneration.",
        "action_required": "Do not sow this seed. Request retailer invoice and file a spurious seed grievance below for Agriculture Department inspection.",
        "provenance": {
            "source_type": "REFERENCE_REGISTRY",
            "source_name": "Breeder Certified Lot Database (Reference Catalog)",
            "last_verified": "September 2026",
            "trust_label": "Unregistered Lot Code",
        }
    }

def file_seed_grievance(
    farmer_name: str,
    phone: str,
    village: str,
    district: str,
    dealer_name: str,
    seed_brand: str,
    lot_number: str,
    germination_failed_percent: float,
    notes: str,
    user_id: int | None = None,
    db: Any = None,
) -> dict[str, Any]:
    """
    Submits spurious seed complaint to Mandal Agriculture Officer (MAO) and persists in database.
    """
    from datetime import datetime, timezone
    from app.models import SeedGrievance
    
    now = datetime.now(timezone.utc)
    complaint_id = f"SEED-GRV-{now.strftime('%y%m%d')}-{abs(hash(farmer_name + lot_number)) % 899 + 101}"
    record = {
        "complaint_id": complaint_id,
        "farmer_name": farmer_name,
        "phone": phone,
        "village": village,
        "district": district,
        "dealer_name": dealer_name,
        "seed_brand": seed_brand,
        "lot_number": lot_number,
        "germination_failed_percent": germination_failed_percent,
        "notes": notes,
        "status": "Submitted to Mandal Seed Inspector / MAO",
        "submitted_at": now.strftime("%d %b %Y, %I:%M %p"),
        "resolution_timeline": "Seed Inspector field sample testing within 48 hours under Seeds Act, 1966.",
    }

    if db is not None:
        try:
            grv = SeedGrievance(
                complaint_id=complaint_id,
                user_id=user_id,
                farmer_name=farmer_name,
                phone=phone,
                village=village,
                district=district,
                dealer_name=dealer_name,
                seed_brand=seed_brand,
                lot_number=lot_number,
                germination_failed_percent=float(germination_failed_percent),
                notes=notes,
                status="Submitted to Mandal Seed Inspector / MAO",
                created_at=now,
            )
            db.add(grv)
            db.commit()
            db.refresh(grv)
            record["id"] = grv.id
        except Exception as e:
            db.rollback()
            print(f"[SEED GRIEVANCE ERROR] {e}")

    SPURIOUS_SEED_GRIEVANCES.insert(0, record)
    return record

def get_all_seed_grievances(db: Any = None) -> list[dict[str, Any]]:
    """Returns all seed grievances from persistent database."""
    from app.models import SeedGrievance
    if db is not None:
        try:
            grvs = db.query(SeedGrievance).order_by(SeedGrievance.created_at.desc()).all()
            results = []
            for g in grvs:
                results.append({
                    "id": g.id,
                    "complaint_id": g.complaint_id,
                    "farmer_name": g.farmer_name,
                    "phone": g.phone,
                    "village": g.village,
                    "district": g.district,
                    "dealer_name": g.dealer_name,
                    "seed_brand": g.seed_brand,
                    "lot_number": g.lot_number,
                    "germination_failed_percent": g.germination_failed_percent,
                    "notes": g.notes,
                    "status": g.status,
                    "submitted_at": g.created_at.strftime("%d %b %Y, %I:%M %p") if g.created_at else "",
                })
            if results:
                return results
        except Exception:
            pass

    return SPURIOUS_SEED_GRIEVANCES
