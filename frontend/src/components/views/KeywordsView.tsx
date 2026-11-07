import React, { useState } from "react";
import {
  KeyRound,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  ArrowUpRight,
  Bot,
} from "lucide-react";
import { Header } from "../layout/Header";
import { Badge } from "../common/Badge";
import { KEYWORDS_DATA } from "../../data/mockData";
import { KeywordData } from "../../types";

interface KeywordsViewProps {
  onDispatchAgentForKeyword?: (query: string) => void;
}

export const KeywordsView: React.FC<KeywordsViewProps> = ({ onDispatchAgentForKeyword }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<string>("all");

  const filteredKeywords = KEYWORDS_DATA.filter((k) => {
    const matchesSearch = k.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntent = selectedIntent === "all" || k.intent.toLowerCase() === selectedIntent.toLowerCase();
    return matchesSearch && matchesIntent;
  });

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Intelligence", "Keywords"]}
        title="Keyword Intelligence"
        description="Query attribution, search intent classification, position trajectory, and high-impact ranking opportunities."
        badge={<Badge variant="demo">Demo GSC Telemetry</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Tracked Queries: <strong className="text-white">{KEYWORDS_DATA.length}</strong>
            </span>
          </div>
        }
      />

      {/* Opportunity Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Striking Distance Opportunities
            </span>
            <Badge variant="cyan" size="sm">Position 4-10</Badge>
          </div>
          <p className="text-xs text-slate-400">
            3 keywords with over 20,000 monthly impressions sit on page 1 striking distance. On-page schema and internal links can lift them into Top 3.
          </p>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-950/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              High Commercial Intent
            </span>
            <Badge variant="live" size="sm">High Value</Badge>
          </div>
          <p className="text-xs text-slate-400">
            "autonomous seo agent" & "hindsight memory seo optimization" convert 3.2x higher than broad queries.
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              CTR Optimization Gap
            </span>
            <Badge variant="medium" size="sm">Actionable</Badge>
          </div>
          <p className="text-xs text-slate-400">
            "automated schema markup generator" has 38.9K impressions with only 3.31% CTR. Meta description rewrite recommended.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords or queries..."
            className="w-full bg-[#0b0f19] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-white/[0.06] text-xs">
            {["all", "Commercial", "Transactional", "Informational"].map((intent) => (
              <button
                key={intent}
                onClick={() => setSelectedIntent(intent)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  selectedIntent === intent
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {intent === "all" ? "All Intents" : intent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-5 py-3">Search Query</th>
                <th className="px-3 py-3">Intent</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Impressions</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3 text-right">Position</th>
                <th className="px-4 py-3 text-right">Rank Movement</th>
                <th className="px-4 py-3 text-center">Opportunity</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredKeywords.map((k) => {
                const rankDelta = k.previousPosition - k.position; // positive means moved up!
                const isRankImproved = rankDelta > 0;

                return (
                  <tr key={k.query} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-200">
                      <span className="font-mono text-cyan-300">{k.query}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-white/[0.06]">
                        {k.intent}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-white">
                      {k.clicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">
                      {k.impressions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-teal-400 font-semibold">
                      {k.ctr}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-amber-300 font-bold">
                      {k.position}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold ${
                          isRankImproved ? "text-emerald-400" : rankDelta < 0 ? "text-rose-400" : "text-slate-400"
                        }`}
                      >
                        {isRankImproved ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {rankDelta > 0 ? `+${rankDelta.toFixed(1)}` : rankDelta.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 font-mono font-bold text-[11px]">
                        <span>{k.opportunityScore}</span>
                        <span className="text-[9px] text-slate-400">/100</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {onDispatchAgentForKeyword && (
                        <button
                          onClick={() => onDispatchAgentForKeyword(k.query)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 border border-white/[0.08] hover:border-cyan-500/30 transition-colors text-[11px]"
                          title="Dispatch LangGraph agent to optimize query"
                        >
                          <Bot className="w-3 h-3 text-cyan-400" />
                          <span>Optimize</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

