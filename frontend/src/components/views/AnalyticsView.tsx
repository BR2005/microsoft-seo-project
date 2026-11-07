import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  BarChart3,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
  Globe2,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Header } from "../layout/Header";
import { Badge } from "../common/Badge";
import { TRAFFIC_TREND_DATA, TOP_PAGES_DATA } from "../../data/mockData";

export const AnalyticsView: React.FC = () => {
  const [dateRange, setDateRange] = useState<"7d" | "28d" | "3m" | "12m">("28d");
  const [activeTab, setActiveTab] = useState<"top" | "declining">("top");

  // Device split
  const deviceData = [
    { name: "Desktop", share: 58, icon: Monitor, color: "bg-cyan-500" },
    { name: "Mobile", share: 38, icon: Smartphone, color: "bg-blue-500" },
    { name: "Tablet", share: 4, icon: Tablet, color: "bg-teal-500" },
  ];

  // Country split
  const countryData = [
    { country: "United States", clicks: "9.8K", share: 53 },
    { country: "United Kingdom", clicks: "2.4K", share: 13 },
    { country: "Germany", clicks: "1.9K", share: 10 },
    { country: "Canada", clicks: "1.5K", share: 8 },
    { country: "India", clicks: "1.2K", share: 7 },
  ];

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Intelligence", "Analytics"]}
        title="SEO Performance Analytics"
        description="Comprehensive search traffic telemetry, keyword attribution, ranking trajectory, and page-level conversions."
        badge={<Badge variant="demo">Demo Telemetry Benchmark</Badge>}
        actions={
          <div className="flex items-center gap-2 bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.08] text-xs">
            {(["7d", "28d", "3m", "12m"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 rounded-md font-mono uppercase transition-colors ${
                  dateRange === range
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        }
      />

      {/* Main Dual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organic Clicks & Impressions Area Chart */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">Clicks vs Impressions</h3>
              <p className="text-xs text-slate-400">Correlation trajectory over selected window</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Clicks
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Impressions (k)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#090d16] border border-white/10 rounded-lg p-3 shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-300">{label}</p>
                          <p className="text-cyan-400">Clicks: <span className="font-mono font-bold">{payload[0].value}</span></p>
                          {payload[1] && (
                            <p className="text-blue-400">Impressions: <span className="font-mono font-bold">{payload[1].value}</span></p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} fill="url(#clickGrad)" />
                <Area type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} fill="url(#impGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CTR & Average Position Bar/Line Chart */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">CTR & Position Dynamics</h3>
              <p className="text-xs text-slate-400">Higher CTR with lower position indicates SERP authority</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-teal-400">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> CTR (%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Avg Position
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRAFFIC_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#090d16] border border-white/10 rounded-lg p-3 shadow-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-300">{label}</p>
                          <p className="text-teal-400">CTR: <span className="font-mono font-bold">{payload[0].value}%</span></p>
                          {payload[1] && (
                            <p className="text-amber-400">Position: <span className="font-mono font-bold">{payload[1].value}</span></p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="ctr" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="position" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Breakdown: Device & Country Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Split */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Traffic by Device</h3>
          <p className="text-xs text-slate-400 mb-4">Mobile experience directly impacts crawl budget & rankings</p>

          <div className="space-y-3">
            {deviceData.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      {d.name}
                    </span>
                    <span className="font-mono font-semibold text-white">{d.share}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className={`${d.color} h-full rounded-full`} style={{ width: `${d.share}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-white">Top Geographies</h3>
            <span className="text-[11px] text-cyan-400 font-mono">Global CDN</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">International search visibility distribution</p>

          <div className="space-y-2.5">
            {countryData.map((c) => (
              <div key={c.country} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Globe2 className="w-3 h-3 text-slate-500" />
                  {c.country}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400">{c.clicks} clicks</span>
                  <span className="font-mono font-semibold text-cyan-300 w-8 text-right">{c.share}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pages Performance Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Page Performance Telemetry</h3>
            <p className="text-xs text-slate-400">Search impressions, CTR, and SERP position per URL slug</p>
          </div>

          <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-xs">
            <button
              onClick={() => setActiveTab("top")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === "top"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Top Performing
            </button>
            <button
              onClick={() => setActiveTab("declining")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === "declining"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Declining Pages
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-5 py-3">Page URL</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Impressions</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3 text-right">Avg Position</th>
                <th className="px-4 py-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {TOP_PAGES_DATA.map((page) => (
                <tr key={page.url} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-mono text-cyan-300 flex items-center gap-2 max-w-sm truncate">
                    <span className="truncate">{page.url}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-white">
                    {page.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">
                    {page.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-teal-400 font-semibold">
                    {page.ctr}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-amber-300 font-medium">
                    {page.position}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold ${
                        page.change >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {page.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {page.change >= 0 ? `+${page.change}` : page.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

