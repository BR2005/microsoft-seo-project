import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Filter,
  CheckCircle2,
  Wrench,
  Bot,
  ExternalLink,
  ChevronDown,
  Layers,
} from "lucide-react";
import { Header } from "../layout/Header";
import { ScoreGauge } from "../common/ScoreGauge";
import { Badge, BadgeVariant } from "../common/Badge";
import { AUDIT_ISSUES } from "../../data/mockData";
import { AuditIssue } from "../../types";

interface AuditViewProps {
  onFixWithAgent: (issue: AuditIssue) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ onFixWithAgent }) => {
  const [issues, setIssues] = useState<AuditIssue[]>(AUDIT_ISSUES);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = selectedSeverity === "all" || issue.severity === selectedSeverity;
    const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
    return matchesSeverity && matchesCategory;
  });

  const toggleResolved = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, resolved: !i.resolved } : i))
    );
  };

  const counts = {
    critical: issues.filter((i) => i.severity === "critical" && !i.resolved).length,
    high: issues.filter((i) => i.severity === "high" && !i.resolved).length,
    medium: issues.filter((i) => i.severity === "medium" && !i.resolved).length,
    low: issues.filter((i) => i.severity === "low" && !i.resolved).length,
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Audits", "Technical SEO"]}
        title="Technical SEO Audit"
        description="Automated crawl assessment detecting indexing obstacles, schema omissions, Core Web Vitals degradation, and canonical conflicts."
        badge={<Badge variant="cyan">Deep Audit Ready</Badge>}
        actions={
          <button
            onClick={() => onFixWithAgent(issues[0])}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all active:scale-95"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Remediate All Critical Issues</span>
          </button>
        }
      />

      {/* Audit Score Summary Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreGauge
            score={88}
            label="Overall Technical Health Score"
            size="lg"
            subScores={[
              { name: "Crawl & Indexability", score: 96 },
              { name: "Structured Schema", score: 72 },
              { name: "Core Web Vitals", score: 84 },
              { name: "Canonicals & Redirects", score: 98 },
            ]}
          />
        </div>

        {/* Severity Count Summary */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Issue Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Pending action items categorized by impact</p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 flex flex-col">
                <span className="text-[10px] text-rose-300 font-semibold uppercase">Critical</span>
                <span className="text-xl font-bold font-mono text-rose-400">{counts.critical}</span>
              </div>
              <div className="p-3 rounded-lg bg-orange-950/20 border border-orange-500/20 flex flex-col">
                <span className="text-[10px] text-orange-300 font-semibold uppercase">High</span>
                <span className="text-xl font-bold font-mono text-orange-400">{counts.high}</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 flex flex-col">
                <span className="text-[10px] text-amber-300 font-semibold uppercase">Medium</span>
                <span className="text-xl font-bold font-mono text-amber-400">{counts.medium}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-white/[0.06] flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Low</span>
                <span className="text-xl font-bold font-mono text-slate-300">{counts.low}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Severity Tabs */}
        <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-xs w-full sm:w-auto">
          {["all", "critical", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                selectedSeverity === sev
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-xs">
          {["all", "Schema", "Technical", "Performance", "Content"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-white/10 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Issues List */}
      <div className="space-y-3">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className={`rounded-xl border p-5 transition-all duration-150 ${
              issue.resolved
                ? "bg-[#0b0f19]/40 border-white/[0.04] opacity-60"
                : "bg-[#0b0f19]/80 border-white/[0.08] hover:border-white/[0.14]"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant={issue.severity as BadgeVariant} size="sm">
                    {issue.severity}
                  </Badge>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-white/[0.06]">
                    {issue.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {issue.urlsAffected} URLs Affected
                  </span>
                  {issue.resolved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white">{issue.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{issue.description}</p>

                {/* Recommended Fix Box */}
                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs">
                  <span className="font-semibold text-cyan-300 block mb-0.5">
                    Recommended Fix:
                  </span>
                  <span className="text-slate-300">{issue.recommendation}</span>
                </div>
              </div>

              {/* Actions & Impact Score */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 uppercase">Impact:</span>
                  <span className="font-mono font-bold text-sm text-cyan-400">
                    {issue.impactScore}/100
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleResolved(issue.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.06] transition-colors"
                  >
                    {issue.resolved ? "Mark Open" : "Resolve"}
                  </button>

                  <button
                    onClick={() => onFixWithAgent(issue)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors active:scale-95 shadow-sm"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Dispatch Agent Fix</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

