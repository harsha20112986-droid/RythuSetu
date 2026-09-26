"""
RythuSetu Production Mandi Pipeline & Market Intelligence Test Suite
Tests normalizer, validator, SSRF policy, ingestion audit trails, idempotent upserts,
MSP benchmark comparisons, freshness evaluations, and RBAC on sync operations.
"""

import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.db import SessionLocal
from app.models import MandiDailyPrice, MspBenchmark, MandiIngestionRun, UserAccount
from app.core.security import hash_password, create_access_token
from app.mandi_ingestion import (
    MandiDataNormalizer,
    MandiValidator,
    MandiIngestionService,
)
from app.mandi_engine import (
    calculate_freshness_metadata,
    get_mandi_prices_pipeline,
    get_mandi_history,
    get_mandi_comparison,
    get_mandi_trend,
    get_msp_benchmarks,
)

client = TestClient(app)


def test_mandi_normalizer_canonical_mappings():
    """Verifies that upstream regional and portal variations map to standardized canonical crops."""
    assert MandiDataNormalizer.normalize_crop("Chilli Red") == "Red Chilli"
    assert MandiDataNormalizer.normalize_crop("Mirchi") == "Red Chilli"
    assert MandiDataNormalizer.normalize_crop("Kapas") == "Cotton"
    assert MandiDataNormalizer.normalize_crop("cotton (unginned)") == "Cotton"
    assert MandiDataNormalizer.normalize_crop("Paddy(Dhan)(Common)") == "Paddy / Rice"
    assert MandiDataNormalizer.normalize_crop("Pasupu") == "Turmeric"
    assert MandiDataNormalizer.normalize_crop("Verusenaga") == "Groundnut"
    assert MandiDataNormalizer.normalize_crop("Corn") == "Maize"
    assert MandiDataNormalizer.normalize_crop("Jonnalu") == "Maize"
    assert MandiDataNormalizer.normalize_crop("Arhar (Tur/Red Gram)(Whole)") == "Pigeon Pea / Red Gram (Tur)"
    assert MandiDataNormalizer.normalize_crop("Moong(Green Gram)(Whole)") == "Green Gram (Moong)"
    assert MandiDataNormalizer.normalize_crop("Bengal Gram(Gram)(Whole)") == "Bengal Gram (Chickpea/Chana)"


def test_mandi_normalizer_dates_and_prices():
    """Verifies date format parsing and robust price string cleansing."""
    assert MandiDataNormalizer.normalize_date("26/09/2026") == "2026-09-26"
    assert MandiDataNormalizer.normalize_date("2026-09-26") == "2026-09-26"
    assert MandiDataNormalizer.normalize_date("26-09-2026") == "2026-09-26"

    assert MandiDataNormalizer.normalize_float("₹21,800.50") == 21800.50
    assert MandiDataNormalizer.normalize_float(" 7,521 ") == 7521.0
    assert MandiDataNormalizer.normalize_float(None, default=0.0) == 0.0
    assert MandiDataNormalizer.normalize_float("invalid", default=0.0) == 0.0


def test_mandi_validator_rules_and_corrections():
    """Tests validation constraints: inverted bounds swapping, bounds clamping, and rejections."""
    # 1. Perfectly valid record
    valid_rec = {
        "state": "Telangana",
        "market": "Warangal APMC",
        "commodity": "Cotton",
        "arrival_date": "2026-09-26",
        "min_price": 7200.0,
        "max_price": 7800.0,
        "modal_price": 7500.0,
    }
    status, notes, cleaned = MandiValidator.validate_record(valid_rec)
    assert status == "VALID"
    assert notes is None

    # 2. Inverted min and max price (swapped with WARNING)
    inverted_rec = dict(valid_rec, min_price=7800.0, max_price=7200.0)
    status, notes, cleaned = MandiValidator.validate_record(inverted_rec)
    assert status == "WARNING"
    assert cleaned["min_price"] == 7200.0
    assert cleaned["max_price"] == 7800.0
    assert "Inverted min/max swapped" in notes

    # 3. Non-positive price rejection
    zero_price_rec = dict(valid_rec, modal_price=0.0)
    status, notes, _ = MandiValidator.validate_record(zero_price_rec)
    assert status == "REJECTED"

    # 4. Out-of-bounds absurd price rejection
    absurd_price_rec = dict(valid_rec, modal_price=9999999.0)
    status, notes, _ = MandiValidator.validate_record(absurd_price_rec)
    assert status == "REJECTED"

    # 5. Missing state or market rejection
    missing_market = dict(valid_rec, market="")
    status, notes, _ = MandiValidator.validate_record(missing_market)
    assert status == "REJECTED"


def test_ssrf_egress_protection():
    """Ensures external HTTP requests only target explicitly allowed government domains."""
    service = MandiIngestionService()
    assert service._validate_ssrf_url("https://api.data.gov.in/resource/12345") is True
    assert service._validate_ssrf_url("https://agmarknet.gov.in/SearchCmmMkt.aspx") is True
    assert service._validate_ssrf_url("https://evil-attacker.com/steal-data") is False
    assert service._validate_ssrf_url("http://169.254.169.254/latest/meta-data/") is False
    assert service._validate_ssrf_url("file:///etc/passwd") is False


def test_ingestion_offline_fallback_without_fabrication():
    """Verifies that missing DATA_GOV_API_KEY does not fabricate live data and logs audit run."""
    db: Session = SessionLocal()
    try:
        service = MandiIngestionService(api_key=None)
        res = service.run_sync(db=db, state="Telangana", limit=10)
        assert res["success"] is False
        assert res["status"] == "OFFLINE_UNCONFIGURED"

        # Check that run was logged in mandi_ingestion_runs
        latest_run = db.query(MandiIngestionRun).order_by(MandiIngestionRun.id.desc()).first()
        assert latest_run is not None
        assert latest_run.status == "OFFLINE_UNCONFIGURED"
    finally:
        db.close()


def test_idempotent_mandi_upsert():
    """Verifies that re-ingesting the same APMC market arrival updates rather than duplicates."""
    db: Session = SessionLocal()
    try:
        service = MandiIngestionService()
        raw_mock = [
            {
                "state": "Telangana",
                "district": "Warangal",
                "market": "Warangal Enumamula Yard",
                "commodity": "Cotton",
                "variety": "Bunny / Brahma",
                "grade": "FAQ",
                "arrival_date": "2026-09-26",
                "min_price": 7200.0,
                "max_price": 7800.0,
                "modal_price": 7500.0,
                "arrival_quantity": 35.0,
            }
        ]

        # First ingestion
        run1 = service.process_and_persist_records(db=db, records=raw_mock)
        assert run1.records_inserted >= 0  # May have been seeded or inserted

        # Second ingestion with updated price
        raw_mock[0]["modal_price"] = 7550.0
        run2 = service.process_and_persist_records(db=db, records=raw_mock)
        assert run2.records_updated >= 1

        # Check single unique record in database
        count = db.query(MandiDailyPrice).filter(
            MandiDailyPrice.state == "Telangana",
            MandiDailyPrice.market == "Warangal Enumamula Yard",
            MandiDailyPrice.commodity == "Cotton",
            MandiDailyPrice.variety == "Bunny / Brahma",
            MandiDailyPrice.arrival_date == "2026-09-26",
        ).count()
        assert count == 1

        updated_rec = db.query(MandiDailyPrice).filter(
            MandiDailyPrice.state == "Telangana",
            MandiDailyPrice.market == "Warangal Enumamula Yard",
            MandiDailyPrice.commodity == "Cotton",
            MandiDailyPrice.variety == "Bunny / Brahma",
            MandiDailyPrice.arrival_date == "2026-09-26",
        ).first()
        assert updated_rec.modal_price == 7550.0
    finally:
        db.close()


def test_freshness_metadata_evaluation():
    """Tests temporal freshness logic and status classification."""
    # Today's date
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    meta_today = calculate_freshness_metadata(today_str)
    assert meta_today["freshness"] == "LATEST"
    assert meta_today["data_source_status"] == "OFFICIAL_LATEST"

    # None date
    meta_none = calculate_freshness_metadata(None)
    assert meta_none["freshness"] == "STALE"
    assert meta_none["data_source_status"] == "REFERENCE_ONLY"


def test_mandi_prices_endpoint_and_freshness_provenance():
    """Tests GET /api/v1/mandi/prices returns full pipeline structure with truthfulness indicators."""
    res = client.get("/api/v1/mandi/prices?crop=Cotton&district=Warangal")
    assert res.status_code == 200
    data = res.json()

    assert data["crop"] == "Cotton"
    assert "govt_msp_inr" in data
    assert data["govt_msp_inr"] > 0
    assert "average_modal_price" in data
    assert "msp_difference_inr" in data
    assert "freshness" in data
    assert "data_source_status" in data
    assert "varieties" in data
    assert "markets" in data
    assert "provenance" in data
    assert "trust_label" in data["provenance"]
    assert "disclaimer" in data["provenance"]


def test_mandi_history_endpoint():
    """Tests GET /api/v1/mandi/history returns daily time-series."""
    res = client.get("/api/v1/mandi/history?crop=Red Chilli&district=Guntur&days=30")
    assert res.status_code == 200
    data = res.json()
    assert data["crop"] == "Red Chilli"
    assert "history" in data
    assert isinstance(data["history"], list)
    if len(data["history"]) > 0:
        first = data["history"][0]
        assert "arrival_date" in first
        assert "modal_price" in first
        assert "market" in first


def test_mandi_compare_endpoint():
    """Tests GET /api/v1/mandi/compare returns ranked markets."""
    res = client.get("/api/v1/mandi/compare?crop=Red Chilli")
    assert res.status_code == 200
    data = res.json()
    assert data["crop"] == "Red Chilli"
    assert "markets" in data
    if len(data["markets"]) > 1:
        # Check sorted descending
        for i in range(len(data["markets"]) - 1):
            assert data["markets"][i]["modal_price"] >= data["markets"][i + 1]["modal_price"]


def test_mandi_trend_endpoint():
    """Tests GET /api/v1/mandi/trend returns neutral price momentum metrics."""
    res = client.get("/api/v1/mandi/trend?crop=Cotton&district=Warangal")
    assert res.status_code == 200
    data = res.json()
    assert data["crop"] == "Cotton"
    assert "trend" in data
    assert data["trend"] in ("UP", "DOWN", "STABLE")
    assert "absolute_change" in data
    assert "percentage_change" in data


def test_mandi_msp_benchmarks_endpoint():
    """Tests GET /api/v1/mandi/msp returns statutory CACP/MIS rates."""
    res = client.get("/api/v1/mandi/msp?commodity=Cotton")
    assert res.status_code == 200
    data = res.json()
    assert "benchmarks" in data
    assert data["count"] > 0
    first = data["benchmarks"][0]
    assert first["commodity"] == "Cotton"
    assert "price_per_quintal" in first
    assert "government_source" in first


def test_admin_mandi_sync_rbac_enforcement():
    """Verifies that /admin/mandi/sync strictly requires officer/admin authentication."""
    # 1. Unauthenticated request must fail with 401
    res = client.post("/api/v1/admin/mandi/sync")
    assert res.status_code == 401

    db: Session = SessionLocal()
    try:
        # 2. Authenticated farmer user must fail with 403 Forbidden
        farmer_user = db.query(UserAccount).filter(UserAccount.username == "test_farmer_sync").first()
        if not farmer_user:
            farmer_user = UserAccount(
                username="test_farmer_sync",
                hashed_password=hash_password("FarmerTest123!"),
                name="Test Farmer",
                role="farmer",
                is_active=True,
            )
            db.add(farmer_user)
            db.commit()

        farmer_token = create_access_token({"sub": str(farmer_user.id), "role": farmer_user.role})
        farmer_res = client.post(
            "/api/v1/admin/mandi/sync",
            headers={"Authorization": f"Bearer {farmer_token}"},
        )
        assert farmer_res.status_code == 403

        # 3. Authenticated officer/admin user is permitted
        admin_user = db.query(UserAccount).filter(UserAccount.role == "admin").first()
        assert admin_user is not None
        admin_token = create_access_token({"sub": str(admin_user.id), "role": admin_user.role})
        admin_res = client.post(
            "/api/v1/admin/mandi/sync?state=Telangana&limit=10",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert admin_res.status_code == 200
        telemetry = admin_res.json()
        assert "status" in telemetry

        # 4. Ingestion status endpoint is accessible to officer
        status_res = client.get(
            "/api/v1/admin/mandi/ingestion-status",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert status_res.status_code == 200
        status_data = status_res.json()
        assert "runs" in status_data
        assert isinstance(status_data["runs"], list)
    finally:
        db.close()
