from dataclasses import dataclass
import json
from typing import Any

from hindsight_client import Hindsight
from hindsight_client_api.exceptions import ApiException

from .config import get_settings


@dataclass
class MemoryResult:
    available: bool
    source: str
    memories: list[dict[str, Any]]


class HindsightMemory:
    """Mandatory Retain/Recall/Reflect boundary with explicit unavailable state."""

    def __init__(self) -> None:
        self.settings = get_settings()

    def _client(self) -> Hindsight | None:
        if not self.settings.hindsight_base_url or not self.settings.hindsight_api_key:
            return None
        return Hindsight(
            base_url=self.settings.hindsight_base_url,
            api_key=self.settings.hindsight_api_key.get_secret_value(),
        )

    @staticmethod
    def _as_dict(value: Any) -> dict[str, Any]:
        if hasattr(value, "model_dump"):
            return value.model_dump()
        if hasattr(value, "dict"):
            return value.dict()
        if isinstance(value, dict):
            return value
        return {"value": value}

    @staticmethod
    async def _close(client: Hindsight) -> None:
        close = getattr(client, "aclose", None)
        if close is not None:
            await close()

    async def retain(self, context: str, content: dict[str, Any]) -> MemoryResult:
        client = self._client()
        if client is None:
            return MemoryResult(False, "unavailable", [])
        try:
            response = await client.aretain(
                bank_id=self.settings.hindsight_bank_id,
                content=json.dumps({"context": context, **content}, default=str),
            )
            return MemoryResult(True, "hindsight", [self._as_dict(response)])
        except (ApiException, OSError, TypeError, ValueError):
            return MemoryResult(False, "error", [])
        finally:
            await self._close(client)

    async def recall(self, context: str, query: str) -> MemoryResult:
        client = self._client()
        if client is None:
            return MemoryResult(False, "unavailable", [])
        try:
            response = await client.arecall(
                bank_id=self.settings.hindsight_bank_id,
                query=f"{context}: {query}",
            )
            results = getattr(response, "results", None) or []
            return MemoryResult(True, "hindsight", [self._as_dict(item) for item in results])
        except (ApiException, OSError, TypeError, ValueError):
            return MemoryResult(False, "error", [])
        finally:
            await self._close(client)

    async def reflect(self, context: str, prompt: str) -> MemoryResult:
        client = self._client()
        if client is None:
            return MemoryResult(False, "unavailable", [])
        try:
            response = await client.areflect(
                bank_id=self.settings.hindsight_bank_id,
                query=f"{context}: {prompt}",
            )
            return MemoryResult(True, "hindsight", [self._as_dict(response)])
        except (ApiException, OSError, TypeError, ValueError):
            return MemoryResult(False, "error", [])
        finally:
            await self._close(client)
