from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.api import router as api_router
from app.voice_api import router as voice_router
from app.core.config import settings
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
    return {"status": "healthy", "service": "rythusetu-backend"}


@app.get(f"{settings.api_v1_prefix}/status")
def api_status() -> dict[str, str]:
    return {"service": "rythusetu-api", "version": "0.3.0", "status": "ready"}
