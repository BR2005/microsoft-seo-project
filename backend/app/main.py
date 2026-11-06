from fastapi import FastAPI
from pydantic import BaseModel, Field

from .agents import run_seo_workflow
from .integrations import IntegrationAdapters

app = FastAPI(title="SEO-MIND API", version="0.1.0")


class WorkflowRequest(BaseModel):
    customer_id: str = Field(min_length=1)
    website_id: str = Field(min_length=1)
    query: str = Field(min_length=1)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/integrations")
async def integrations() -> dict[str, list[dict[str, object]]]:
    return {"integrations": [item.__dict__ for item in await IntegrationAdapters().all("example.com")]}


@app.post("/api/workflows/audit")
async def audit(request: WorkflowRequest) -> dict[str, object]:
    return await run_seo_workflow(request.website_id, request.customer_id, request.query)

