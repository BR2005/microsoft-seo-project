import asyncio
import json
import unittest
from unittest.mock import AsyncMock, patch

from app.memory import HindsightMemory


class FakeSettings:
    hindsight_base_url = "https://hindsight.example"
    hindsight_api_key = type("Secret", (), {"get_secret_value": lambda self: "test-key"})()
    hindsight_bank_id = "seo-mind-memory"


class FakeResponse:
    def __init__(self, **values):
        self.__dict__.update(values)

    def model_dump(self):
        return self.__dict__


class MemoryOperationsTests(unittest.IsolatedAsyncioTestCase):
    async def test_retain_uses_configured_bank_and_api_key(self):
        client = type("Client", (), {})()
        client.aretain = AsyncMock(return_value=FakeResponse(id="memory-1"))

        with patch("app.memory.get_settings", return_value=FakeSettings()), patch(
            "app.memory.Hindsight", return_value=client
        ) as hindsight:
            result = await HindsightMemory().retain("website:example.com", {"outcome": "improved"})

        hindsight.assert_called_once_with(base_url="https://hindsight.example", api_key="test-key")
        client.aretain.assert_awaited_once_with(
            bank_id="seo-mind-memory",
            content=json.dumps({"context": "website:example.com", "outcome": "improved"}),
        )
        self.assertTrue(result.available)
        self.assertEqual(result.memories[0]["id"], "memory-1")

    async def test_recall_and_reflect_use_official_async_operations(self):
        client = type("Client", (), {})()
        client.arecall = AsyncMock(return_value=FakeResponse(results=[FakeResponse(text="SEO improved")]))
        client.areflect = AsyncMock(return_value=FakeResponse(text="Keep the change"))

        with patch("app.memory.get_settings", return_value=FakeSettings()), patch(
            "app.memory.Hindsight", return_value=client
        ):
            memory = HindsightMemory()
            recalled = await memory.recall("website:example.com", "technical SEO")
            reflected = await memory.reflect("website:example.com", "Assess the outcome")

        client.arecall.assert_awaited_once_with(
            bank_id="seo-mind-memory",
            query="website:example.com: technical SEO",
        )
        client.areflect.assert_awaited_once_with(
            bank_id="seo-mind-memory",
            query="website:example.com: Assess the outcome",
        )
        self.assertEqual(recalled.memories[0]["text"], "SEO improved")
        self.assertEqual(reflected.memories[0]["text"], "Keep the change")

    async def test_missing_configuration_is_explicitly_unavailable(self):
        settings = FakeSettings()
        settings.hindsight_api_key = None
        with patch("app.memory.get_settings", return_value=settings):
            result = await HindsightMemory().retain("website:example.com", {"outcome": "unknown"})
        self.assertEqual((result.available, result.source), (False, "unavailable"))


if __name__ == "__main__":
    asyncio.run(unittest.main())
