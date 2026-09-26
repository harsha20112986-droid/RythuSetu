"""
RythuSetu Production Mandi Price Ingestion, Normalization & Validation Pipeline
Interfaces with Government Open Data Platform (Data.gov.in) and AGMARKNET.
Implements SSRF protection, deterministic normalization, cryptographic payload hashing,
APMC price bound validation, and idempotent upserts.
"""

from typing import Any
import os
import json
import hashlib
from datetime import datetime, timezone
import urllib.request
import urllib.parse
import urllib.error
import time
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models import MandiDailyPrice, MandiIngestionRun, MandiRawRecord


# Canonical crop mapping dictionary: maps raw upstream variants to standardized canonical crop names
CROP_CANONICAL_MAP = {
    # Red Chilli
    "chilli": "Red Chilli",
    "chilli red": "Red Chilli",
    "red chilli": "Red Chilli",
    "mirchi": "Red Chilli",
    "dry chillies": "Red Chilli",
    "chillies(red)": "Red Chilli",
    "chillies (red)": "Red Chilli",
    "chilly": "Red Chilli",

    # Cotton
    "cotton": "Cotton",
    "kapas": "Cotton",
    "cotton (unginned)": "Cotton",
    "cotton(unginned)": "Cotton",
    "cotton (ginned)": "Cotton",
    "cotton(ginned)": "Cotton",
    "patti": "Cotton",

    # Paddy / Rice
    "paddy": "Paddy / Rice",
    "paddy(dhan)(common)": "Paddy / Rice",
    "paddy (dhan) (common)": "Paddy / Rice",
    "paddy(dhan)(grade a)": "Paddy / Rice",
    "paddy (dhan) (grade a)": "Paddy / Rice",
    "dhan": "Paddy / Rice",
    "rice": "Paddy / Rice",
    "vari": "Paddy / Rice",

    # Turmeric
    "turmeric": "Turmeric",
    "haldi": "Turmeric",
    "pasupu": "Turmeric",
    "turmeric (raw)": "Turmeric",

    # Groundnut
    "groundnut": "Groundnut",
    "groundnut (split)": "Groundnut",
    "groundnut pods (wet)": "Groundnut",
    "peanut": "Groundnut",
    "verusenaga": "Groundnut",

    # Maize
    "maize": "Maize",
    "corn": "Maize",
    "makka": "Maize",
    "jonnalu": "Maize",
    "mokkajonna": "Maize",

    # Pulses
    "arhar (tur/red gram)(whole)": "Pigeon Pea / Red Gram (Tur)",
    "arhar (tur)": "Pigeon Pea / Red Gram (Tur)",
    "tur": "Pigeon Pea / Red Gram (Tur)",
    "red gram": "Pigeon Pea / Red Gram (Tur)",
    "kandulu": "Pigeon Pea / Red Gram (Tur)",
    "pigeon pea": "Pigeon Pea / Red Gram (Tur)",
    "moong(green gram)(whole)": "Green Gram (Moong)",
    "moong (green gram)": "Green Gram (Moong)",
    "green gram": "Green Gram (Moong)",
    "pesalu": "Green Gram (Moong)",
    "urad (black gram)(whole)": "Black Gram (Urad)",
    "black gram": "Black Gram (Urad)",
    "minumulu": "Black Gram (Urad)",
    "bengal gram(gram)(whole)": "Bengal Gram (Chickpea/Chana)",
    "bengal gram": "Bengal Gram (Chickpea/Chana)",
    "chana": "Bengal Gram (Chickpea/Chana)",
    "sanagalu": "Bengal Gram (Chickpea/Chana)",

    # Oilseeds & Others
    "soyabean": "Soybean",
    "soybean": "Soybean",
    "sorghum (jowar)": "Sorghum (Jowar)",
    "jowar": "Sorghum (Jowar)",
    "pearl millet (bajra)": "Pearl Millet (Bajra)",
    "bajra": "Pearl Millet (Bajra)",
    "sajjalu": "Pearl Millet (Bajra)",
}

ALLOWED_UPSTREAM_DOMAINS = {
    "api.data.gov.in",
    "agmarknet.gov.in",
}


class MandiDataNormalizer:
    """Normalizes raw upstream APMC/Agmarknet records into standard database formats."""

    @staticmethod
    def normalize_crop(raw_name: str | None) -> str:
        if not raw_name:
            return "Other"
        norm = raw_name.strip().lower()
        if norm in CROP_CANONICAL_MAP:
            return CROP_CANONICAL_MAP[norm]
        for key, canonical in CROP_CANONICAL_MAP.items():
            if key in norm or norm in key:
                return canonical
        return raw_name.strip().title()

    @staticmethod
    def normalize_variety(variety: str | None) -> str:
        if not variety or not variety.strip() or variety.strip().lower() in {"other", "others", "none", "null", "all"}:
            return "Other"
        cleaned = variety.strip()
        # Clean up common noise
        cleaned = " ".join(cleaned.split())
        return cleaned

    @staticmethod
    def normalize_grade(grade: str | None) -> str:
        if not grade or not grade.strip() or grade.strip().lower() in {"faq", "fair average quality", "medium"}:
            return "FAQ"
        cleaned = grade.strip()
        if cleaned.lower() in {"a", "grade a", "grade-a"}:
            return "Grade A"
        return cleaned.title()

    @staticmethod
    def normalize_date(date_str: str | None) -> str:
        """Parses upstream date string into standard ISO YYYY-MM-DD."""
        if not date_str or not date_str.strip():
            return datetime.now(timezone.utc).strftime("%Y-%m-%d")
        cleaned = date_str.strip()
        for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d", "%d.%m.%Y"):
            try:
                dt = datetime.strptime(cleaned, fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue
        # Fallback if unparseable
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")

    @staticmethod
    def normalize_float(val: Any, default: float = 0.0) -> float:
        if val is None:
            return default
        if isinstance(val, (int, float)):
            return float(val)
        try:
            s = str(val).replace(",", "").replace("₹", "").replace("$", "").strip()
            return float(s) if s else default
        except (ValueError, TypeError):
            return default


class MandiValidator:
    """Validates APMC market records against plausibility bounds and pricing constraints."""

    MIN_PLAUSIBLE_PRICE = 100.0       # Minimum plausible INR/quintal
    MAX_PLAUSIBLE_PRICE = 250000.0    # Maximum plausible INR/quintal (e.g. Saffron/Super Grade Dry Chilli)

    @classmethod
    def validate_record(cls, record: dict[str, Any]) -> tuple[str, str | None, dict[str, Any]]:
        """
        Validates normalized record.
        Returns: (status: 'VALID' | 'WARNING' | 'REJECTED', notes, cleaned_record)
        """
        cleaned = dict(record)
        min_p = cleaned.get("min_price", 0.0)
        max_p = cleaned.get("max_price", 0.0)
        modal_p = cleaned.get("modal_price", 0.0)
        state = cleaned.get("state", "").strip()
        market = cleaned.get("market", "").strip()
        commodity = cleaned.get("commodity", "").strip()
        arrival_date = cleaned.get("arrival_date", "").strip()

        # Hard rejection criteria: missing critical identifiers or completely zero/negative prices
        if not state or not market or not commodity or not arrival_date:
            return "REJECTED", "Missing required fields (state, market, commodity, or arrival_date)", cleaned

        if modal_p <= 0.0 or min_p < 0.0 or max_p < 0.0:
            return "REJECTED", f"Non-positive price detected: modal={modal_p}, min={min_p}, max={max_p}", cleaned

        if modal_p < cls.MIN_PLAUSIBLE_PRICE or modal_p > cls.MAX_PLAUSIBLE_PRICE:
            return "REJECTED", f"Price outside agricultural plausibility window (100 - 250,000 INR/qtl): {modal_p}", cleaned

        # Warning & auto-correction: Inverted min and max price (frequent portal data entry bug)
        notes = []
        status = "VALID"

        if min_p > max_p:
            cleaned["min_price"] = max_p
            cleaned["max_price"] = min_p
            notes.append(f"Inverted min/max swapped: was [{min_p}, {max_p}], adjusted to [{max_p}, {min_p}]")
            status = "WARNING"
            min_p, max_p = max_p, min_p

        # Modal price should ideally be within [min_price, max_price]
        if modal_p < min_p:
            notes.append(f"Modal price ₹{modal_p} was below min price ₹{min_p}; clamped min to modal")
            cleaned["min_price"] = modal_p
            status = "WARNING"
        elif modal_p > max_p:
            notes.append(f"Modal price ₹{modal_p} was above max price ₹{max_p}; clamped max to modal")
            cleaned["max_price"] = modal_p
            status = "WARNING"

        return status, ("; ".join(notes) if notes else None), cleaned

    @staticmethod
    def compute_record_hash(raw_data: str | dict[str, Any]) -> str:
        """Generates deterministic SHA-256 hash for provenance and duplicate detection."""
        if isinstance(raw_data, dict):
            payload_str = json.dumps(raw_data, sort_keys=True)
        else:
            payload_str = str(raw_data)
        return hashlib.sha256(payload_str.encode("utf-8")).hexdigest()


class MandiIngestionService:
    """
    Ingestion service for Government Open Data (Data.gov.in / Agmarknet).
    Includes SSRF validation, retry with backoff, offline handling, and database persistence.
    """

    RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
    DEFAULT_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("DATA_GOV_API_KEY") or os.getenv("MANDI_API_KEY")

    def _validate_ssrf_url(self, target_url: str) -> bool:
        """Ensures request targets strictly authorized government host domains."""
        try:
            parsed = urllib.parse.urlparse(target_url)
            if parsed.scheme not in ("https", "http"):
                return False
            hostname = (parsed.hostname or "").lower()
            return hostname in ALLOWED_UPSTREAM_DOMAINS
        except Exception:
            return False

    def fetch_upstream_records(
        self,
        state: str | None = None,
        limit: int = 500,
        offset: int = 0,
    ) -> dict[str, Any]:
        """
        Fetches daily market records from Data.gov.in OGD API.
        Fails safely and gracefully when unconfigured or unreachable.
        """
        if not self.api_key:
            return {
                "success": False,
                "status": "OFFLINE_UNCONFIGURED",
                "error": "DATA_GOV_API_KEY is not configured in environment. Ingestion offline mode active.",
                "records": [],
                "raw_payload": None,
            }

        params = {
            "api-key": self.api_key,
            "format": "json",
            "offset": str(offset),
            "limit": str(limit),
        }
        if state:
            params["filters[state]"] = state

        query_str = urllib.parse.urlencode(params)
        full_url = f"{self.DEFAULT_API_URL}?{query_str}"

        if not self._validate_ssrf_url(full_url):
            return {
                "success": False,
                "status": "SSRF_BLOCKED",
                "error": "Target URL blocked by SSRF egress policy",
                "records": [],
                "raw_payload": None,
            }

        headers = {
            "User-Agent": "RythuSetu-MarketIntelligence/2.0 (Agricultural Intelligence Engine; Contact: dev@rythusetu.org)",
            "Accept": "application/json",
        }

        # Retry loop with exponential backoff
        max_retries = 3
        last_error = None

        for attempt in range(max_retries):
            try:
                req = urllib.request.Request(full_url, headers=headers, method="GET")
                with urllib.request.urlopen(req, timeout=6.0) as resp:
                    if resp.status == 200:
                        raw_bytes = resp.read()
                        raw_text = raw_bytes.decode("utf-8")
                        data = json.loads(raw_text)
                        records = data.get("records", [])
                        return {
                            "success": True,
                            "status": "SUCCESS",
                            "records": records,
                            "total": data.get("total", len(records)),
                            "raw_payload": raw_text,
                            "updated_date": data.get("updated_date"),
                        }
                    else:
                        last_error = f"HTTP {resp.status}: {resp.reason}"
            except urllib.error.HTTPError as e:
                last_error = f"HTTP {e.code}: {e.reason}"
                if e.code in (401, 403):
                    # Invalid or unauthorized API key - do not retry
                    break
            except Exception as e:
                last_error = str(e)

            if attempt < max_retries - 1:
                time.sleep(0.5 * (2 ** attempt))

        return {
            "success": False,
            "status": "FAILED",
            "error": f"Upstream fetch failed: {last_error}",
            "records": [],
            "raw_payload": None,
        }

    def process_and_persist_records(
        self,
        db: Session,
        records: list[dict[str, Any]],
        source_name: str = "Government OGD / AGMARKNET",
        raw_payload_str: str | None = None,
        request_params: dict[str, Any] | None = None,
    ) -> MandiIngestionRun:
        """
        Normalizes, validates, and persists a list of raw records into mandi_daily_prices.
        Maintains audit trail in mandi_ingestion_runs and mandi_raw_records.
        """
        now = datetime.now(timezone.utc)
        run = MandiIngestionRun(
            source=source_name,
            started_at=now,
            status="RUNNING",
            records_received=len(records),
            records_inserted=0,
            records_updated=0,
            records_rejected=0,
            request_parameters=json.dumps(request_params) if request_params else None,
        )
        db.add(run)
        db.flush()

        if raw_payload_str:
            raw_hash = MandiValidator.compute_record_hash(raw_payload_str)
            raw_rec = MandiRawRecord(
                ingestion_run_id=run.id,
                source=source_name,
                raw_payload=raw_payload_str[:500000],  # Bound payload capture
                payload_hash=raw_hash,
                received_at=now,
            )
            db.add(raw_rec)

        for raw_item in records:
            # Map upstream fields (Data.gov.in standard fields vs Agmarknet bulletin fields)
            raw_state = raw_item.get("state") or raw_item.get("State") or "Telangana"
            raw_district = raw_item.get("district") or raw_item.get("District") or ""
            raw_market = raw_item.get("market") or raw_item.get("Market") or ""
            raw_commodity = raw_item.get("commodity") or raw_item.get("Commodity") or ""
            raw_variety = raw_item.get("variety") or raw_item.get("Variety") or "Other"
            raw_grade = raw_item.get("grade") or raw_item.get("Grade") or "FAQ"
            raw_date = raw_item.get("arrival_date") or raw_item.get("Arrival_Date") or ""

            # Normalize values
            canonical_crop = MandiDataNormalizer.normalize_crop(raw_commodity)
            variety = MandiDataNormalizer.normalize_variety(raw_variety)
            grade = MandiDataNormalizer.normalize_grade(raw_grade)
            arrival_date = MandiDataNormalizer.normalize_date(raw_date)

            min_price = MandiDataNormalizer.normalize_float(raw_item.get("min_price") or raw_item.get("Min_Price"))
            max_price = MandiDataNormalizer.normalize_float(raw_item.get("max_price") or raw_item.get("Max_Price"))
            modal_price = MandiDataNormalizer.normalize_float(raw_item.get("modal_price") or raw_item.get("Modal_Price"))
            arrival_qty = MandiDataNormalizer.normalize_float(raw_item.get("arrival_quantity") or raw_item.get("Arrival_Quantity"))

            norm_record = {
                "source": source_name,
                "source_record_id": str(raw_item.get("id") or raw_item.get("_id") or ""),
                "state": raw_state.strip(),
                "district": raw_district.strip() or raw_market.strip(),
                "market": raw_market.strip(),
                "commodity": canonical_crop,
                "variety": variety,
                "grade": grade,
                "arrival_date": arrival_date,
                "arrival_quantity": arrival_qty,
                "quantity_unit": "Tonnes",
                "min_price": min_price,
                "max_price": max_price,
                "modal_price": modal_price,
                "price_unit": "INR/Quintal",
                "currency": "INR",
                "source_url": "https://agmarknet.gov.in",
            }

            status, notes, cleaned = MandiValidator.validate_record(norm_record)
            if status == "REJECTED":
                run.records_rejected += 1
                continue

            item_hash = MandiValidator.compute_record_hash(raw_item)

            # Idempotent upsert by composite natural key
            existing = db.query(MandiDailyPrice).filter(
                MandiDailyPrice.state == cleaned["state"],
                MandiDailyPrice.district == cleaned["district"],
                MandiDailyPrice.market == cleaned["market"],
                MandiDailyPrice.commodity == cleaned["commodity"],
                MandiDailyPrice.variety == cleaned["variety"],
                MandiDailyPrice.grade == cleaned["grade"],
                MandiDailyPrice.arrival_date == cleaned["arrival_date"],
            ).first()

            if existing:
                existing.min_price = cleaned["min_price"]
                existing.max_price = cleaned["max_price"]
                existing.modal_price = cleaned["modal_price"]
                existing.arrival_quantity = cleaned["arrival_quantity"]
                existing.data_status = status
                existing.validation_notes = notes
                existing.raw_hash = item_hash
                existing.fetched_at = now
                existing.is_active = True
                run.records_updated += 1
            else:
                new_entry = MandiDailyPrice(
                    source=cleaned["source"],
                    source_record_id=cleaned["source_record_id"] or None,
                    state=cleaned["state"],
                    district=cleaned["district"],
                    market=cleaned["market"],
                    commodity=cleaned["commodity"],
                    variety=cleaned["variety"],
                    grade=cleaned["grade"],
                    arrival_date=cleaned["arrival_date"],
                    arrival_quantity=cleaned["arrival_quantity"],
                    quantity_unit=cleaned["quantity_unit"],
                    min_price=cleaned["min_price"],
                    max_price=cleaned["max_price"],
                    modal_price=cleaned["modal_price"],
                    price_unit=cleaned["price_unit"],
                    currency=cleaned["currency"],
                    source_url=cleaned["source_url"],
                    fetched_at=now,
                    normalized_at=now,
                    is_active=True,
                    data_status=status,
                    raw_hash=item_hash,
                    validation_notes=notes,
                )
                db.add(new_entry)
                run.records_inserted += 1

        run.completed_at = datetime.now(timezone.utc)
        run.status = "SUCCESS" if run.records_rejected == 0 else "PARTIAL"
        db.commit()
        return run

    def run_sync(
        self,
        db: Session,
        state: str | None = None,
        limit: int = 500,
    ) -> dict[str, Any]:
        """
        Executes full sync pipeline: fetches from upstream and updates database.
        Returns detailed telemetry report.
        """
        now = datetime.now(timezone.utc)
        fetch_res = self.fetch_upstream_records(state=state, limit=limit)

        if not fetch_res["success"]:
            # Record failed or offline run
            run = MandiIngestionRun(
                source="Data.gov.in (OGD)",
                started_at=now,
                completed_at=now,
                status=fetch_res["status"],
                records_received=0,
                records_inserted=0,
                records_updated=0,
                records_rejected=0,
                error_message=fetch_res.get("error"),
                request_parameters=json.dumps({"state": state, "limit": limit}),
            )
            db.add(run)
            db.commit()
            return {
                "success": False,
                "status": fetch_res["status"],
                "message": fetch_res.get("error"),
                "records_processed": 0,
                "inserted": 0,
                "updated": 0,
                "rejected": 0,
            }

        records = fetch_res["records"]
        run = self.process_and_persist_records(
            db=db,
            records=records,
            source_name="Data.gov.in (OGD)",
            raw_payload_str=fetch_res.get("raw_payload"),
            request_params={"state": state, "limit": limit},
        )

        return {
            "success": True,
            "status": run.status,
            "run_id": run.id,
            "records_received": run.records_received,
            "inserted": run.records_inserted,
            "updated": run.records_updated,
            "rejected": run.records_rejected,
            "completed_at": run.completed_at.isoformat() if run.completed_at else None,
        }
