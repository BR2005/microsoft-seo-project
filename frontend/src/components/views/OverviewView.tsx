import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  MousePointerClick,
  Eye,
  Percent,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Bot,
  BrainCircuit,
  Calendar,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Header } from "../layout/Header";
import { StatCard } from "../common/StatCard";
import { ScoreGauge } from "../common/ScoreGauge";
import { Badge } from "../common/Badge";
import { TRAFFIC_TREND_DATA, AUDIT_ISSUES, TOP_PAGES_DATA } from "../../data/mockData";
import { Integration, WorkflowState } from "../../types";

interface OverviewViewProps {
  onNavigate: (tab: any) => void;
  onRunAudit: () => void;
  integrations: Integration[];
  memoryConnected: boolean;
  activeRun: WorkflowState | null;
  domain: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onRunAudit,
  integrations,
  memoryConnected,
  activeRun,
  domain,
}) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [chartMetric, setChartMetric] = useState<"clicks" | "impressions" | "ctr" | "position">("clicks");

  // Determine if GSC is live or in demo mode
  const gsc = integrations.find((i) => i.name.toLowerCase().includes("search console"));
  const isGscLive = gsc?.status === "live";

  // Critical issues count
  const criticalCount = AUDIT_ISSUES.filter((i) => i.severity === "critical").length;

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Intelligence", "Overview"]}
        title="Overview Dashboard"
        description={`Real-time SEO performance metrics, autonomous agent health, and learning loop telemetry for ${domain}.`}
        badge={
          isGscLive ? (
            <Badge variant="live">GSC Live Telemetry</Badge>
          ) : (
            <Badge variant="demo">Demo Telemetry Mode</Badge>
          )
        }
        actions={
          <button
            onClick={onRunAudit}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all active:scale-95"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Launch LangGraph Audit</span>
          </button>
        }
      />

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Organic Clicks"
          value={isGscLive ? "—" : "18,420"}
          delta={{ value: 14.8, isPositiveGood: true }}
          icon={<MousePointerClick className="w-4 h-4" />}
          subtitle="Past 30 days vs previous period"
          isDemo={!isGscLive}
          highlight={true}
        />
        <StatCard
          title="Total Impressions"
          value={isGscLive ? "—" : "512.4K"}
          delta={{ value: 22.4, isPositiveGood: true }}
          icon={<Eye className="w-4 h-4" />}
          subtitle="Google search search appearance"
          isDemo={!isGscLive}
        />
        <StatCard
          title="Average CTR"
          value={isGscLive ? "—" : "3.59%"}
          delta={{ value: 0.4, isPositiveGood: true }}
          icon={<Percent className="w-4 h-4" />}
          subtitle="+0.4% after JSON-LD FAQ schema"
          isDemo={!isGscLive}
        />
        <StatCard
          title="Average Position"
          value={isGscLive ? "—" : "11.2"}
          delta={{ value: -1.8, isPositiveGood: false }} // position drop in number means improved rank
          icon={<Compass className="w-4 h-4" />}
          subtitle="Top 100 tracked keyword queries"
          isDemo={!isGscLive}
        />
      </div>

      {/* Main Visualizations: Traffic Trends & Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Traffic Performance Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Search Visibility Trends</h3>
                {!isGscLive && <Badge variant="demo" size="sm">Demo Telemetry</Badge>}
              </div>
              <p className="text-xs text-slate-400">
                Continuous Google Search Console impressions and click signals
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Metric Selectors */}
              <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-[11px]">
                <button
                  onClick={() => setChartMetric("clicks")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    chartMetric === "clicks"
                      ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Clicks
                </button>
                <button
                  onClick={() => setChartMetric("impressions")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    chartMetric === "impressions"
                      ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Impressions
                </button>
                <button
                  onClick={() => setChartMetric("ctr")}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    chartMetric === "ctr"
                      ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  CTR
                </button>
              </div>

              {/* Time Range Filter */}
              <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-[11px]">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-1 rounded-md uppercase font-mono ${
                      timeRange === range
                        ? "bg-white/10 text-white font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Chart Component */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={TRAFFIC_TREND_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                  tickFormatter={(val) =>
                    chartMetric === "impressions"
                      ? `${(val / 1000).toFixed(0)}k`
                      : chartMetric === "ctr"
                      ? `${val}%`
                      : val
                  }
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#090d16] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md text-xs">
                          <p className="font-semibold text-slate-300 mb-1">{label}</p>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span className="text-slate-400 capitalize">{chartMetric}:</span>
                            <span className="font-mono font-bold text-white">
                              {payload[0].value}
                              {chartMetric === "ctr" ? "%" : ""}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartMetric}
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cyanGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SEO Health Score & Breakdown */}
        <div className="flex flex-col gap-4">
          <ScoreGauge
            score={92}
            label="Domain SEO Health"
            size="lg"
            subScores={[
              { name: "Crawlability", score: 98 },
              { name: "Core Web Vitals", score: 86 },
              { name: "Schema & Metadata", score: 91 },
              { name: "Internal Linking", score: 93 },
            ]}
          />

          {/* Hindsight Memory Card */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Hindsight Memory Status
              </span>
              <Badge variant={memoryConnected ? "live" : "demo"} size="sm">
                {memoryConnected ? "Bank Active" : "Mock Connected"}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer and website memory banks are isolated. Previous experiment reflections are actively guiding agent proposals.
            </p>
            <button
              onClick={() => onNavigate("hindsight")}
              className="text-xs font-medium text-purple-300 hover:text-purple-200 flex items-center gap-1 transition-colors"
            >
              <span>Inspect Memory Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lower Row: AI Insights, Critical Issues, and Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI-Generated Strategic Insights */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Autonomous AI Insights</h3>
              </div>
              <Badge variant="cyan" size="sm">
                Real-time
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-white/[0.04] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Schema Rich Snippet Gap</span>
                  <span className="text-[10px] text-cyan-400 font-mono">+31% Est. Lift</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  42 product pages qualify for Google rich snippet markup. Automated pull request ready in Code Optimization.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-white/[0.04] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Mobile LCP Bottleneck</span>
                  <span className="text-[10px] text-amber-400 font-mono">1.2s delay</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Font swap and unoptimized hero images triggering mobile ranking drag on 65 URLs.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("code")}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-xs font-medium text-slate-200 transition-colors border border-white/[0.06]"
          >
            <span>Review Proposed Optimizations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Critical Issues & Health */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Technical Issues</h3>
              </div>
              <Badge variant="critical" size="sm">
                {criticalCount} Critical
              </Badge>
            </div>

            <div className="space-y-2.5">
              {AUDIT_ISSUES.slice(0, 3).map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/40 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div className="mt-0.5">
                    <Badge variant={issue.severity} size="sm">
                      {issue.severity}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{issue.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{issue.urlsAffected} URLs affected</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate("audit")}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-xs font-medium text-slate-200 transition-colors border border-white/[0.06]"
          >
            <span>Open Technical Audit ({AUDIT_ISSUES.length} Total)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Agent Activity & Execution Loop */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">LangGraph Agent Loop</h3>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Standing By
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.06] text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Last Executed Workflow:</span>
                  <span className="font-mono text-slate-300">
                    {activeRun ? activeRun.run_id.slice(0, 8) : "Audit-Sync-084"}
                  </span>
                </div>
                <div className="text-slate-300 font-medium text-xs truncate">
                  "{activeRun?.query || "Find technical SEO opportunities"}"
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04] text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Validation & Memory Recall passed</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-900/50 p-2 rounded-lg border border-white/[0.04]">
                  <span className="block text-[10px] text-slate-400 uppercase">Human Approval</span>
                  <span className="font-mono font-semibold text-cyan-300">Required</span>
                </div>
                <div className="bg-slate-900/50 p-2 rounded-lg border border-white/[0.04]">
                  <span className="block text-[10px] text-slate-400 uppercase">Memory Retention</span>
                  <span className="font-mono font-semibold text-purple-300">Active</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("agents")}
            className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 text-xs font-medium text-cyan-300 transition-colors border border-cyan-500/30"
          >
            <span>Open Agent Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

