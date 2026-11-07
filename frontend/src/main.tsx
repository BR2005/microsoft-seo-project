import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { ToastContainer, ToastMessage } from "./components/common/Toast";
import { CommandPalette } from "./components/common/CommandPalette";
import { OverviewView } from "./components/views/OverviewView";
import { WebsitesView } from "./components/views/WebsitesView";
import { AnalyticsView } from "./components/views/AnalyticsView";
import { KeywordsView } from "./components/views/KeywordsView";
import { AuditView } from "./components/views/AuditView";
import { AgentCommandCenterView } from "./components/views/AgentCommandCenterView";
import { HindsightMemoryView } from "./components/views/HindsightMemoryView";
import { CodeOptimizationView } from "./components/views/CodeOptimizationView";
import { ExperimentsView } from "./components/views/ExperimentsView";
import { IntegrationsView } from "./components/views/IntegrationsView";
import { ApiService } from "./services/api";
import { SAMPLE_WEBSITES } from "./data/mockData";
import {
  AuditIssue,
  Experiment,
  Integration,
  MemoryStatus,
  NavTab,
  Website,
  WorkflowState,
} from "./types";

function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [websites, setWebsites] = useState<Website[]>(SAMPLE_WEBSITES);
  const [selectedWebsite, setSelectedWebsite] = useState<Website>(SAMPLE_WEBSITES[0]);

  // Backend state
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [memoryStatus, setMemoryStatus] = useState<MemoryStatus | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [activeRun, setActiveRun] = useState<WorkflowState | null>(null);
  const [isRunningAgent, setIsRunningAgent] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial data load
  useEffect(() => {
    void loadBackendData();
  }, []);

  async function loadBackendData() {
    try {
      const [healthRes, memRes, intRes, expRes] = await Promise.allSettled([
        ApiService.getHealth(),
        ApiService.getMemoryStatus(),
        ApiService.getIntegrations(),
        ApiService.getExperiments(),
      ]);

      if (healthRes.status === "fulfilled") {
        setApiConnected(true);
      } else {
        setApiConnected(false);
      }

      if (memRes.status === "fulfilled") {
        setMemoryStatus(memRes.value);
      }

      if (intRes.status === "fulfilled") {
        setIntegrations(intRes.value);
      }

      if (expRes.status === "fulfilled") {
        setExperiments(expRes.value);
      }
    } catch {
      setApiConnected(false);
    }
  }

  // Run audit workflow
  async function handleRunAudit(customQuery?: string) {
    const query = customQuery || "Find technical SEO opportunities and schema gaps";
    setIsRunningAgent(true);
    addToast("info", "Agent Dispatched", `LangGraph workflow started for ${selectedWebsite.domain}`);

    try {
      const run = await ApiService.runAudit("demo-customer", selectedWebsite.id, query);
      setActiveRun(run);
      await loadBackendData();

      if (run.approval_required && !run.measured) {
        addToast(
          "info",
          "Approval Required",
          "Agent validated actions and paused for human authorization."
        );
      } else {
        addToast("success", "Audit Completed", "Observations recorded and validated.");
      }
    } catch (err: any) {
      // Fallback demo run if backend API is not running locally
      const mockRun: WorkflowState = {
        run_id: `run-${Date.now().toString(36)}`,
        website_id: selectedWebsite.id,
        customer_id: "demo-customer",
        query,
        observations: [
          {
            source: "Google Search Console",
            status: "demo",
            data: {},
            message: "Demo mode: credentials are not configured, so no external metrics were fabricated.",
          },
          {
            source: "GitHub",
            status: "demo",
            data: {},
            message: "Demo mode: repository credentials not configured.",
          },
          {
            source: "PageSpeed Insights",
            status: "demo",
            data: {},
            message: "Demo mode: PageSpeed key not configured.",
          },
        ],
        recommendations: [
          {
            type: "memory-informed",
            detail:
              "Hindsight recalled exp-882: Injecting SoftwareApplication structured schema on technical landing pages boosted CTR by +31%. Recommend deploying automated JSON-LD patch to layout.",
            source: "groq-llama-3.1",
          },
        ],
        approval_required: true,
        approval_status: "pending",
        validated: true,
        measured: false,
        experiment: {
          experiment_id: `exp-${Math.floor(100 + Math.random() * 900)}`,
          website_id: selectedWebsite.domain,
          status: "proposed",
          hypothesis: query,
          proposed_change: "Apply validated technical SEO recommendations after operator approval.",
        },
        persistence: { status: "local", source: "in-memory" },
      };

      setActiveRun(mockRun);
      addToast(
        "info",
        "Demo Agent Simulation Active",
        "Backend offline; simulated LangGraph validation and memory recall flow."
      );
    } finally {
      setIsRunningAgent(false);
    }
  }

  // Approve workflow
  async function handleApproveWorkflow(approved: boolean) {
    if (!activeRun) return;

    try {
      const updated = await ApiService.approveWorkflow(activeRun.run_id, approved);
      setActiveRun(updated);
      await loadBackendData();
      if (approved) {
        addToast("success", "Workflow Approved", "Measurements recorded and reflected to Hindsight.");
      } else {
        addToast("info", "Workflow Rejected", "Action discarded by operator.");
      }
    } catch {
      // Offline fallback
      setActiveRun((prev) =>
        prev
          ? {
              ...prev,
              approval_required: false,
              approval_status: approved ? "approved" : "rejected",
              measured: approved,
              retention: { available: true, source: "hindsight-demo" },
              learning: {
                available: true,
                source: "hindsight-reflection",
                memories: [{ text: "Outcome confirmed and learning recorded in local bank." }],
              },
            }
          : null
      );
      addToast(
        approved ? "success" : "info",
        approved ? "Simulated Approval Complete" : "Action Rejected",
        approved ? "Reflected and retained in customer memory bank." : "Discarded."
      );
    }
  }

  // Create experiment
  async function handleCreateExperiment(data: { name: string; hypothesis: string; website_id: string }) {
    try {
      const exp = await ApiService.createExperiment(data);
      setExperiments((prev) => [exp, ...prev]);
      addToast("success", "Experiment Created", `Registered ${exp.name || exp.hypothesis}`);
    } catch {
      const mockExp: Experiment = {
        experiment_id: `exp-${Math.floor(100 + Math.random() * 900)}`,
        ...data,
        status: "proposed",
        outcome: null,
        created_at: new Date().toISOString().split("T")[0],
      };
      setExperiments((prev) => [mockExp, ...prev]);
      addToast("success", "Experiment Registered (Local)", `Hypothesis saved for ${data.website_id}`);
    }
  }

  // Add website
  function handleAddWebsite(newSite: { name: string; domain: string }) {
    const site: Website = {
      id: `site-${Date.now().toString(36)}`,
      name: newSite.name,
      domain: newSite.domain,
      healthScore: 85,
      gscConnected: false,
      githubConnected: false,
      lastAudit: "Just now",
      trafficTrend: 0,
      crawlStatus: "Healthy",
      pagesCount: 120,
    };
    setWebsites((prev) => [...prev, site]);
    setSelectedWebsite(site);
    addToast("success", "Website Connected", `Workspace context initialized for ${newSite.domain}`);
  }

  // Fix issue with agent
  function handleFixIssue(issue: AuditIssue) {
    const query = `Remediate ${issue.category} issue: ${issue.title}. ${issue.recommendation}`;
    setCurrentTab("agents");
    void handleRunAudit(query);
  }

  // Optimize keyword with agent
  function handleDispatchKeyword(keyword: string) {
    const query = `Optimize search query '${keyword}' to improve CTR and lift SERP position into top 3`;
    setCurrentTab("agents");
    void handleRunAudit(query);
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070a12] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onTriggerAudit={() => {
          setCurrentTab("agents");
          void handleRunAudit();
        }}
      />

      {/* Left Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeDomain={selectedWebsite.domain}
        memoryConnected={memoryStatus?.connected ?? false}
        pendingApprovalsCount={activeRun?.approval_required && !activeRun?.measured ? 1 : 0}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-radial-gradient">
        {/* Top Navbar */}
        <Navbar
          websites={websites}
          selectedWebsite={selectedWebsite}
          onSelectWebsite={(site) => {
            setSelectedWebsite(site);
            addToast("info", "Workspace Switched", `Active context: ${site.domain}`);
          }}
          memoryConnected={memoryStatus?.connected ?? false}
          apiConnected={apiConnected}
          onQuickAudit={() => {
            setCurrentTab("agents");
            void handleRunAudit();
          }}
          onOpenMemory={() => setCurrentTab("hindsight")}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 max-w-7xl w-full mx-auto">
          {currentTab === "overview" && (
            <OverviewView
              onNavigate={(tab) => setCurrentTab(tab)}
              onRunAudit={() => {
                setCurrentTab("agents");
                void handleRunAudit();
              }}
              integrations={integrations}
              memoryConnected={memoryStatus?.connected ?? false}
              activeRun={activeRun}
              domain={selectedWebsite.domain}
            />
          )}

          {currentTab === "websites" && (
            <WebsitesView
              websites={websites}
              selectedWebsite={selectedWebsite}
              onSelectWebsite={(site) => setSelectedWebsite(site)}
              onRunAuditForSite={(site) => {
                setSelectedWebsite(site);
                setCurrentTab("agents");
                void handleRunAudit();
              }}
              onAddWebsite={handleAddWebsite}
            />
          )}

          {currentTab === "analytics" && <AnalyticsView />}

          {currentTab === "keywords" && (
            <KeywordsView onDispatchAgentForKeyword={handleDispatchKeyword} />
          )}

          {currentTab === "audit" && (
            <AuditView onFixWithAgent={handleFixIssue} />
          )}

          {currentTab === "agents" && (
            <AgentCommandCenterView
              activeRun={activeRun}
              isRunning={isRunningAgent}
              onRunAudit={handleRunAudit}
              onApproveWorkflow={handleApproveWorkflow}
              websiteId={selectedWebsite.domain}
              customerId="demo-customer"
            />
          )}

          {currentTab === "hindsight" && (
            <HindsightMemoryView
              memoryConnected={memoryStatus?.connected ?? false}
              bankId={memoryStatus?.bank_id || "seo-mind-memory"}
            />
          )}

          {currentTab === "code" && (
            <CodeOptimizationView
              onApproveDiff={(diffId) => {
                addToast("success", "Pull Request Generated", `Branch pushed for diff ${diffId}`);
              }}
              onRejectDiff={(diffId) => {
                addToast("info", "Code Patch Rejected", `Diff ${diffId} closed`);
              }}
            />
          )}

          {currentTab === "experiments" && (
            <ExperimentsView
              experiments={experiments}
              onCreateExperiment={handleCreateExperiment}
              websiteId={selectedWebsite.domain}
            />
          )}

          {currentTab === "integrations" && (
            <IntegrationsView
              integrations={integrations}
              memoryStatus={memoryStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
