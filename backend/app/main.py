from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .agents import approve_workflow, run_seo_workflow
from .integrations import IntegrationAdapters
from .memory import HindsightMemory
from .persistence import list_experiments, load_run, save_experiment

app = FastAPI(title="SEO-MIND API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WorkflowRequest(BaseModel):
    customer_id: str = Field(min_length=1)
    website_id: str = Field(min_length=1)
    query: str = Field(min_length=1)


class ApprovalRequest(BaseModel):
    approved: bool


class ExperimentRequest(BaseModel):
    name: str = Field(min_length=1)
    hypothesis: str = Field(min_length=1)
    website_id: str = Field(min_length=1)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/memory/status")
async def memory_status() -> dict[str, object]:
    result = await HindsightMemory().recall("system", "SEO-MIND connectivity check")
    return {
        "connected": result.available,
        "source": result.source,
        "bank_id": HindsightMemory().settings.hindsight_bank_id,
    }


@app.get("/api/integrations")
async def integrations() -> dict[str, list[dict[str, object]]]:
    return {"integrations": [item.__dict__ for item in await IntegrationAdapters().all("example.com")]}


@app.post("/api/workflows/audit")
async def audit(request: WorkflowRequest) -> dict[str, object]:
    return await run_seo_workflow(request.website_id, request.customer_id, request.query)


@app.post("/api/workflows/{run_id}/approval")
async def approval(run_id: str, request: ApprovalRequest) -> dict[str, object]:
    run = load_run(run_id)
    if not run:
        return {"error": "workflow_not_found"}
    if not request.approved:
        run["approval_required"] = True
        run["approval_status"] = "rejected"
        return run
    run["approval_status"] = "approved"
    return await approve_workflow(run)


@app.get("/api/experiments")
async def experiments() -> dict[str, list[dict[str, object]]]:
    return {"experiments": list_experiments()}


@app.post("/api/experiments")
async def create_experiment(request: ExperimentRequest) -> dict[str, object]:
    import uuid
    experiment = {"experiment_id": str(uuid.uuid4()), **request.model_dump(), "status": "proposed", "outcome": None}
    save_experiment(experiment)
    return experiment
