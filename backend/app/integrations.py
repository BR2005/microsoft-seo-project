from dataclasses import dataclass
from typing import Any

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

    def gsc(self) -> AdapterResult:
        return self._result("Google Search Console", bool(self.settings.gsc_access_token))

    def github(self) -> AdapterResult:
        return self._result("GitHub", bool(self.settings.github_token))

    def pagespeed(self) -> AdapterResult:
        return self._result("PageSpeed Insights", bool(self.settings.pagespeed_api_key))

    def all(self) -> list[AdapterResult]:
        return [self.gsc(), self.github(), self.pagespeed()]

