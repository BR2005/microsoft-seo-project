from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/seo_mind"
    groq_api_key: str | None = None
    hindsight_base_url: str | None = None
    gsc_access_token: str | None = None
    github_token: str | None = None
    pagespeed_api_key: str | None = None
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

