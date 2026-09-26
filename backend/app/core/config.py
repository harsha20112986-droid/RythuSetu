import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_SQLITE_URL = f"sqlite:///{(BASE_DIR / 'rythusetu.db').as_posix()}"


class Settings(BaseSettings):
    app_name: str = "RythuSetu API"
    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"
    
    # Database URL: uses DATABASE_URL if set, else defaults to local sqlite file
    database_url: str = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)
    
    # JWT Security Configuration
    jwt_secret_key: str = os.getenv(
        "JWT_SECRET_KEY",
        "rythusetu-sec-k9x7v2m4q8p1w5e3t6y8u0i2o4a6s8d0f1g3h5j7k9l1"
    )
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24  # 24 hours
    
    # Admin Bootstrap Credential (change via ADMIN_INITIAL_PASSWORD in production env)
    admin_initial_username: str = "admin"
    admin_initial_password: str = os.getenv("ADMIN_INITIAL_PASSWORD", "RythuOfficer@2026#Secure")
    
    # CORS: Allowed origins as comma-separated string
    allowed_origins: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://rythu-setu.vercel.app"
    )
    
    # Rate Limiting
    rate_limit_per_minute: int = 120
    auth_rate_limit_per_minute: int = 15
    
    # External APIs
    openai_api_key: str | None = None
    openai_model: str = "gpt-5.6-luna"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
