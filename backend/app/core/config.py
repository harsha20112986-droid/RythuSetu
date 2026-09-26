import os
import secrets
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_SQLITE_URL = f"sqlite:///{(BASE_DIR / 'rythusetu.db').as_posix()}"


class Settings(BaseSettings):
    app_name: str = "RythuSetu API"
    app_env: str = os.getenv("APP_ENV", "development")
    api_v1_prefix: str = "/api/v1"

    # Database URL: uses DATABASE_URL if set, else defaults to local sqlite file
    database_url: str = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

    # JWT Configuration: 30 minutes for access tokens, 7 days for refresh tokens
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "")
    jwt_refresh_secret_key: str = os.getenv("JWT_REFRESH_SECRET_KEY", "")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    jwt_refresh_token_expire_days: int = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # Admin Bootstrap Credential
    admin_initial_username: str = "admin"
    admin_initial_password: str = os.getenv("ADMIN_INITIAL_PASSWORD", "")

    # CORS: Allowed origins as comma-separated string
    allowed_origins: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://rythu-setu.vercel.app"
    )

    # Rate Limiting
    rate_limit_per_minute: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    auth_rate_limit_per_minute: int = int(os.getenv("AUTH_RATE_LIMIT_PER_MINUTE", "10"))
    ai_rate_limit_per_minute: int = int(os.getenv("AI_RATE_LIMIT_PER_MINUTE", "15"))

    # Redis (Optional in local dev, recommended in production)
    redis_url: str | None = os.getenv("REDIS_URL", None)

    # External APIs
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY", None)
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
    weather_api_key: str | None = os.getenv("WEATHER_API_KEY", None)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def is_production(self) -> bool:
        return self.app_env.strip().lower() in ("production", "prod")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def access_token_expire_minutes(self) -> int:
        return self.jwt_access_token_expire_minutes


    def validate_production_security(self) -> None:
        """
        Validates security configuration.
        In production (APP_ENV=production):
          - Missing or short JWT_SECRET_KEY (< 32 chars) strictly fails closed with RuntimeError.
          - Missing or short ADMIN_INITIAL_PASSWORD (< 10 chars) strictly fails closed with RuntimeError.
        In non-production (development, test):
          - Auto-generates high-entropy ephemeral 256-bit keys and safe defaults.
        """
        if self.is_production:
            if not self.jwt_secret_key or len(self.jwt_secret_key) < 32:
                raise RuntimeError(
                    "CRITICAL SECURITY CONFIGURATION ERROR: JWT_SECRET_KEY must be set in production "
                    "with a minimum length of 32 characters. Do not deploy without setting JWT_SECRET_KEY."
                )
            if not self.admin_initial_password or len(self.admin_initial_password) < 10:
                raise RuntimeError(
                    "CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_INITIAL_PASSWORD must be explicitly set "
                    "in production with a minimum length of 10 characters."
                )
            if not self.jwt_refresh_secret_key or len(self.jwt_refresh_secret_key) < 32:
                self.jwt_refresh_secret_key = secrets.token_hex(32)
        else:
            if not self.jwt_secret_key:
                self.jwt_secret_key = secrets.token_hex(32)
            if not self.jwt_refresh_secret_key:
                self.jwt_refresh_secret_key = secrets.token_hex(32)
            if not self.admin_initial_password:
                self.admin_initial_password = "DevKisanAdmin2026!Secure"


settings = Settings()
settings.validate_production_security()


if not settings.admin_initial_password:
    settings.admin_initial_password = "DevKisanAdmin2026!Secure"



def validate_production_security() -> None:
    """Validates production security configuration."""
    settings.validate_production_security()


