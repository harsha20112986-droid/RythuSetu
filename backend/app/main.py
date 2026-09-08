from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router
from app.voice_api import router as voice_router
from app.core.config import settings
from app.db import Base, engine
from app import models  # noqa: F401

Base.metadata.create_all(bind=engine)

def update_schema_columns():
    from sqlalchemy import text
    with engine.connect() as conn:
        try:
            result = conn.execute(text("PRAGMA table_info(user_accounts)")).fetchall()
            existing_cols = [row[1] for row in result]
            if "phone" not in existing_cols:
                conn.execute(text("ALTER TABLE user_accounts ADD COLUMN phone VARCHAR(40)"))
            if "last_login_at" not in existing_cols:
                conn.execute(text("ALTER TABLE user_accounts ADD COLUMN last_login_at DATETIME"))
            if "is_online" not in existing_cols:
                conn.execute(text("ALTER TABLE user_accounts ADD COLUMN is_online BOOLEAN DEFAULT 0"))
            conn.commit()
        except Exception as e:
            print("Schema update notice:", e)

update_schema_columns()

def ensure_default_admin():
    from app.db import SessionLocal
    from app.models import UserAccount

    db = SessionLocal()
    try:
        existing = db.query(UserAccount).filter(UserAccount.username == "admin").first()
        if not existing:
            admin_user = UserAccount(
                username="admin",
                password="admin123",
                name="Agriculture Extension Officer",
                role="admin",
                phone="+91 98480 12345",
                designation="Mandal Agriculture Officer (MAO)",
                district="Warangal",
                state="Telangana",
            )
            db.add(admin_user)
            db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

ensure_default_admin()

app = FastAPI(
    title=settings.app_name,
    version="0.2.0",
    description="AI-powered farmer support platform for climate risk, crop loss, schemes, and benefit guidance.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(voice_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "RythuSetu Backend API",
        "status": "running",
        "docs": "http://localhost:8000/docs",
        "frontend": "http://localhost:5173",
    }


@app.get("/api")
@app.get("/api/v1")
def api_info() -> dict:
    return {
        "service": "RythuSetu API",
        "version": "0.2.0",
        "status": "ready",
        "docs_url": "/docs",
        "endpoints": [
            "/api/v1/farmers",
            "/api/v1/schemes",
            "/api/v1/benefits/estimate",
            "/api/v1/climate/risk",
            "/api/v1/crop-loss",
            "/api/v1/assistant/chat",
        ],
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.get(f"{settings.api_v1_prefix}/status")
def api_status() -> dict[str, str]:
    return {"service": "rythusetu-api", "version": "0.2.0", "status": "ready"}

