import React, { useState } from "react";
import {
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Gauge,
  BrainCircuit,
  Cpu,
  Database,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Key,
} from "lucide-react";
import { GithubIcon } from "../common/Icons";
import { Header } from "../layout/Header";
import { Badge, BadgeVariant } from "../common/Badge";
import { Modal } from "../common/Modal";
import { Integration, MemoryStatus } from "../../types";

interface IntegrationsViewProps {
  integrations: Integration[];
  memoryStatus: MemoryStatus | null;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  integrations,
  memoryStatus,
}) => {
  const [selectedConfig, setSelectedConfig] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const integrationServices = [
    {
      id: "gsc",
      name: "Google Search Console",
      icon: Globe,
      status: integrations.find((i) => i.name.toLowerCase().includes("search console"))?.status || "demo",
      category: "Search Telemetry",
      description: "Direct telemetry ingestion for impressions, click performance, average position, and URL indexation status.",
      envVar: "GSC_ACCESS_TOKEN",
      docsUrl: "https://developers.google.com/webmaster-tools",
      instructions: "Generate an OAuth 2.0 access token with 'https://www.googleapis.com/auth/webmasters.readonly' scope.",
    },
    {
      id: "github",
      name: "GitHub Repository",
      icon: GithubIcon,
      status: integrations.find((i) => i.name.toLowerCase().includes("github"))?.status || "demo",
      category: "Code Automation",
      description: "Automated Git branch creation, pull request generation, and syntax diff verification for technical SEO patches.",
      envVar: "GITHUB_TOKEN",
      docsUrl: "https://github.com/settings/tokens",
      instructions: "Create a Personal Access Token (classic or fine-grained) with 'repo' scope to enable automated pull request publishing.",
    },
    {
      id: "pagespeed",
      name: "Google PageSpeed Insights",
      icon: Gauge,
      status: integrations.find((i) => i.name.toLowerCase().includes("pagespeed"))?.status || "demo",
      category: "Performance Audit",
      description: "Automated Core Web Vitals scoring for LCP, CLS, and INP metrics on mobile and desktop viewports.",
      envVar: "PAGESPEED_API_KEY",
      docsUrl: "https://developers.google.com/speed/docs/insights/v5/get-started",
      instructions: "Obtain an API key from Google Cloud Console with PageSpeed Insights API enabled.",
    },
    {
      id: "hindsight",
      name: "Hindsight Memory Network",
      icon: BrainCircuit,
      status: memoryStatus?.connected ? "live" : "configured",
      category: "Cognitive Memory",
      description: "Official Retain/Recall/Reflect memory layer retaining historical experiment results and informing agent actions.",
      envVar: "HINDSIGHT_API_KEY",
      docsUrl: "https://vectorize.io",
      instructions: "Set HINDSIGHT_BASE_URL, HINDSIGHT_API_KEY, and HINDSIGHT_BANK_ID to enable persistent memory retention.",
    },
    {
      id: "groq",
      name: "Groq LLaMA 3.1 Inference",
      icon: Cpu,
      status: "configured",
      category: "LLM Reasoning",
      description: "Ultra low-latency LLaMA 3.1 reasoning engine synthesizing search observations with past memory recollections.",
      envVar: "GROQ_API_KEY",
      docsUrl: "https://console.groq.com",
      instructions: "Obtain a free or enterprise API key from Groq Console for rapid reasoning execution.",
    },
    {
      id: "postgres",
      name: "PostgreSQL Persistence",
      icon: Database,
      status: "live",
      category: "Database Storage",
      description: "Long-term relational persistence for workflow run trajectories, audit reports, and proposed SEO experiments.",
      envVar: "DATABASE_URL",
      docsUrl: "https://www.postgresql.org",
      instructions: "Provide standard PostgreSQL connection string: postgresql://user:pass@host:5432/seo_mind.",
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={["SEO-MIND", "Configuration", "Integrations"]}
        title="Integrations & Infrastructure"
        description="Connect third-party search APIs, code repositories, memory banks, and model inference providers."
        badge={
          <Badge variant="cyan">
            {integrationServices.length} Connectors Managed
          </Badge>
        }
      />

      {/* Integration Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationServices.map((service) => {
          const Icon = service.icon;
          const statusVariant: BadgeVariant =
            service.status === "live"
              ? "live"
              : service.status === "configured"
              ? "configured"
              : service.status === "error"
              ? "error"
              : "demo";

          return (
            <div
              key={service.id}
              className="rounded-xl border border-white/[0.08] bg-[#0b0f19]/80 p-5 flex flex-col justify-between hover:border-white/[0.14] transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/[0.08] flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <Badge variant={statusVariant} size="sm">
                    {service.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/[0.04] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">Env Variable:</span>
                  <code className="text-[11px] font-mono text-cyan-300 font-semibold">
                    {service.envVar}
                  </code>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between gap-2">
                <a
                  href={service.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>API Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setSelectedConfig(service)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/[0.08] transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Guidance Modal */}
      {selectedConfig && (
        <Modal
          isOpen={Boolean(selectedConfig)}
          onClose={() => setSelectedConfig(null)}
          title={`Configure ${selectedConfig.name}`}
          description={selectedConfig.description}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
                Required Environment Variable
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-white/[0.08]">
                <code className="font-mono text-cyan-300 flex-1">{selectedConfig.envVar}</code>
                <button
                  onClick={() => copyToClipboard(selectedConfig.envVar, "env")}
                  className="text-slate-400 hover:text-white p-1"
                  title="Copy variable name"
                >
                  {copiedKey === "env" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 space-y-1.5 text-slate-300">
              <span className="font-semibold text-cyan-300 block">Setup Instructions:</span>
              <p className="leading-relaxed">{selectedConfig.instructions}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-white/[0.06] space-y-1 text-slate-400 text-[11px]">
              <span className="font-semibold text-white block">Backend Persistence Location:</span>
              <p>Add credentials to your local <code className="text-cyan-300 font-mono">backend/.env</code> file and restart the API server.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedConfig(null)}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
