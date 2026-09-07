from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router
from app.voice_api import router as voice_router
from app.core.config import settings
from app.db import Base, engine
from app import models  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version="0.2.0",
    description="AI-powered farmer support platform for climate risk, crop loss, schemes, and benefit guidance.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(voice_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"name": "RythuSetu", "status": "running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.get(f"{settings.api_v1_prefix}/status")
def api_status() -> dict[str, str]:
    return {"service": "rythusetu-api", "version": "0.2.0", "status": "ready"}
