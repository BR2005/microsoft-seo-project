import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const cards = [
  ["Organic visibility", "—", "Live GSC data unavailable"],
  ["Technical issues", "—", "Run an audit to inspect"],
  ["Memory confidence", "0%", "Hindsight not connected"],
];

function App() {
  const [query, setQuery] = useState("Find technical SEO opportunities");
  const [status, setStatus] = useState("Ready for an approved audit");
  const [result, setResult] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<any[]>([]);
  useEffect(() => { void loadStatus(); }, []);

  async function loadStatus() {
    try {
      const [integrationResponse, experimentResponse] = await Promise.all([
        fetch("http://localhost:8000/api/integrations"),
        fetch("http://localhost:8000/api/experiments"),
      ]);
      setIntegrations((await integrationResponse.json()).integrations);
      setExperiments((await experimentResponse.json()).experiments);
    } catch { setIntegrations([]); }
  }

  async function runAudit() {
    setStatus("Running audit...");
    try {
      const response = await fetch("http://localhost:8000/api/workflows/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: "demo-customer", website_id: "demo-site", query }),
      });
      if (!response.ok) throw new Error("API unavailable");
      const result = await response.json();
      setResult(result);
      await loadStatus();
      setStatus(result.approval_required ? "Audit ready — human approval required" : "Audit complete");
    } catch {
      setStatus("Demo mode: start the API for live workflow results");
    }

  }

  async function approve() {
    if (!result) return;
    const response = await fetch(`http://localhost:8000/api/workflows/${result.run_id}/approval`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: true }) });
    setResult(await response.json());
    setStatus("Approved, measured, reflected, and retained");
  }

  return <main>
    <aside><div className="brand">SEO<span>-MIND</span></div><p className="muted">Autonomous SEO operations</p>
      {["Overview", "Audits", "Keywords", "Experiments", "Code changes"].map((item, index) => <div className={index === 0 ? "nav active" : "nav"} key={item}>{item}</div>)}
      <div className="context"><small>ACTIVE CONTEXT</small><strong>Acme / acme.com</strong><span>Customer + website memory isolated</span></div>
    </aside>
    <section className="content"><header><div><p className="eyebrow">OVERVIEW / NOV 07, 2026</p><h1>Good morning, operator.</h1><p className="muted">Make measurable SEO decisions with a human in the loop.</p></div><button className="ghost">Demo mode</button></header>
      <div className="grid">{cards.map(([label, value, note]) => <article className="card" key={label}><p className="muted">{label}</p><h2>{value}</h2><p className="note">{note}</p></article>)}</div>
      <article className="panel"><div className="panel-head"><div><p className="eyebrow">WORKFLOW ORCHESTRATOR</p><h2>Start an SEO investigation</h2></div><span className="status">{status}</span></div><textarea value={query} onChange={(event) => setQuery(event.target.value)} /><button className="primary" onClick={runAudit}>Run audit →</button><p className="hint">All proposed actions pause for human approval. Unconfigured integrations are labeled demo and produce no fabricated metrics.</p></article>
      {result && <article className="panel"><p className="eyebrow">WORKFLOW RESULT</p><h2>Approval queue</h2><p className="muted">Validated: {String(result.validated)} · Measured: {String(result.measured)} · Retention: {result.retention?.source ?? "blocked"} · Reflect: {result.learning?.source ?? "pending"}</p>{result.approval_required && !result.measured && <button className="primary" onClick={approve}>Approve proposed change</button>}{result.recommendations?.map((item: any, index: number) => <div className="row" key={index}><span>{item.type}</span><span>{String(item.detail)}</span></div>)}</article>}
      <div className="split"><article className="panel"><p className="eyebrow">INTEGRATIONS</p><h2>Connection health</h2>{integrations.map((item) => <div className="row" key={item.name}><span>{item.name}</span><span className="pill">{item.status}</span></div>)}</article><article className="panel"><p className="eyebrow">EXPERIMENTS</p><h2>Learning loop</h2>{experiments.length ? experiments.map((item) => <div className="row" key={item.experiment_id}><span>{item.name}</span><span className="pill">{item.status}</span></div>) : <p className="muted">No experiments proposed.</p>}</article></div>
    </section>
  </main>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

