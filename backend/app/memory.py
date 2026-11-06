from dataclasses import dataclass
from typing import Any

import httpx

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

    async def retain(self, context: str, content: dict[str, Any]) -> MemoryResult:
        if not self.settings.hindsight_base_url:
            return MemoryResult(False, "unavailable", [])
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(
                    f"{self.settings.hindsight_base_url.rstrip('/')}/retain",
                    json={"bank": context, "content": content},
                )
                response.raise_for_status()
                return MemoryResult(True, "hindsight", [response.json()])
        except (httpx.HTTPError, ValueError):
            return MemoryResult(False, "error", [])

    async def recall(self, context: str, query: str) -> MemoryResult:
        if not self.settings.hindsight_base_url:
            return MemoryResult(False, "unavailable", [])
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(
                    f"{self.settings.hindsight_base_url.rstrip('/')}/recall",
                    json={"bank": context, "query": query},
                )
                response.raise_for_status()
                payload = response.json()
                return MemoryResult(True, "hindsight", payload.get("memories", []))
        except (httpx.HTTPError, ValueError):
            return MemoryResult(False, "error", [])

    async def reflect(self, context: str, prompt: str) -> MemoryResult:
        if not self.settings.hindsight_base_url:
            return MemoryResult(False, "unavailable", [])
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(
                    f"{self.settings.hindsight_base_url.rstrip('/')}/reflect",
                    json={"bank": context, "prompt": prompt},
                )
                response.raise_for_status()
                return MemoryResult(True, "hindsight", [response.json()])
        except (httpx.HTTPError, ValueError):
            return MemoryResult(False, "error", [])

