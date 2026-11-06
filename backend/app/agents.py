from typing import Any, TypedDict

from .integrations import IntegrationAdapters
from .memory import HindsightMemory


class WorkflowState(TypedDict, total=False):
    website_id: str
    customer_id: str
    query: str
    observations: list[dict[str, Any]]
    recommendations: list[dict[str, Any]]
    memory_available: bool


async def run_seo_workflow(website_id: str, customer_id: str, query: str) -> dict[str, Any]:
    memory = HindsightMemory()
    adapters = IntegrationAdapters()
    customer_context = f"customer:{customer_id}"
    website_context = f"website:{website_id}"
    customer_memory = await memory.recall(customer_context, query)
    website_memory = await memory.recall(website_context, query)
    integrations = adapters.all()
    observations = [
        {"source": item.name, "status": item.status, "message": item.message}
        for item in integrations
    ]
    recommendations = []
    if customer_memory.available and website_memory.available:
        reflected = await memory.reflect(website_context, query)
        recommendations.append({"type": "memory-informed", "detail": reflected.memories})
    else:
        recommendations.append({
            "type": "blocked",
            "detail": "Connect Hindsight to generate memory-driven recommendations; no recommendation was inferred.",
        })
    return {
        "website_id": website_id,
        "customer_id": customer_id,
        "query": query,
        "observations": observations,
        "recommendations": recommendations,
        "memory": {
            "customer": {"available": customer_memory.available, "source": customer_memory.source},
            "website": {"available": website_memory.available, "source": website_memory.source},
        },
        "approval_required": True,
    }

