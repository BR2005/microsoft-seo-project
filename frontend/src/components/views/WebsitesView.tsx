import React, { useState } from "react";
import {
  Globe,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Layers,
} from "lucide-react";
import { GithubIcon } from "../common/Icons";
import { Header } from "../layout/Header";
import { Badge } from "../common/Badge";
import { Modal } from "../common/Modal";
import { Website } from "../../types";

interface WebsitesViewProps {
  websites: Website[];
  selectedWebsite: Website;
  onSelectWebsite: (site: Website) => void;
  onRunAuditForSite: (site: Website) => void;
  onAddWebsite: (site: { name: string; domain: string }) => void;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  websites,
  selectedWebsite,
  onSelectWebsite,
  onRunAuditForSite,
  onAddWebsite,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteDomain, setNewSiteDomain] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWebsites = websites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !newSiteDomain) return;
    onAddWebsite({ name: newSiteName, domain: newSiteDomain });
    setNewSiteName("");
    setNewSiteDomain("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Platform", "Websites"]}
        title="Website Management"
        description="Monitor domain health, telemetry connections, crawl indices, and trigger autonomous audits per workspace."
        badge={<Badge variant="neutral">{websites.length} Domains Active</Badge>}
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-500/20 border border-cyan-400/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Website</span>
          </button>
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter domains or websites..."
            className="w-full bg-[#0b0f19] border border-white/[0.08] focus:border-cyan-500/50 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Modern Website Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebsites.map((site) => {
          const isSelected = site.id === selectedWebsite.id;

          return (
            <div
              key={site.id}
              className={`rounded-xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/20"
                  : "bg-[#0b0f19]/70 border-white/[0.08] hover:border-white/[0.15] hover:bg-[#0d1322]"
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-300"
                          : "bg-slate-900 border-white/[0.08] text-slate-400"
                      }`}
                    >
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{site.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <span className="truncate">{site.domain}</span>
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cyan-400"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {site.healthScore}/100
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">Health</span>
                  </div>
                </div>

                {/* Status Badges & Telemetry */}
                <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 uppercase">GSC Status:</span>
                    <Badge variant={site.gscConnected ? "live" : "demo"} size="sm">
                      {site.gscConnected ? "Live" : "Demo"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                    <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-400 uppercase">GitHub:</span>
                    <Badge variant={site.githubConnected ? "live" : "demo"} size="sm">
                      {site.githubConnected ? "Sync" : "Ready"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 uppercase">Crawl Index:</span>
                    <span className="font-mono text-slate-300 text-[11px] font-medium">
                      {site.pagesCount.toLocaleString()} pages
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 uppercase">Trend:</span>
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold ${
                        site.trafficTrend >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {site.trafficTrend >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {site.trafficTrend >= 0 ? `+${site.trafficTrend}%` : `${site.trafficTrend}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectWebsite(site)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                      : "bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60 border border-white/[0.06]"
                  }`}
                >
                  {isSelected ? "Active Workspace" : "Select Workspace"}
                </button>

                <button
                  onClick={() => onRunAuditForSite(site)}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors active:scale-95"
                  title="Run Audit for this domain"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Audit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Website Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Connect New Website"
        description="Add a web property to your customer memory workspace for autonomous SEO monitoring."
      >
        <form onSubmit={handleCreateWebsite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Website Name
            </label>
            <input
              type="text"
              required
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="e.g. Acme Marketing Site"
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Domain / Hostname
            </label>
            <input
              type="text"
              required
              value={newSiteDomain}
              onChange={(e) => setNewSiteDomain(e.target.value)}
              placeholder="e.g. acme.com or store.acme.com"
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
            <span className="font-semibold block">Hindsight Memory Isolation</span>
            <p className="text-slate-400 text-[11px]">
              A dedicated <code className="text-cyan-300">website:{newSiteDomain || "domain"}</code> context bank will be initialized to retain all crawl experiments and prevent cross-domain contamination.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-colors shadow-sm"
            >
              Add Website
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
