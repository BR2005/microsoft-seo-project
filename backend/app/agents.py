import uuid
from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from .integrations import IntegrationAdapters
from .llm import recommend_with_groq
from .memory import HindsightMemory
from .persistence import save_run


class WorkflowState(TypedDict, total=False):
    run_id: str
    website_id: str
    customer_id: str
    query: str
    observations: list[dict[str, Any]]
    recommendations: list[dict[str, Any]]
    memory: dict[str, Any]
    approval_required: bool
    validated: bool
    measured: bool
    retention: dict[str, Any]
    persistence: dict[str, str]


async def monitor(state: WorkflowState) -> WorkflowState:
    results = await IntegrationAdapters().all(state["website_id"])
    state["observations"] = [{"source": item.name, "status": item.status, "data": item.data, "message": item.message} for item in results]
    return state


async def recall(state: WorkflowState) -> WorkflowState:
    memory = HindsightMemory()
    customer = await memory.recall(f"customer:{state['customer_id']}", state["query"])
    website = await memory.recall(f"website:{state['website_id']}", state["query"])
    state["memory"] = {
        "customer": {"available": customer.available, "source": customer.source, "memories": customer.memories},
        "website": {"available": website.available, "source": website.source, "memories": website.memories},
    }
    return state


async def recommend(state: WorkflowState) -> WorkflowState:
    memory = state["memory"]
    prompt = f"Query: {state['query']}\nCustomer memory: {memory['customer']['memories']}\nWebsite memory: {memory['website']['memories']}"
    model = await recommend_with_groq(prompt)
    if not model["available"]:
        state["recommendations"] = [{"type": "blocked", "detail": "Groq and Hindsight must be connected before recommendations can be generated."}]
    else:
        state["recommendations"] = [{"type": "memory-informed", "detail": model["text"], "source": model["source"]}]
    return state


async def validate(state: WorkflowState) -> WorkflowState:
    state["validated"] = bool(state.get("recommendations")) and all(item["status"] != "error" for item in state["observations"])
    state["approval_required"] = True
    return state


async def approve_and_measure(state: WorkflowState) -> WorkflowState:
    state["measured"] = False
    return state


async def retain(state: WorkflowState) -> WorkflowState:
    memory = HindsightMemory()
    result = await memory.retain(f"website:{state['website_id']}", {"run_id": state["run_id"], "recommendations": state["recommendations"]})
    state["retention"] = {"available": result.available, "source": result.source}
    state["persistence"] = save_run(dict(state))
    return state


def build_graph():
    graph = StateGraph(WorkflowState)
    graph.add_node("monitor", monitor)
    graph.add_node("recall", recall)
    graph.add_node("recommend", recommend)
    graph.add_node("validate", validate)
    graph.add_node("approve_and_measure", approve_and_measure)
    graph.add_node("retain", retain)
    graph.set_entry_point("monitor")
    graph.add_edge("monitor", "recall")
    graph.add_edge("recall", "recommend")
    graph.add_edge("recommend", "validate")
    graph.add_edge("validate", "approve_and_measure")
    graph.add_edge("approve_and_measure", "retain")
    graph.add_edge("retain", END)
    return graph.compile()


async def run_seo_workflow(website_id: str, customer_id: str, query: str) -> dict[str, Any]:
    result = await build_graph().ainvoke({
        "run_id": str(uuid.uuid4()),
        "website_id": website_id,
        "customer_id": customer_id,
        "query": query,
    })
    return result
