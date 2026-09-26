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


def test_password_hashing_and_verification():
    from app.core.security import hash_password, verify_password
    pw = "KisanSecret@2026"
    hashed = hash_password(pw)
    assert hashed != pw
    assert hashed.startswith("$2b$12$")
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_auth_registration_and_jwt_tokens(client):
    import time
    unique_user = f"farmer_test_{int(time.time())}"
    reg_payload = {
        "name": "Anji Reddy",
        "username": unique_user,
        "password": "SecurePassword123",
        "role": "admin",  # Attacker attempts privilege escalation
        "state": "Telangana",
        "district": "Warangal",
        "phone": "+91 98480 99887",
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    # Ensure role is enforced to farmer
    assert data["user"]["role"] == "farmer"
    farmer_token = data["access_token"]

    # Test login with credentials
    login_res = client.post("/api/v1/auth/login", json={"username": unique_user, "password": "SecurePassword123"})
    assert login_res.status_code == 200
    assert login_res.json()["user"]["username"] == unique_user

    # Test /auth/me with Bearer token
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {farmer_token}"})
    assert me_res.status_code == 200
    assert me_res.json()["username"] == unique_user


def test_rbac_protection_on_admin_endpoints(client):
    import time
    # 1. Anonymous access is blocked (401)
    res_anon = client.get("/api/v1/admin/all-claims")
    assert res_anon.status_code == 401

    # 2. Farmer access is denied (403 Forbidden)
    unique_user = f"farmer_rbac_{int(time.time())}"
    reg = client.post("/api/v1/auth/register", json={
        "name": "Ramulu",
        "username": unique_user,
        "password": "Password123",
        "state": "Telangana",
        "district": "Warangal",
    })
    farmer_token = reg.json()["access_token"]
    res_forbidden = client.get("/api/v1/admin/all-claims", headers={"Authorization": f"Bearer {farmer_token}"})
    assert res_forbidden.status_code == 403
    assert "Access denied" in res_forbidden.json()["detail"]

    # 3. Admin access succeeds (200 OK)
    from app.core.config import settings
    admin_login = client.post("/api/v1/auth/login", json={"username": "admin", "password": settings.admin_initial_password})
    admin_token = admin_login.json()["access_token"]
    res_admin = client.get("/api/v1/admin/all-claims", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_admin.status_code == 200
    assert "claims" in res_admin.json()


def test_pmfby_claim_preparation_and_db_persistence(client):
    import datetime
    now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    form_data = {
        "farmer_id": 101,
        "crop": "Cotton",
        "damage_type": "Flood / Heavy Rain",
        "loss_date": now_str,
        "affected_area_acres": 2.5,
        "damage_percent": 65.0,
        "description": "Continuous heavy downpour submerged the fields for 48 hours.",
    }
    res = client.post("/api/v1/crop-loss", data=form_data)
    assert res.status_code == 201
    claim = res.json()
    assert "reference_number" in claim
    assert claim["reference_number"].startswith("RYTHU-CLAIM-2026-")
    assert claim["is_within_window"] is True
    assert claim["status"] == "Submitted"

    # Track claim status
    ref = claim["reference_number"]
    status_res = client.get(f"/api/v1/claims/status/{ref}")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["reference_number"] == ref
    assert status_data["current_status"] == "Submitted"
    assert len(status_data["stages"]) == 4
    assert len(status_data["audit_events"]) >= 1


def test_storage_and_direct_market_persistence(client):
    from app.core.config import settings
    admin_login = client.post("/api/v1/auth/login", json={"username": "admin", "password": settings.admin_initial_password})
    admin_token = admin_login.json()["access_token"]

    # 1. Cold storage booking
    book_res = client.post("/api/v1/storage/book-space", json={
        "facility_id": "cs-gtr-01",
        "farmer_name": "Nageswara Rao",
        "phone": "+91 98480 33445",
        "commodity": "Red Chilli (Teja)",
        "bags_count": 80,
        "duration_months": 4,
    })
    assert book_res.status_code == 200
    booking = book_res.json()
    token = booking["booking_token"]
    assert token.startswith("RS-GODOWN-")

    # Verify listing via officer token
    list_res = client.get("/api/v1/storage/bookings", headers={"Authorization": f"Bearer {admin_token}"})
    assert list_res.status_code == 200
    tokens = [b["booking_token"] for b in list_res.json()["bookings"]]
    assert token in tokens

    # 2. Factory delivery pass
    pass_res = client.post("/api/v1/direct-market/delivery-pass", json={
        "factory_id": "fac-spn-01",
        "farmer_name": "Venkatesh",
        "phone": "+91 94400 11223",
        "district": "Warangal",
        "village": "Chennaraopet",
        "crop": "Cotton",
        "quantity_qtl": 25.0,
        "delivery_date": "2026-10-02",
    })
    assert pass_res.status_code == 200
    pass_data = pass_res.json()
    pass_num = pass_data["pass_number"]
    assert pass_num.startswith("DIRECT-PASS-")

    # Verify pass list via officer token
    passes_res = client.get("/api/v1/direct-market/passes", headers={"Authorization": f"Bearer {admin_token}"})
    assert passes_res.status_code == 200
    all_passes = [p["pass_number"] for p in passes_res.json()["passes"]]
    assert pass_num in all_passes


def test_deep_readiness_probe(client):
    """Verifies that orchestrator readiness probe executes deep database, storage, and security checks."""
    res = client.get("/readiness")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ready"
    assert "database" in data["checks"]
    assert data["checks"]["database"]["status"] == "ok"
    assert "storage" in data["checks"]
    assert data["checks"]["storage"]["status"] == "ok"
    assert "security" in data["checks"]
    assert data["checks"]["security"]["status"] == "ok"


def test_zero_fallback_404_for_unknown_farmer(client):
    """Verifies strict 404 behavior with zero mock fallbacks when an unknown farmer ID is queried."""
    unknown_id = 99998888
    # 1. Farmers endpoint must return 404, never fallback to first DB record
    res_profile = client.get(f"/api/v1/farmers/{unknown_id}")
    assert res_profile.status_code == 404
    assert f"#{unknown_id}" in res_profile.json()["detail"] or "not exist" in res_profile.json()["detail"]

    # 2. Crop loss endpoint must return 404 for non-existent farmer
    res_loss = client.get(f"/api/v1/crop-loss?farmer_id={unknown_id}")
    assert res_loss.status_code == 404


def test_bola_idor_authorization_enforcement(client):
    """Verifies Broken Object Level Authorization (BOLA/IDOR) protection between distinct cultivators."""
    import time
    ts = int(time.time() * 1000)

    # 1. Register Cultivator A
    reg_a = client.post("/api/v1/auth/register", json={
        "name": "Cultivator Alpha",
        "username": f"farmer_a_{ts}",
        "password": "Password123!",
        "state": "Telangana",
        "district": "Warangal",
        "crop": "Cotton",
        "land_area_acres": 3.0,
    })
    assert reg_a.status_code == 200
    token_a = reg_a.json()["access_token"]
    farmer_a_id = reg_a.json()["user"]["farmer_profile_id"]

    # 2. Register Cultivator B
    reg_b = client.post("/api/v1/auth/register", json={
        "name": "Cultivator Beta",
        "username": f"farmer_b_{ts}",
        "password": "Password123!",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "crop": "Red Chilli",
        "land_area_acres": 4.0,
    })
    assert reg_b.status_code == 200
    token_b = reg_b.json()["access_token"]
    farmer_b_id = reg_b.json()["user"]["farmer_profile_id"]

    # 3. Cultivator A querying own profile via /farmers/me succeeds
    me_res = client.get("/api/v1/farmers/me", headers={"Authorization": f"Bearer {token_a}"})
    assert me_res.status_code == 200
    assert me_res.json()["id"] == farmer_a_id

    # 4. Cultivator A attempting to query Cultivator B's claims is blocked (403 Forbidden)
    idor_query = client.get(
        f"/api/v1/crop-loss?farmer_id={farmer_b_id}",
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert idor_query.status_code == 403
    assert "Forbidden" in idor_query.json()["detail"]

    # 5. Cultivator A attempting to tamper with Cultivator B's profile is blocked (403 Forbidden)
    idor_update = client.put(
        f"/api/v1/farmers/{farmer_b_id}",
        json={
            "name": "Tampered Name",
            "state": "Telangana",
            "district": "Warangal",
            "crop": "Cotton",
            "season": "Kharif",
            "land_area_acres": 10.0,
        },
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert idor_update.status_code == 403


def test_magic_bytes_image_validation(client):
    """Verifies that image endpoints reject MIME-spoofed files and enforce authentic magic byte headers."""
    # 1. Spoofed JPEG (text disguised as jpg) must be rejected with 400
    fake_jpeg_content = b"<html><script>alert('xss')</script></html>"
    files = {"file": ("malicious.jpg", fake_jpeg_content, "image/jpeg")}
    res_fake = client.post("/api/v1/crop-doctor/analyze", files=files, data={"crop": "Cotton"})
    assert res_fake.status_code == 400
    assert "Invalid image format" in res_fake.json()["detail"]

    # 2. Genuine PNG magic byte header is accepted
    genuine_png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 64
    files_ok = {"file": ("valid.png", genuine_png, "image/png")}
    res_ok = client.post("/api/v1/crop-doctor/analyze", files=files_ok, data={"crop": "Cotton"})
    # Result must succeed in validation (200 status from crop-doctor)
    assert res_ok.status_code == 200


def test_rate_limiter_blocking(client):
    """Verifies that rapid requests trigger HTTP 429 Too Many Requests with Retry-After header."""
    from app.core.rate_limit import reset_rate_limiter
    reset_rate_limiter()

    # The rate limit on /auth/login is 10 requests per minute
    hit_429 = False
    for _ in range(12):
        res = client.post("/api/v1/auth/login", json={"username": "nonexistent", "password": "wrongpassword"})
        if res.status_code == 429:
            hit_429 = True
            assert "Retry-After" in res.headers
            assert "Rate limit exceeded" in res.json()["detail"]
            break

    assert hit_429 is True
    # Reset limiter after test
    reset_rate_limiter()


def test_event_driven_notification_engine(client):
    """Verifies dispatching and retrieval of persistent user notifications."""
    import time
    from app.db import SessionLocal
    from app.event_engine import dispatch_weather_alert_event, dispatch_mandi_price_event

    ts = int(time.time() * 1000)
    # Register test cultivator
    reg = client.post("/api/v1/auth/register", json={
        "name": "Notification Farmer",
        "username": f"farmer_notif_{ts}",
        "password": "Password123!",
        "state": "Telangana",
        "district": "Warangal",
        "crop": "Cotton",
        "land_area_acres": 2.5,
    })
    assert reg.status_code == 200
    token = reg.json()["access_token"]
    user_id = reg.json()["user"]["id"]

    db = SessionLocal()
    try:
        # Dispatch weather and mandi events
        dispatch_weather_alert_event(
            db=db,
            user_id=user_id,
            district="Warangal",
            crop="Cotton",
            hazard_title="Imminent Heavy Rain Warning",
            advisory="Cover harvested cotton immediately to avoid grade downgrading.",
            severity="CRITICAL",
        )
        dispatch_mandi_price_event(
            db=db,
            user_id=user_id,
            crop="Cotton",
            variety="Medium Staple",
            market="Warangal Enumamula",
            modal_price=7850.0,
            msp_spread=329.0,
        )
    finally:
        db.close()

    # Fetch notifications
    notif_res = client.get("/api/v1/notifications", headers={"Authorization": f"Bearer {token}"})
    assert notif_res.status_code == 200
    data = notif_res.json()
    assert data["unread_count"] >= 2
    assert len(data["notifications"]) >= 2

    # Mark first notification as read
    first_id = data["notifications"][0]["id"]
    read_res = client.post(f"/api/v1/notifications/{first_id}/read", headers={"Authorization": f"Bearer {token}"})
    assert read_res.status_code == 200
    assert read_res.json()["status"] == "success"


def test_nearby_hub_gps_grounding_and_provenance(client):
    """Verifies honest GPS coordinates vs district centroid labeling and facility verification metadata."""
    # 1. Device GPS provided
    res_gps = client.get("/api/v1/nearby/hub?state=Telangana&district=Warangal&lat=17.9850&lon=79.6250")
    assert res_gps.status_code == 200
    loc_gps = res_gps.json()["farmer_location"]
    assert loc_gps["is_exact_gps"] is True
    assert loc_gps["location_basis"] == "EXACT_DEVICE_GPS"

    # 2. No GPS provided (centroid fallback with honest disclosure)
    res_centroid = client.get("/api/v1/nearby/hub?state=Telangana&district=Warangal")
    assert res_centroid.status_code == 200
    loc_centroid = res_centroid.json()["farmer_location"]
    assert loc_centroid["is_exact_gps"] is False
    assert loc_centroid["location_basis"] == "DISTRICT_ADMINISTRATIVE_CENTROID"

    # 3. Verify facility verification audit trail
    mandis = res_gps.json()["nearby_mandis"]
    assert len(mandis) > 0
    assert "verification" in mandis[0]
    assert mandis[0]["verification"]["verification_status"] == "OFFICIALLY_VERIFIED"



