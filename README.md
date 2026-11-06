# SEO-MIND MVP

SEO-MIND is a runnable, honest-by-default SEO operations dashboard. It combines a FastAPI service with a React/TypeScript/Tailwind dashboard, LangGraph-style workflow orchestration, and a Hindsight-compatible memory boundary.

## Run

### API

```powershell
cd "D:\Microsoft SEO project\backend"
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\uvicorn app.main:app --reload
```

### Dashboard

```powershell
cd "D:\Microsoft SEO project\frontend"
npm install
npm run dev
```

Set `GROQ_API_KEY`, `HINDSIGHT_BASE_URL`, `DATABASE_URL`, and integration credentials in `.env`. When credentials are absent, adapters return an explicit `demo` status and never invent external metrics. Hindsight remains a mandatory interface: the local fallback stores no fabricated memories and labels recommendations as unavailable when the service is not configured.

