import React, { useState } from "react";
import {
  FileCode2,
  GitPullRequest,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  GitBranch,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Header } from "../layout/Header";
import { Badge } from "../common/Badge";
import { CODE_OPTIMIZATION_DIFFS } from "../../data/mockData";
import { CodeOptimizationDiff } from "../../types";

interface CodeOptimizationViewProps {
  onApproveDiff?: (diffId: string) => void;
  onRejectDiff?: (diffId: string) => void;
}

export const CodeOptimizationView: React.FC<CodeOptimizationViewProps> = ({
  onApproveDiff,
  onRejectDiff,
}) => {
  const [diffs, setDiffs] = useState<CodeOptimizationDiff[]>(CODE_OPTIMIZATION_DIFFS);
  const [selectedDiffId, setSelectedDiffId] = useState<string>(CODE_OPTIMIZATION_DIFFS[0].id);
  const [copied, setCopied] = useState(false);

  const selectedDiff = diffs.find((d) => d.id === selectedDiffId) || diffs[0];

  const handleApprove = (id: string) => {
    setDiffs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, approvalStatus: "approved", prStatus: "Approved" } : d
      )
    );
    if (onApproveDiff) onApproveDiff(id);
  };

  const handleReject = (id: string) => {
    setDiffs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, approvalStatus: "rejected", prStatus: "Draft" } : d
      )
    );
    if (onRejectDiff) onRejectDiff(id);
  };

  const copyProposedCode = () => {
    navigator.clipboard.writeText(selectedDiff.proposedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Optimization", "Code Changes"]}
        title="Automated Code Optimization"
        description="Inspect validated technical SEO patches, side-by-side syntax diffs, AI rationale explanations, and authorize pull request generation."
        badge={
          <Badge variant="pending">
            {diffs.filter((d) => d.approvalStatus === "pending").length} Pending Approval
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Diff Selection List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Proposed Pull Requests
          </h3>

          <div className="space-y-2">
            {diffs.map((d) => {
              const isSelected = d.id === selectedDiff.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDiffId(d.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "bg-[#0b0f19]/70 border-white/[0.06] hover:border-white/[0.12] hover:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {d.category}
                    </span>
                    <Badge
                      variant={
                        d.approvalStatus === "approved"
                          ? "approved"
                          : d.approvalStatus === "rejected"
                          ? "declined"
                          : "pending"
                      }
                      size="sm"
                    >
                      {d.approvalStatus}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate">{d.title}</h4>
                  <p className="text-[11px] text-slate-400 font-mono truncate mt-1">
                    {d.filePath}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Side-by-Side Diff Viewer & Authorization Panel */}
        <div className="lg:col-span-3 space-y-5">
          {/* PR Details & Authorization Bar */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">{selectedDiff.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                  <span>Target: {selectedDiff.filePath}</span>
                  <span>•</span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {selectedDiff.githubBranch}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedDiff.approvalStatus === "pending" ? (
                  <>
                    <button
                      onClick={() => handleReject(selectedDiff.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-white/[0.08] text-xs font-medium transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedDiff.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md border border-emerald-400/30 transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Create PR</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Approved for Release
                  </span>
                )}
              </div>
            </div>

            {/* AI Explanation & Validation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-500/20 space-y-1">
                <span className="font-semibold text-purple-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Hindsight Rationale
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedDiff.aiExplanation}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-white/[0.06] space-y-1">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Pre-condition Validation Check
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedDiff.validationMessage}</p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Diff Viewer */}
          <div className="rounded-xl border border-white/[0.08] bg-[#070a12] overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Original
                </span>
                <span className="text-slate-600">vs</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Proposed Patch
                </span>
              </div>

              <button
                onClick={copyProposedCode}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                title="Copy proposed code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] text-xs font-mono">
              {/* Original Code */}
              <div className="p-4 bg-rose-950/5 overflow-x-auto">
                <div className="text-[10px] text-rose-400 font-semibold uppercase mb-2">
                  Original Code
                </div>
                <pre className="text-slate-300 whitespace-pre leading-relaxed text-[11px]">
                  {selectedDiff.originalCode}
                </pre>
              </div>

              {/* Proposed Code */}
              <div className="p-4 bg-emerald-950/5 overflow-x-auto">
                <div className="text-[10px] text-emerald-400 font-semibold uppercase mb-2">
                  Proposed Patch (+Additions)
                </div>
                <pre className="text-emerald-300 whitespace-pre leading-relaxed text-[11px]">
                  {selectedDiff.proposedCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

