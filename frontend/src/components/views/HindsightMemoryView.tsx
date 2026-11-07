import React, { useState } from "react";
import {
  BrainCircuit,
  Database,
  Search,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  History,
  Send,
  Layers,
} from "lucide-react";
import { Header } from "../layout/Header";
import { Badge } from "../common/Badge";
import { HINDSIGHT_MEMORIES } from "../../data/mockData";
import { MemoryRecord } from "../../types";

interface HindsightMemoryViewProps {
  memoryConnected: boolean;
  bankId?: string;
}

export const HindsightMemoryView: React.FC<HindsightMemoryViewProps> = ({
  memoryConnected,
  bankId = "seo-mind-memory",
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "reflect" | "retain" | "recall">("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const filteredMemories = HINDSIGHT_MEMORIES.filter((m) => {
    const matchesTab = activeTab === "all" || m.action === activeTab;
    const matchesSearch =
      m.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.details.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.context.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleRunRecallTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setIsQuerying(true);
    setTestResult(null);

    setTimeout(() => {
      setIsQuerying(false);
      // Simulate intelligent recall response based on Hindsight memories
      if (testQuery.toLowerCase().includes("title") || testQuery.toLowerCase().includes("pricing")) {
        setTestResult(
          `[Hindsight Recall Match: 96% Confidence]\nContext: website:acme.com / exp-650\nMemory: Meta title rewrite for /pricing reduced CTR by 12% in US market.\nAgent Policy: Block aggressive discount vocabulary ('Cheap SaaS') for commercial pages. Preserve technical reliability markers.`
        );
      } else if (testQuery.toLowerCase().includes("schema") || testQuery.toLowerCase().includes("faq") || testQuery.toLowerCase().includes("json")) {
        setTestResult(
          `[Hindsight Recall Match: 98% Confidence]\nContext: customer:acme-corp / exp-882\nMemory: JSON-LD FAQPage inclusion led to +31% SERP snippet CTR lift.\nAgent Policy: Prioritize automated JSON-LD SoftwareApplication & FAQ schemas on technical documentation.`
        );
      } else if (testQuery.toLowerCase().includes("font") || testQuery.toLowerCase().includes("lcp") || testQuery.toLowerCase().includes("mobile")) {
        setTestResult(
          `[Hindsight Recall Match: 91% Confidence]\nContext: customer:acme-corp / exp-791\nMemory: Preloading Inter Variable font reduced CLS from 0.18 to 0.02 and LCP from 2.9s to 1.7s.\nAgent Policy: Inject font preload directives into Next.js/Astro head layouts by default.`
        );
      } else {
        setTestResult(
          `[Hindsight Recall Match: 84% Confidence]\nContext: website:acme.com\nMemory: Continuous crawl budget optimization guidelines active. No negative historical penalties recorded for query '${testQuery}'. Safe to proceed with automated hypothesis testing.`
        );
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Core AI", "Hindsight Memory Center"]}
        title="Hindsight Memory Center"
        description="Persistent cognitive memory layer enabling autonomous agents to retain outcomes, recall prior experiments, and reflect on SEO heuristics across workspace contexts."
        badge={
          <Badge variant={memoryConnected ? "live" : "demo"}>
            {memoryConnected ? `Bank: ${bankId}` : "Demo Bank Active"}
          </Badge>
        }
      />

      {/* Standout Feature Highlight Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cognitive SEO Learning Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Why Hindsight Powers Better SEO Decisions
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traditional SEO tools provide static reports. SEO-MIND's <strong>Hindsight Memory</strong> forms an evolving neural memory bank that retains the results of every code patch and meta change, recalls relevant past mistakes before proposing modifications, and reflects on longitudinal search rankings.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.08]">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Memories</span>
              <span className="font-mono text-xl font-bold text-purple-400">128</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.08]">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Success Rate</span>
              <span className="font-mono text-xl font-bold text-emerald-400">82%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.08]">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Recall Match</span>
              <span className="font-mono text-xl font-bold text-cyan-400">94.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Influence: How Historical Experience Guides Recommendations */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Memory Influence Engine — How History Shapes Agent Proposals
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">3 Active Heuristics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Title Rewrite Heuristic (US Market)</span>
              <Badge variant="improved" size="sm">Prevented Penalty</Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Historical Memory:</strong> Experiment exp-650 on /pricing demonstrated that marketing phrases ('Cheap SaaS') caused a 12% CTR drop due to trust loss.
            </p>
            <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-start gap-2">
              <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
              <span><strong>Agent Action:</strong> The agent automatically rejects discount vocabulary in favor of technical reliability terminology.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Structured Data FAQ Booster</span>
              <Badge variant="improved" size="sm">+31% Confirmed CTR</Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Historical Memory:</strong> Experiment exp-882 showed adding 3-4 FAQ structured questions consistently produces Google rich search cards.
            </p>
            <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-start gap-2">
              <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
              <span><strong>Agent Action:</strong> Proposes automated JSON-LD schema injection as default fix for all high-intent technical guides.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Memory Recall Playground */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Test Hindsight Recall Retrieval</h3>
          </div>
          <span className="text-xs text-slate-400">Context: <code className="text-purple-300">website:acme.com</code></span>
        </div>

        <form onSubmit={handleRunRecallTest} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Query Hindsight memory bank (e.g. 'pricing title tag', 'schema faq', 'mobile font preload')..."
              className="flex-1 bg-[#070a12] border border-white/[0.1] focus:border-purple-500 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={isQuerying || !testQuery.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md border border-purple-400/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query Memory</span>
            </button>
          </div>
        </form>

        {testResult && (
          <div className="p-4 rounded-xl bg-[#070a12] border border-purple-500/30 text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-150">
            {testResult}
          </div>
        )}
      </div>

      {/* Memory Timeline & Filter Tabs */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Chronological Memory Bank</h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Input */}
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter memories..."
                className="bg-slate-900 border border-white/[0.08] rounded-md pl-7 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Action Tabs */}
            <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-xs">
              {(["all", "retain", "recall", "reflect"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md uppercase font-mono text-[11px] font-semibold transition-colors ${
                    activeTab === tab
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="divide-y divide-white/[0.04] p-2">
          {filteredMemories.map((mem) => {
            const badgeVariant =
              mem.action === "retain"
                ? "cyan"
                : mem.action === "reflect"
                ? "purple"
                : "neutral";

            return (
              <div
                key={mem.id}
                className="p-4 hover:bg-white/[0.02] rounded-xl transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full uppercase font-mono text-[10px] font-bold tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {mem.action}
                    </span>
                    <span className="font-mono text-cyan-400 font-medium">{mem.context}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-mono text-[11px]">{mem.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Confidence:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {(mem.confidence * 100).toFixed(0)}%
                    </span>
                    {mem.outcome && (
                      <Badge variant={mem.outcome === "improved" ? "improved" : "declined"} size="sm">
                        {mem.outcome}
                      </Badge>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white">{mem.summary}</h4>
                <p className="text-slate-400 leading-relaxed">{mem.details}</p>

                <div className="pt-1.5 flex items-start gap-2 text-[11px] text-purple-300 bg-purple-950/20 p-2 rounded-lg border border-purple-500/20">
                  <BrainCircuit className="w-3.5 h-3.5 shrink-0 mt-0.5 text-purple-400" />
                  <span><strong>Agent Influence:</strong> {mem.influence}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

