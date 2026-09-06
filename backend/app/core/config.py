from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RythuSetu API"
    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/rythusetu"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
