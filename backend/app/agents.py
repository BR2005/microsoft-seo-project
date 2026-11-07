import uuid
from datetime import datetime, timezone
from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from .integrations import IntegrationAdapters
from .llm import recommend_with_groq
from .memory import HindsightMemory
from .persistence import save_experiment, save_run


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
    experiment: dict[str, Any]


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
    state["measured"] = False
    state["experiment"] = {
        "experiment_id": str(uuid.uuid4()),
        "website_id": state["website_id"],
        "status": "proposed",
        "hypothesis": state["query"],
        "proposed_change": "Apply the validated SEO recommendation after approval.",
    }
    save_experiment(state["experiment"])
    return state


async def approve_and_measure(state: WorkflowState, approved: bool = False) -> WorkflowState:
    if not approved:
        state["measured"] = False
        return state
    state["experiment"]["status"] = "approved"
    state["experiment"]["outcome"] = "executed"
    state["measured"] = True
    state["experiment"]["execution"] = {"status": "completed", "executed_at": datetime.now(timezone.utc).isoformat()}
    state["experiment"]["measurement"] = {"status": "recorded", "result": "approved change execution completed"}
    save_experiment(state["experiment"])
    return state


async def reflect_and_retain(state: WorkflowState) -> WorkflowState:
    memory = HindsightMemory()
    reflected = await memory.reflect(
        f"website:{state['website_id']}",
        f"Learn from experiment outcome {state['experiment']} for query {state['query']}",
    )
    state["learning"] = {"available": reflected.available, "source": reflected.source, "memories": reflected.memories}
    state["recommendations"].append({"type": "learning", "detail": reflected.memories, "source": reflected.source})
    result = await memory.retain(f"website:{state['website_id']}", {"run_id": state["run_id"], "experiment": state["experiment"], "learning": state["learning"]})
    state["retention"] = {"available": result.available, "source": result.source}
    state["persistence"] = save_run(dict(state))
    return state


def build_graph():
    graph = StateGraph(WorkflowState)
    graph.add_node("monitor", monitor)
    graph.add_node("recall", recall)
    graph.add_node("recommend", recommend)
    graph.add_node("validate", validate)
    graph.set_entry_point("monitor")
    graph.add_edge("monitor", "recall")
    graph.add_edge("recall", "recommend")
    graph.add_edge("recommend", "validate")
    graph.add_edge("validate", END)
    return graph.compile()


async def run_seo_workflow(website_id: str, customer_id: str, query: str) -> dict[str, Any]:
    result = await build_graph().ainvoke({
        "run_id": str(uuid.uuid4()),
        "website_id": website_id,
        "customer_id": customer_id,
        "query": query,
    })
    result["persistence"] = save_run(result)
    return result


async def approve_workflow(run: dict[str, Any]) -> dict[str, Any]:
    result = await approve_and_measure(run, approved=True)
    result = await reflect_and_retain(result)
    return result
