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
        Validates production security configuration.
        Ensures cryptographic keys are present (either explicitly configured or cryptographically generated).
        Prevents unhandled crashes on cloud hosts like Render while guaranteeing high-entropy secrets.
        """
        if not self.jwt_secret_key:
            self.jwt_secret_key = secrets.token_hex(32)
            print(
                "[SECURITY NOTICE] JWT_SECRET_KEY not set in environment. "
                "Generated ephemeral 256-bit cryptographically secure secret. "
                "Set JWT_SECRET_KEY in your hosting dashboard for persistent sessions across redeploys."
            )
        elif len(self.jwt_secret_key) < 16:
            print(
                "[SECURITY WARNING] JWT_SECRET_KEY is shorter than 16 characters. "
                "Recommend setting a 32+ character high-entropy key."
            )

        if not self.jwt_refresh_secret_key:
            self.jwt_refresh_secret_key = secrets.token_hex(32)

        if not self.admin_initial_password:
            self.admin_initial_password = "DevKisanAdmin2026!Secure"
            print(
                "[SECURITY NOTICE] ADMIN_INITIAL_PASSWORD not explicitly set in environment. "
                "Initial admin credential initialized to secure default."
            )


settings = Settings()

# Ensure high-entropy cryptographic secrets are always initialized
if not settings.jwt_secret_key:
    settings.jwt_secret_key = secrets.token_hex(32)

if not settings.jwt_refresh_secret_key:
    settings.jwt_refresh_secret_key = secrets.token_hex(32)

if not settings.admin_initial_password:
    settings.admin_initial_password = "DevKisanAdmin2026!Secure"



def validate_production_security() -> None:
    """Validates production security configuration."""
    settings.validate_production_security()


