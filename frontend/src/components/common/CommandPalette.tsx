import React, { useState, useEffect } from "react";
import {
  Search,
  LayoutDashboard,
  Globe,
  BarChart3,
  KeyRound,
  ShieldCheck,
  Bot,
  BrainCircuit,
  FileCode2,
  FlaskConical,
  Settings2,
  Play,
  ArrowRight,
  X,
} from "lucide-react";
import { NavTab } from "../../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onTriggerAudit: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerAudit,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or shortcut
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: "audit-trigger", label: "Launch Autonomous Audit", category: "Actions", icon: Play, action: () => { onTriggerAudit(); onClose(); } },
    { id: "overview", label: "Go to Overview Dashboard", category: "Navigation", icon: LayoutDashboard, action: () => { onNavigate("overview"); onClose(); } },
    { id: "agents", label: "Open Agent Command Center", category: "Navigation", icon: Bot, action: () => { onNavigate("agents"); onClose(); } },
    { id: "hindsight", label: "Inspect Hindsight Memory Bank", category: "Navigation", icon: BrainCircuit, action: () => { onNavigate("hindsight"); onClose(); } },
    { id: "code", label: "Review Code Optimization PRs", category: "Navigation", icon: FileCode2, action: () => { onNavigate("code"); onClose(); } },
    { id: "experiments", label: "View Experiments & Learning", category: "Navigation", icon: FlaskConical, action: () => { onNavigate("experiments"); onClose(); } },
    { id: "audit", label: "View Technical Audit Issues", category: "Navigation", icon: ShieldCheck, action: () => { onNavigate("audit"); onClose(); } },
    { id: "keywords", label: "Explore Keyword Opportunities", category: "Navigation", icon: KeyRound, action: () => { onNavigate("keywords"); onClose(); } },
    { id: "analytics", label: "Analyze Traffic Performance", category: "Navigation", icon: BarChart3, action: () => { onNavigate("analytics"); onClose(); } },
    { id: "websites", label: "Manage Connected Websites", category: "Navigation", icon: Globe, action: () => { onNavigate("websites"); onClose(); } },
    { id: "integrations", label: "Configure API Integrations", category: "Navigation", icon: Settings2, action: () => { onNavigate("integrations"); onClose(); } },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#0c111d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-slate-900/60">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search platform features..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/[0.04]">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or destinations found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-cyan-400">SEO-MIND Command Palette</span>
        </div>
      </div>
    </div>
  );
};

