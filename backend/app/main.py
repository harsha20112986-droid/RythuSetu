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


@app.get(f"{settings.api_v1_prefix}/status")
def api_status() -> dict[str, str]:
    return {"service": "rythusetu-api", "version": "0.3.0", "status": "ready"}

