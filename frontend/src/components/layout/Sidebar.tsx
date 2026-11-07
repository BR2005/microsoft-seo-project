import React from "react";
import {
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
  ChevronLeft,
  ChevronRight,
  Database,
  Sparkles,
  X,
} from "lucide-react";
import { NavTab } from "../../types";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeDomain: string;
  memoryConnected: boolean;
  pendingApprovalsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  activeDomain,
  memoryConnected,
  pendingApprovalsCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: "overview" as NavTab, label: "Overview", icon: LayoutDashboard },
    { id: "websites" as NavTab, label: "Websites", icon: Globe },
    { id: "analytics" as NavTab, label: "SEO Analytics", icon: BarChart3 },
    { id: "keywords" as NavTab, label: "Keywords", icon: KeyRound },
    { id: "audit" as NavTab, label: "Technical Audit", icon: ShieldCheck },
    {
      id: "agents" as NavTab,
      label: "Agent Command",
      icon: Bot,
      badge: "LangGraph",
      badgeVariant: "cyan" as const,
    },
    {
      id: "hindsight" as NavTab,
      label: "Hindsight Memory",
      icon: BrainCircuit,
      badge: "Core AI",
      badgeVariant: "purple" as const,
    },
    {
      id: "code" as NavTab,
      label: "Code Optimization",
      icon: FileCode2,
      count: pendingApprovalsCount,
    },
    { id: "experiments" as NavTab, label: "Experiments", icon: FlaskConical },
    { id: "integrations" as NavTab, label: "Integrations", icon: Settings2 },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 flex flex-col border-r border-white/[0.08] bg-[#090d16] transition-all duration-300 ease-in-out shrink-0 select-none z-50 md:z-20 ${
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "md:w-[72px]" : "md:w-[260px]"}`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06]">
          {!collapsed || isMobileOpen ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1 font-mono">
                  SEO<span className="text-cyan-400 font-extrabold">-MIND</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider truncate uppercase font-medium">
                  Autonomous Intelligence
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className={`hidden md:block text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-white/[0.06] transition-colors ${
              collapsed ? "hidden" : "block"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav items */}
        <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-950/60 to-blue-950/40 text-cyan-300 border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                } ${collapsed && !isMobileOpen ? "justify-center px-0" : ""}`}
                title={collapsed && !isMobileOpen ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                />

                {(!collapsed || isMobileOpen) && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>

                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium tracking-wide ${
                          item.badgeVariant === "cyan"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {typeof item.count === "number" && item.count > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.count}
                      </span>
                    )}
                  </>
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Collapse button for mini mode */}
        {collapsed && !isMobileOpen && (
          <div className="p-2 border-t border-white/[0.06] flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active isolated memory context footer */}
        {(!collapsed || isMobileOpen) && (
          <div className="p-3 m-2 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-400" />
                Memory Isolation
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  memoryConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-200 truncate">{activeDomain}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {memoryConnected ? "Bank: seo-mind-memory" : "Memory: Offline / Demo"}
              </p>
            </div>

            <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500">
              <span>Customer + Site scope</span>
              <span className="font-mono text-cyan-400/80">Isolated</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
