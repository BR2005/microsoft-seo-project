import React, { useState } from "react";
import {
  Bot,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Check,
  X,
  BrainCircuit,
  Terminal,
  ShieldCheck,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Header } from "../layout/Header";
import { Badge } from "../common/Badge";
import { WorkflowState } from "../../types";

interface AgentCommandCenterProps {
  activeRun: WorkflowState | null;
  isRunning: boolean;
  onRunAudit: (query: string) => Promise<void>;
  onApproveWorkflow: (approved: boolean) => Promise<void>;
  websiteId: string;
  customerId: string;
}

export const AgentCommandCenterView: React.FC<AgentCommandCenterProps> = ({
  activeRun,
  isRunning,
  onRunAudit,
  onApproveWorkflow,
  websiteId,
  customerId,
}) => {
  const [queryInput, setQueryInput] = useState(
    activeRun?.query || "Find technical SEO opportunities"
  );

  const presetQueries = [
    "Find technical SEO opportunities",
    "Inspect structured schema and rich snippet eligibility",
    "Audit Core Web Vitals mobile bottlenecks and font preload",
    "Detect duplicate canonical tags and redirect loops",
  ];

  const handleStartWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isRunning) return;
    await onRunAudit(queryInput);
  };

  // Determine current active node in the LangGraph agent graph
  let currentStep = 0;
  if (isRunning) {
    currentStep = 2; // in-flight
  } else if (activeRun) {
    if (activeRun.measured && activeRun.retention?.available) {
      currentStep = 6; // completed reflect & retain
    } else if (activeRun.approval_required && !activeRun.measured) {
      currentStep = 4; // paused at human approval
    } else {
      currentStep = 3; // validated
    }
  }

  const steps = [
    { id: "monitor", label: "Monitor", icon: Cpu, desc: "GSC & PageSpeed Telemetry" },
    { id: "recall", label: "Recall", icon: BrainCircuit, desc: "Hindsight Memory Retrieval" },
    { id: "recommend", label: "Recommend", icon: Sparkles, desc: "Groq LLaMA 3.1 Synthesis" },
    { id: "validate", label: "Validate", icon: ShieldCheck, desc: "Pre-condition Safety Verification" },
    { id: "approval", label: "Human Approval", icon: CheckCircle2, desc: "Operator Authorization Gate" },
    { id: "measure", label: "Measure", icon: Layers, desc: "Outcome Metric Verification" },
    { id: "reflect", label: "Reflect & Retain", icon: Database, desc: "Hindsight Memory Loop" },
  ];

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Operations", "Agent Command Center"]}
        title="Agent Command Center"
        description="Autonomous LangGraph multi-stage execution pipeline with strict human-in-the-loop authorization and Hindsight memory integration."
        badge={
          isRunning ? (
            <Badge variant="pending">Execution In Flight</Badge>
          ) : activeRun?.approval_required && !activeRun?.measured ? (
            <Badge variant="critical">Human Approval Required</Badge>
          ) : activeRun?.measured ? (
            <Badge variant="live">Workflow Retained & Measured</Badge>
          ) : (
            <Badge variant="neutral">Agent Ready</Badge>
          )
        }
      />

      {/* Visual LangGraph Pipeline Flow */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/80 p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">LangGraph Execution Topology</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Isolated Context: <span className="text-cyan-400 font-bold">customer:{customerId}</span> / <span className="text-blue-400 font-bold">website:{websiteId}</span>
          </span>
        </div>

        <div className="flex items-center justify-between min-w-[760px] gap-2 py-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isPending = idx > currentStep;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex-1 flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-cyan-950/40 border-cyan-400/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30"
                      : isCompleted
                      ? "bg-slate-900/60 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-950/40 border-white/[0.04] text-slate-500 opacity-60"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                      isCurrent
                        ? "bg-cyan-500 text-slate-950 font-bold animate-pulse"
                        : isCompleted
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-semibold ${isCurrent ? "text-cyan-300" : isCompleted ? "text-slate-200" : "text-slate-500"}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{step.desc}</span>
                </div>

                {idx < steps.length - 1 && (
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 ${
                      idx < currentStep ? "text-emerald-400" : "text-slate-700"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Interactive Workflow Runner Panel */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white">Trigger Agent Investigation</h3>
            <p className="text-xs text-slate-400">
              Dispatches multi-agent workflow: retrieves Search Console telemetry, queries Hindsight memory, synthesizes recommendations with Groq, and halts at human validation.
            </p>
          </div>
          {activeRun && (
            <span className="text-xs font-mono text-slate-400">
              Run ID: <span className="text-slate-200 font-semibold">{activeRun.run_id.slice(0, 12)}...</span>
            </span>
          )}
        </div>

        <form onSubmit={handleStartWorkflow} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Enter SEO investigation objective or problem query..."
              className="w-full bg-[#070a12] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Presets:</span>
              {presetQueries.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setQueryInput(preset)}
                  className="px-2.5 py-1 rounded-md text-[11px] bg-slate-900 border border-white/[0.06] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors truncate max-w-xs"
                >
                  {preset}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isRunning || !queryInput.trim()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 rounded-lg shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all active:scale-95"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Workflow</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Human Approval Gate (When Run Requires Approval) */}
      {activeRun && activeRun.approval_required && !activeRun.measured && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Human-in-the-Loop Approval Required
                </h3>
                <p className="text-xs text-slate-300">
                  The agent synthesized recommendations and validated pre-conditions. Review the proposed action before committing execution and retaining memories.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onApproveWorkflow(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 text-xs font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => onApproveWorkflow(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/30 text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Measure</span>
              </button>
            </div>
          </div>

          {activeRun.experiment && (
            <div className="p-3.5 rounded-lg bg-[#070a12] border border-white/[0.08] text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="uppercase text-[10px] font-semibold text-amber-400">Proposed Experiment</span>
                <span className="font-mono text-[10px]">{activeRun.experiment.experiment_id}</span>
              </div>
              <p className="text-white font-medium">{activeRun.experiment.hypothesis}</p>
              <p className="text-slate-400">{activeRun.experiment.proposed_change}</p>
            </div>
          )}
        </div>
      )}

      {/* Observations & LLM Recommendations */}
      {activeRun && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Adapter Observations */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Integration Observations</h3>
              </div>
              <Badge variant="cyan" size="sm">Stage 1: Monitor</Badge>
            </div>

            <div className="space-y-2">
              {activeRun.observations?.map((obs, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/40 border border-white/[0.04] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{obs.source}</span>
                    <Badge variant={obs.status === "live" ? "live" : obs.status === "configured" ? "configured" : "demo"} size="sm">
                      {obs.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-[11px]">{obs.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations & Memory Reflection */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Agent Synthesis & Learnings</h3>
              </div>
              <Badge variant="purple" size="sm">Stage 3 & 7</Badge>
            </div>

            <div className="space-y-2.5">
              {activeRun.recommendations?.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/40 border border-white/[0.04] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-300 uppercase text-[10px] tracking-wider">
                      {rec.type}
                    </span>
                    {rec.source && (
                      <span className="text-[10px] font-mono text-slate-400">
                        Source: {rec.source}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                    {typeof rec.detail === "string" ? rec.detail : JSON.stringify(rec.detail)}
                  </p>
                </div>
              ))}

              {activeRun.measured && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-300 font-semibold">
                    <span>Outcome Verified & Retained</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Outcome measured, reflection generated via Hindsight, and retained to memory bank {websiteId}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Terminal / Agent Execution Logs */}
      <div className="rounded-xl border border-white/[0.08] bg-[#070a12] overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Agent Execution Console</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>LangGraph: v0.1.0</span>
            <span>•</span>
            <span className="text-emerald-400">Node stream active</span>
          </div>
        </div>

        <div className="p-4 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-56 overflow-y-auto">
          <div className="text-slate-500">[2026-11-07 11:28:01] INFO  Agent orchestrator initialized. Target customer=demo-customer website=demo-site</div>
          <div className="text-cyan-400">[2026-11-07 11:28:02] RUN   StateGraph.set_entry_point("monitor") → invoking adapters (GSC, GitHub, PageSpeed)</div>
          <div className="text-slate-400">[2026-11-07 11:28:03] INFO  Monitor finished: 3 adapter observations captured</div>
          <div className="text-purple-400">[2026-11-07 11:28:04] RUN   HindsightMemory.recall("customer:demo-customer", "website:demo-site")</div>
          <div className="text-slate-400">[2026-11-07 11:28:05] INFO  Recall finished: memories retrieved from bank seo-mind-memory</div>
          <div className="text-cyan-400">[2026-11-07 11:28:06] RUN   recommend_with_groq() synthesized memory-informed actions</div>
          <div className="text-amber-400">[2026-11-07 11:28:07] WARN  Validate: approval_required=True. Pausing execution at human authorization gate</div>
          {activeRun?.measured && (
            <>
              <div className="text-emerald-400">[2026-11-07 11:28:40] OK    Human approval received. Triggering approve_and_measure()</div>
              <div className="text-purple-400">[2026-11-07 11:28:42] RUN   HindsightMemory.reflect() → generating learning loop synthesis</div>
              <div className="text-emerald-400">[2026-11-07 11:28:43] OK    HindsightMemory.retain() → memory stored into bank seo-mind-memory</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
