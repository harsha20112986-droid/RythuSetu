import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_machinery_rentals_and_booking(client):
    res = client.get("/api/v1/machinery/rentals?district=Guntur")
    assert res.status_code == 200
    data = res.json()
    assert "equipment" in data
    assert len(data["equipment"]) > 0

    # Book a tractor
    booking_req = {
        "machinery_id": "mch-gnt-01",
        "farmer_name": "Ravi Kumar",
        "phone": "+91 98480 12345",
        "district": "Guntur",
        "village": "Pallapadu",
        "acres_or_hours": 3.0,
        "required_date": "2026-09-29",
    }
    b_res = client.post("/api/v1/machinery/book", json=booking_req)
    assert b_res.status_code == 200
    b_data = b_res.json()
    assert "booking_token" in b_data
    assert b_data["booking_token"].startswith("RS-MCH-")
    assert b_data["estimated_cost_inr"] == 3.0 * 1200

def test_harvest_shield_weather_danger(client):
    res = client.get("/api/v1/weather/harvest-shield?district=Guntur&crop=Red Chilli")
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data
    assert "tarpaulin_centers" in data
    assert len(data["tarpaulin_centers"]) > 0
    assert len(data["protection_steps"]) == 4

def test_seed_batch_verification_genuine(client):
    # Test valid lot
    res = client.get("/api/v1/seeds/verify-batch?lot_number=SYNG-CHL-2609-5531")
    assert res.status_code == 200
    data = res.json()
    assert data["found"] is True
    assert data["is_genuine"] is True
    assert "batch_data" in data
    assert data["batch_data"]["germination_tested_percent"] == 88

def test_seed_batch_verification_spurious_and_grievance(client):
    # Test spurious lot
    res = client.get("/api/v1/seeds/verify-batch?lot_number=UNKNOWN-FAKE-999")
    assert res.status_code == 200
    data = res.json()
    assert data["found"] is False
    assert data["is_genuine"] is False

    # File grievance
    grv_payload = {
        "farmer_name": "Srinivas Rao",
        "phone": "+91 94401 55667",
        "village": "Chennaraopet",
        "district": "Warangal",
        "dealer_name": "Sri Balaji Traders",
        "seed_brand": "Counterfeit Chilli Hybrid",
        "lot_number": "UNKNOWN-FAKE-999",
        "germination_failed_percent": 85.0,
        "notes": "Failed to sprout in 2 acres nursery.",
    }
    g_res = client.post("/api/v1/seeds/report-spurious", json=grv_payload)
    assert g_res.status_code == 200
    g_data = g_res.json()
    assert "complaint_id" in g_data
    assert g_data["complaint_id"].startswith("SEED-GRV-")

def test_agri_khata_breakeven_calculator(client):
    # 1. Template
    t_res = client.get("/api/v1/khata/template?crop=Red Chilli")
    assert t_res.status_code == 200
    t_data = t_res.json()
    assert "expenses" in t_data

    # 2. Calculation
    k_payload = {
        "crop": "Red Chilli",
        "acres": 2.0,
        "expenses": {
            "land_prep": 18000,
            "seeds": 28000,
            "fertilizer": 44000,
            "labor": 64000,
        },
        "expected_yield_quintals": 20.0,
        "expected_market_price_per_qtl": 18500.0,
    }
    k_res = client.post("/api/v1/khata/calculate-breakeven", json=k_payload)
    assert k_res.status_code == 200
    k_data = k_res.json()
    assert k_data["total_cost"] == 154000.0
    assert k_data["breakeven_per_qtl"] == 3850.0  # 154000 / (20 * 2) = 3850
    assert k_data["net_profit"] > 0
    assert k_data["is_distress_loss"] is False

    # 3. History
    h_res = client.get("/api/v1/khata/history")
    assert h_res.status_code == 200
    assert len(h_res.json()["entries"]) > 0

def test_agri_input_products_and_dealers(client):
    p_res = client.get("/api/v1/inputs/products")
    assert p_res.status_code == 200
    prods = p_res.json()["products"]
    assert len(prods) >= 20

    # Ensure EVERY single product has an authentic original packshot and valid CDN fallback
    for p in prods:
        assert p["image_url"].startswith("/images/products/"), f"Product {p['id']} image must be local packshot"
        assert "unsplash.com" not in p["image_url"], f"Product {p['id']} must not use stock Unsplash photo"
        assert p.get("cdn_image_url") and p["cdn_image_url"].startswith("http"), f"Product {p['id']} missing cdn_image_url"
        assert p.get("chemical_formula"), f"Product {p['id']} must have active chemical formula"
        assert len(p.get("price_comparison", [])) > 0, f"Product {p['id']} must have multi-store price comparisons"

    d_res = client.get("/api/v1/inputs/dealers?district=Guntur")
    assert d_res.status_code == 200
    assert "dealers" in d_res.json()
    assert len(d_res.json()["dealers"]) > 0

