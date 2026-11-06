import { StrictMode, useState } from "react";
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
      setStatus(result.approval_required ? "Audit ready — human approval required" : "Audit complete");
    } catch {
      setStatus("Demo mode: start the API for live workflow results");
    }
  }

  return <main>
    <aside><div className="brand">SEO<span>-MIND</span></div><p className="muted">Autonomous SEO operations</p>
      {["Overview", "Audits", "Keywords", "Experiments", "Code changes"].map((item, index) => <div className={index === 0 ? "nav active" : "nav"} key={item}>{item}</div>)}
      <div className="context"><small>ACTIVE CONTEXT</small><strong>Acme / acme.com</strong><span>Customer + website memory isolated</span></div>
    </aside>
    <section className="content"><header><div><p className="eyebrow">OVERVIEW / NOV 07, 2026</p><h1>Good morning, operator.</h1><p className="muted">Make measurable SEO decisions with a human in the loop.</p></div><button className="ghost">Demo mode</button></header>
      <div className="grid">{cards.map(([label, value, note]) => <article className="card" key={label}><p className="muted">{label}</p><h2>{value}</h2><p className="note">{note}</p></article>)}</div>
      <article className="panel"><div className="panel-head"><div><p className="eyebrow">WORKFLOW ORCHESTRATOR</p><h2>Start an SEO investigation</h2></div><span className="status">{status}</span></div><textarea value={query} onChange={(event) => setQuery(event.target.value)} /><button className="primary" onClick={runAudit}>Run audit →</button><p className="hint">All proposed actions pause for human approval. Unconfigured integrations are labeled demo and produce no fabricated metrics.</p></article>
      {result && <article className="panel"><p className="eyebrow">WORKFLOW RESULT</p><h2>Approval queue</h2><p className="muted">Validated: {String(result.validated)} · Measured: {String(result.measured)} · Retention: {result.retention?.source}</p>{result.recommendations?.map((item: any, index: number) => <div className="row" key={index}><span>{item.type}</span><span>{item.detail}</span></div>)}</article>}
      <div className="split"><article className="panel"><p className="eyebrow">INTEGRATIONS</p><h2>Connection health</h2>{["Google Search Console", "GitHub", "PageSpeed Insights", "Hindsight memory"].map((item) => <div className="row" key={item}><span>{item}</span><span className="pill">Demo / unavailable</span></div>)}</article><article className="panel"><p className="eyebrow">ACTIVITY</p><h2>Approval queue</h2><p className="muted">No pending changes. Workflow outputs will appear here before execution.</p></article></div>
    </section>
  </main>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

