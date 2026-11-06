from dataclasses import dataclass
from typing import Any

import httpx

from .config import get_settings


@dataclass
class AdapterResult:
    name: str
    status: str
    data: dict[str, Any]
    message: str


class IntegrationAdapters:
    def __init__(self) -> None:
        self.settings = get_settings()

    def _result(self, name: str, configured: bool, data: dict[str, Any] | None = None) -> AdapterResult:
        if configured:
            return AdapterResult(name, "configured", data or {}, "Credentials configured; live client wiring is ready.")
        return AdapterResult(name, "demo", {}, "Demo mode: credentials are not configured, so no external metrics were fabricated.")

    async def gsc(self, website_id: str) -> AdapterResult:
        if not self.settings.gsc_access_token:
            return self._result("Google Search Console", False)
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"https://searchconsole.googleapis.com/webmasters/v3/sites/{website_id}",
                    headers={"Authorization": f"Bearer {self.settings.gsc_access_token}"},
                )
                response.raise_for_status()
                return AdapterResult("Google Search Console", "live", response.json(), "Live site metadata fetched.")
        except (httpx.HTTPError, ValueError):
            return AdapterResult("Google Search Console", "error", {}, "Configured, but the live API is unavailable.")

    async def github(self, website_id: str) -> AdapterResult:
        if not self.settings.github_token:
            return self._result("GitHub", False)
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"https://api.github.com/repos/{website_id}",
                    headers={"Authorization": f"Bearer {self.settings.github_token}"},
                )
                response.raise_for_status()
                return AdapterResult("GitHub", "live", response.json(), "Live repository metadata fetched.")
        except (httpx.HTTPError, ValueError):
            return AdapterResult("GitHub", "error", {}, "Configured, but the live API is unavailable.")

    async def pagespeed(self, website_id: str) -> AdapterResult:
        if not self.settings.pagespeed_api_key:
            return self._result("PageSpeed Insights", False)
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.get(
                    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
                    params={"url": website_id, "key": self.settings.pagespeed_api_key},
                )
                response.raise_for_status()
                return AdapterResult("PageSpeed Insights", "live", response.json(), "Live performance audit fetched.")
        except (httpx.HTTPError, ValueError):
            return AdapterResult("PageSpeed Insights", "error", {}, "Configured, but the live API is unavailable.")

    async def all(self, website_id: str) -> list[AdapterResult]:
        return [await self.gsc(website_id), await self.github(website_id), await self.pagespeed(website_id)]

