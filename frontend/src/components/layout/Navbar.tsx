import React, { useState } from "react";
import {
  Globe,
  Search,
  Bell,
  Play,
  BrainCircuit,
  Server,
  ChevronDown,
  Check,
  Menu,
} from "lucide-react";
import { Website } from "../../types";

interface NavbarProps {
  websites: Website[];
  selectedWebsite: Website;
  onSelectWebsite: (site: Website) => void;
  memoryConnected: boolean;
  apiConnected: boolean;
  onQuickAudit: () => void;
  onOpenMemory: () => void;
  onOpenMobileMenu?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  websites,
  selectedWebsite,
  onSelectWebsite,
  memoryConnected,
  apiConnected,
  onQuickAudit,
  onOpenMemory,
  onOpenMobileMenu,
  onOpenCommandPalette,
}) => {
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: "n-1",
      title: "Agent Validation Required",
      detail: "1 schema optimization patch ready for approval.",
      time: "5m ago",
      type: "alert",
    },
    {
      id: "n-2",
      title: "Hindsight Memory Synced",
      detail: "Reflected learning from experiment exp-882 retained.",
      time: "25m ago",
      type: "success",
    },
    {
      id: "n-3",
      title: "Daily Crawl Completed",
      detail: "All 1,420 pages indexed without 5xx errors.",
      time: "2h ago",
      type: "info",
    },
  ];

  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#090d16]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Mobile Menu Toggle, Website Selector & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Menu */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Website Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/[0.08] bg-slate-900/60 hover:bg-slate-800/60 hover:border-white/[0.15] text-xs font-medium text-slate-200 transition-colors"
          >
            <div className="w-5 h-5 rounded bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Globe className="w-3 h-3" />
            </div>
            <span className="font-semibold text-white truncate max-w-[100px] sm:max-w-[130px]">
              {selectedWebsite.domain}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {siteDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSiteDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#0c111d] shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
                  Select Workspace Domain
                </div>
                {websites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => {
                      onSelectWebsite(site);
                      setSiteDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-white/[0.04] transition-colors ${
                      site.id === selectedWebsite.id
                        ? "text-cyan-400 bg-cyan-950/20"
                        : "text-slate-300"
                    }`}
                  >
                    <div className="flex flex-col truncate">
                      <span className="font-medium text-slate-200">{site.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{site.domain}</span>
                    </div>
                    {site.id === selectedWebsite.id && (
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Global Search Bar (Triggers Command Palette) */}
        <div
          onClick={onOpenCommandPalette}
          className="relative flex-1 hidden sm:flex items-center cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors absolute left-3 top-1/2 transform -translate-y-1/2" />
          <div className="w-full bg-slate-900/40 border border-white/[0.08] group-hover:border-cyan-500/40 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-400 transition-all truncate">
            Search keywords, audit issues, memory, experiments...
          </div>
          <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono font-medium text-slate-500 border border-white/[0.08] bg-white/[0.02] px-1.5 py-0.5 rounded">
            ⌘K
          </div>
        </div>
      </div>

      {/* Right: Status Pills, Action Button, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend API status */}
        <div
          className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
            apiConnected
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-300 border-amber-500/20"
          }`}
          title={apiConnected ? "Backend API online at localhost:8000" : "Demo Mode (API offline)"}
        >
          <Server className="w-3 h-3" />
          <span>{apiConnected ? "API: Live" : "API: Demo"}</span>
        </div>

        {/* Hindsight Memory indicator */}
        <button
          onClick={onOpenMemory}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
            memoryConnected
              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              : "bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20"
          }`}
          title="Open Hindsight Memory Center"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          <span>{memoryConnected ? "Hindsight: Online" : "Hindsight: Standby"}</span>
        </button>

        {/* Quick Run Audit Button */}
        <button
          onClick={onQuickAudit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all border border-cyan-400/30 active:scale-95"
        >
          <Play className="w-3 h-3 fill-current" />
          <span className="hidden sm:inline">Run Audit</span>
          <span className="sm:hidden">Audit</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#0c111d] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-xs font-semibold text-white border-b border-white/[0.06] flex items-center justify-between">
                  <span>System Activity</span>
                  <span className="text-[10px] text-cyan-400 font-mono">3 new</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 hover:bg-white/[0.02] rounded-lg transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-200">{item.title}</span>
                        <span className="text-[10px] text-slate-500">{item.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar / Operator status */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-xs font-semibold text-cyan-300">
            OP
          </div>
        </div>
      </div>
    </header>
  );
};
