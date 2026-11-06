from typing import Any

import httpx

from .config import get_settings


async def recommend_with_groq(prompt: str) -> dict[str, Any]:
    settings = get_settings()
    if not settings.groq_api_key:
        return {"available": False, "source": "unavailable", "text": ""}
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                },
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            return {"available": True, "source": "groq", "text": content}
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError):
        return {"available": False, "source": "error", "text": ""}
