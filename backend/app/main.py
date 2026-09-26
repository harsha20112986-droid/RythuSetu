from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.api import router as api_router
from app.voice_api import router as voice_router
from pathlib import Path
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.db import engine
from app.core.config import settings, validate_production_security
from app.db_init import initialize_database
from app import models  # noqa: F401


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds essential production security headers to all HTTP responses."""
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "connect-src 'self' https://api.open-meteo.com https://api.data.gov.in; "
            "font-src 'self' data:; "
            "frame-ancestors 'none';"
        )
        return response


app = FastAPI(
    title=settings.app_name,
    version="0.3.0",
    description="Production-grade agricultural intelligence, PMFBY preparation, and farm-to-market linkage platform.",
)

# CORS Middleware with configured origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if settings.cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Production security headers
app.add_middleware(SecurityHeadersMiddleware)

# Initialize database schema and idempotent seed data on startup
@app.on_event("startup")
def on_startup():
    validate_production_security()
    initialize_database()


app.include_router(api_router)
app.include_router(voice_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "RythuSetu Backend API",
        "status": "running",
        "version": "0.3.0",
        "docs": "/docs",
    }


@app.get("/health")
def health() -> dict[str, str]:
    """Shallow liveness probe (checks process responsiveness)."""
    return {"status": "healthy", "service": "rythusetu-backend"}


@app.get("/readiness")
def readiness():
    """
    Deep readiness probe for orchestrator load balancers (Kubernetes, AWS ECS, GCP Cloud Run).
    Verifies:
      1. Relational database connectivity via SELECT 1.
      2. Upload storage filesystem writeability.
      3. Production security configuration.
    """
    checks = {}
    is_ready = True

    # 1. Database Connectivity Probe
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        checks["database"] = {"status": "ok", "dialect": engine.dialect.name}
    except Exception as exc:
        is_ready = False
        checks["database"] = {"status": "error", "detail": str(exc)}

    # 2. Upload Storage Writeability Probe
    upload_dir = Path(__file__).resolve().parents[1] / "uploads"
    try:
        upload_dir.mkdir(parents=True, exist_ok=True)
        probe_file = upload_dir / ".readiness_probe.tmp"
        probe_file.write_text("probe_ok")
        probe_file.unlink(missing_ok=True)
        checks["storage"] = {"status": "ok", "writable": True}
    except Exception as exc:
        is_ready = False
        checks["storage"] = {"status": "error", "detail": str(exc)}

    # 3. Production Security Configuration Probe
    try:
        validate_production_security()
        checks["security"] = {"status": "ok", "environment": settings.app_env}
    except Exception as exc:
        is_ready = False
        checks["security"] = {"status": "error", "detail": str(exc)}

    status_code = 200 if is_ready else 503
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "ready" if is_ready else "unhealthy",
            "service": "rythusetu-backend",
            "checks": checks,
        }
    )


@app.get("/health/mandi")
def health_mandi():
    """Check mandi ingestion pipeline health."""
    from app.db import SessionLocal
    from app.models import MandiIngestionRun, MandiDailyPrice
    db = SessionLocal()
    try:
        latest_run = db.query(MandiIngestionRun).order_by(MandiIngestionRun.id.desc()).first()
        total_records = db.query(MandiDailyPrice).count()
        status = "healthy" if (latest_run and latest_run.status == "SUCCESS") else ("degraded" if latest_run else "uninitialized")
        return {
            "status": status,
            "pipeline": "Mandi Ingestion Service",
            "api_key_configured": bool(settings.data_gov_api_key),
            "total_records": total_records,
            "latest_run": {
                "id": latest_run.id if latest_run else None,
                "status": latest_run.status if latest_run else None,
                "source": latest_run.source if latest_run else None,
                "started_at": latest_run.started_at.isoformat() if latest_run and latest_run.started_at else None,
                "completed_at": latest_run.completed_at.isoformat() if latest_run and latest_run.completed_at else None,
                "records_inserted": latest_run.records_inserted if latest_run else 0,
                "records_updated": latest_run.records_updated if latest_run else 0,
                "error_message": latest_run.error_message if latest_run else None,
            } if latest_run else None,
        }
    except Exception as exc:
        return JSONResponse(status_code=503, content={"status": "error", "detail": str(exc)})
    finally:
        db.close()


@app.get("/health/weather")
def health_weather():
    """Check weather engine health by attempting a test fetch."""
    from app.weather_engine import get_climate_risk
    try:
        res = get_climate_risk(state="Telangana", district="Warangal", crop="Cotton", season="Kharif")
        has_weather = bool(res and "weather" in res)
        return {
            "status": "ok" if has_weather else "degraded",
            "provider": "Open-Meteo & IMD Agromet",
            "test_district": "Warangal",
            "telemetry_received": has_weather,
        }
    except Exception as exc:
        return {
            "status": "degraded",
            "provider": "Open-Meteo & IMD Agromet",
            "error": str(exc),
            "fallback_available": True,
        }


@app.get("/health/ai")
def health_ai():
    """Check AI assistant configuration status."""
    is_configured = bool(settings.openai_api_key)
    return {
        "status": "configured" if is_configured else "unconfigured",
        "provider": "OpenAI" if is_configured else "Deterministic Rule-based Guardrails",
        "model": settings.openai_model,
        "vision_model": "gpt-4o-mini",
        "is_live_ai_available": is_configured,
    }


@app.get(f"{settings.api_v1_prefix}/status")
def api_status() -> dict[str, str]:
    return {"service": "rythusetu-api", "version": "0.3.0", "status": "ready"}

