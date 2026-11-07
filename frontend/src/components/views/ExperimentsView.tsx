import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  FlaskConical,
  Plus,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BrainCircuit,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
} from "lucide-react";
import { Header } from "../layout/Header";
import { Badge, BadgeVariant } from "../common/Badge";
import { Modal } from "../common/Modal";
import { BENCHMARK_EXPERIMENTS } from "../../data/mockData";
import { Experiment } from "../../types";

interface ExperimentsViewProps {
  experiments: Experiment[];
  onCreateExperiment: (data: { name: string; hypothesis: string; website_id: string }) => Promise<void>;
  websiteId: string;
}

export const ExperimentsView: React.FC<ExperimentsViewProps> = ({
  experiments,
  onCreateExperiment,
  websiteId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine live backend experiments with benchmark history
  const allExperiments = [...experiments, ...BENCHMARK_EXPERIMENTS];

  const filteredExperiments = allExperiments.filter((exp) => {
    if (filterStatus === "all") return true;
    return exp.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hypothesis) return;
    setIsSubmitting(true);
    try {
      await onCreateExperiment({
        name,
        hypothesis,
        website_id: websiteId,
      });
      setName("");
      setHypothesis("");
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recharts benchmark comparison data
  const chartData = [
    { name: "exp-882 (Schema)", baseline: 3.2, measured: 4.8, lift: "+50%" },
    { name: "exp-791 (Fonts)", baseline: 2.9, measured: 1.7, lift: "+41%" },
    { name: "exp-650 (Title)", baseline: 14.2, measured: 12.5, lift: "-12%" },
  ];

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Learning Loop", "Experiments"]}
        title="SEO Experiments & Learning"
        description="Controlled SEO experimentation framework measuring baseline versus observed search metrics to synthesize durable Hindsight heuristics."
        badge={
          <Badge variant="cyan">
            {allExperiments.length} Total Experiments Recorded
          </Badge>
        }
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Propose New Experiment</span>
          </button>
        }
      />

      {/* Lift Visualizer Recharts */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Baseline vs Measured Outcome Comparison
            </h3>
            <p className="text-xs text-slate-400">
              Controlled metric tracking verifies if changes improved or degraded search appearance
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Baseline
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Measured Result
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#090d16] border border-white/10 rounded-lg p-3 shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-slate-300">{label}</p>
                        <p className="text-slate-400">Baseline: <span className="font-mono text-white">{payload[0].value}</span></p>
                        {payload[1] && (
                          <p className="text-cyan-400">Measured: <span className="font-mono text-white font-bold">{payload[1].value}</span></p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="baseline" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="measured" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-xs">
          {["all", "improved", "declined", "proposed", "approved"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                filterStatus === status
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Experiments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiments.map((exp) => (
          <div
            key={exp.experiment_id}
            className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/80 p-5 flex flex-col justify-between hover:border-white/[0.14] transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={exp.status as BadgeVariant} size="sm">
                  {exp.status}
                </Badge>
                <span className="text-[10px] font-mono text-slate-500 truncate">
                  {exp.experiment_id}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  {exp.name || exp.hypothesis}
                </h4>
                {exp.proposed_change && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {exp.proposed_change}
                  </p>
                )}
              </div>

              {/* Baseline vs Measured Delta */}
              {exp.baseline_metric && exp.measured_metric && (
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-950/60 border border-white/[0.04] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Baseline</span>
                    <span className="font-mono font-semibold text-slate-300">
                      {exp.baseline_metric.value} {exp.baseline_metric.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Measured</span>
                    <span className="font-mono font-bold text-cyan-300 flex items-center gap-1">
                      {exp.measured_metric.value} {exp.measured_metric.unit}
                      {exp.measured_metric.lift_pct !== undefined && (
                        <span
                          className={`text-[10px] ${
                            exp.measured_metric.lift_pct >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          ({exp.measured_metric.lift_pct > 0 ? "+" : ""}
                          {exp.measured_metric.lift_pct}%)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Hindsight Learning Insight */}
              {exp.learning_insight && (
                <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 space-y-0.5">
                  <span className="font-semibold flex items-center gap-1 text-[10px] uppercase text-purple-400">
                    <BrainCircuit className="w-3 h-3" />
                    Hindsight Retention:
                  </span>
                  <p className="text-slate-300">{exp.learning_insight}</p>
                </div>
              )}
            </div>

            {/* Footer with date & outcome */}
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500">
              <span>Target: {exp.website_id}</span>
              <span className="capitalize">{exp.outcome || "Pending observation"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Propose Experiment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Propose SEO Experiment"
        description="Register a controlled experiment to track before/after organic rankings and reflect learnings into Hindsight."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Experiment Title
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Author Schema & Social Link Enrichment"
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Hypothesis & Expected Outcome
            </label>
            <textarea
              rows={3}
              required
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="e.g. Adding Person and SameAs schema to author bylines will improve E-E-A-T signals and lift average blog ranking position by +1.5 positions."
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300">
            <strong>Target Workspace:</strong> <code className="text-white">{websiteId}</code>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Register Experiment"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

