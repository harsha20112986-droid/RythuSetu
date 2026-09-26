#!/usr/bin/env python3
"""
RythuSetu Nightly Mandi Ingestion Cron Script
Triggered by Render Cron Service at 01:00 IST (19:30 UTC) daily.
Pulls APMC market price records from Data.gov.in OGD API for all configured
states and persists them via the production MandiIngestionService pipeline.

Usage (Render cron startCommand):
    python cron_sync.py

Environment variables read:
    DATABASE_URL        PostgreSQL connection string (set from Render database)
    DATA_GOV_API_KEY    data.gov.in API key (set manually in Render Dashboard)
    MANDI_SYNC_STATES   Comma-separated state names (default: Telangana,Andhra Pradesh)
    MANDI_SYNC_LIMIT    Records per upstream API call per state (default: 1000)
    APP_ENV             Should be 'production' on Render
    JWT_SECRET_KEY      Required for config validation (injected from web service)
    ADMIN_INITIAL_PASSWORD  Required for config validation (injected from web service)
"""

from __future__ import annotations

import os
import sys
import json
import logging
from datetime import datetime, timezone

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("rythusetu.cron_sync")

# ── Bootstrap: validate settings before touching DB ───────────────────────────
try:
    from app.core.config import settings
    log.info("Config loaded: env=%s, db=%s",
             settings.app_env,
             "PostgreSQL" if "postgresql" in settings.database_url else "SQLite")
except RuntimeError as exc:
    log.critical("Configuration validation failed — cron aborting: %s", exc)
    sys.exit(1)

# ── Database session ──────────────────────────────────────────────────────────
from app.db import SessionLocal
from app.db_init import initialize_database
from app.mandi_ingestion import MandiIngestionService

# Ensure all tables and seed data exist (idempotent)
try:
    initialize_database()
    log.info("Database initialized (tables and seed data confirmed).")
except Exception as exc:
    log.error("Database initialization error (non-fatal): %s", exc)


def run_ingestion() -> dict:
    """
    Runs the mandi ingestion pipeline for each configured state.
    Returns a summary dict for logging / exit-code decision.
    """
    api_key = os.getenv("DATA_GOV_API_KEY") or os.getenv("MANDI_API_KEY")
    states_raw = os.getenv("MANDI_SYNC_STATES", "Telangana,Andhra Pradesh")
    limit = int(os.getenv("MANDI_SYNC_LIMIT", "1000"))
    states = [s.strip() for s in states_raw.split(",") if s.strip()]

    if not api_key:
        log.warning(
            "DATA_GOV_API_KEY is not set — ingestion will run in OFFLINE_UNCONFIGURED mode. "
            "Set the key in Render Dashboard → rythusetu-mandi-sync → Environment to enable live sync."
        )

    service = MandiIngestionService(api_key=api_key)

    started_at = datetime.now(timezone.utc)
    total_inserted = 0
    total_updated = 0
    total_rejected = 0
    state_results = []

    log.info("Mandi sync starting: states=%s, limit_per_state=%d, api_key_set=%s",
             states, limit, bool(api_key))

    db = SessionLocal()
    try:
        for state in states:
            log.info("Syncing state: %s (limit=%d)...", state, limit)
            try:
                result = service.run_sync(db=db, state=state, limit=limit)
                log.info(
                    "  State=%s status=%s inserted=%d updated=%d rejected=%d",
                    state,
                    result.get("status"),
                    result.get("inserted", 0),
                    result.get("updated", 0),
                    result.get("rejected", 0),
                )
                total_inserted += result.get("inserted", 0)
                total_updated += result.get("updated", 0)
                total_rejected += result.get("rejected", 0)
                state_results.append({
                    "state": state,
                    "success": result.get("success", False),
                    "status": result.get("status"),
                    "inserted": result.get("inserted", 0),
                    "updated": result.get("updated", 0),
                    "rejected": result.get("rejected", 0),
                    "message": result.get("message"),
                })
            except Exception as exc:
                log.error("Error syncing state=%s: %s", state, exc, exc_info=True)
                state_results.append({
                    "state": state,
                    "success": False,
                    "status": "ERROR",
                    "error": str(exc),
                })
    finally:
        db.close()

    completed_at = datetime.now(timezone.utc)
    duration_s = (completed_at - started_at).total_seconds()

    summary = {
        "started_at": started_at.isoformat(),
        "completed_at": completed_at.isoformat(),
        "duration_seconds": round(duration_s, 2),
        "states_synced": len(states),
        "total_inserted": total_inserted,
        "total_updated": total_updated,
        "total_rejected": total_rejected,
        "state_results": state_results,
        "api_key_configured": bool(api_key),
    }

    log.info("Mandi sync complete: %s", json.dumps({
        k: v for k, v in summary.items() if k != "state_results"
    }))

    return summary


if __name__ == "__main__":
    summary = run_ingestion()

    # Non-zero exit if all states failed (Render marks cron as failed, sends alert)
    all_failed = all(not r.get("success") for r in summary["state_results"])
    if all_failed and summary["api_key_configured"]:
        log.error("All state syncs failed with API key configured — exiting non-zero.")
        sys.exit(1)

    sys.exit(0)
