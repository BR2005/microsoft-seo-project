// Core TypeScript definitions for SEO-MIND

export type NavTab = 
  | "overview"
  | "websites"
  | "analytics"
  | "keywords"
  | "audit"
  | "agents"
  | "hindsight"
  | "code"
  | "experiments"
  | "integrations";

export interface Integration {
  name: string;
  status: "configured" | "demo" | "live" | "error";
  data: Record<string, any>;
  message: string;
}

export interface MemoryStatus {
  connected: boolean;
  source: string;
  bank_id: string;
}

export interface Experiment {
  experiment_id: string;
  website_id: string;
  name?: string;
  hypothesis: string;
  proposed_change?: string;
  status: "proposed" | "approved" | "executed" | "improved" | "declined" | "inconclusive" | "pending";
  outcome?: string | null;
  baseline_metric?: {
    name: string;
    value: number;
    unit: string;
  };
  measured_metric?: {
    name: string;
    value: number;
    unit: string;
    lift_pct?: number;
  };
  execution?: {
    status: string;
    executed_at: string;
  };
  measurement?: {
    status: string;
    result: string;
  };
  learning_insight?: string;
  created_at?: string;
}

export interface WorkflowObservation {
  source: string;
  status: string;
  data: Record<string, any>;
  message: string;
}

export interface WorkflowRecommendation {
  type: string;
  detail: string | Record<string, any>;
  source?: string;
}

export interface WorkflowState {
  run_id: string;
  website_id: string;
  customer_id: string;
  query: string;
  observations?: WorkflowObservation[];
  recommendations?: WorkflowRecommendation[];
  memory?: {
    customer: { available: boolean; source: string; memories: any[] };
    website: { available: boolean; source: string; memories: any[] };
  };
  approval_required?: boolean;
  approval_status?: "pending" | "approved" | "rejected";
  validated?: boolean;
  measured?: boolean;
  experiment?: Experiment;
  retention?: { available: boolean; source: string };
  learning?: { available: boolean; source: string; memories: any[] };
  persistence?: { status: string; source: string };
}

export interface Website {
  id: string;
  domain: string;
  name: string;
  healthScore: number;
  gscConnected: boolean;
  githubConnected: boolean;
  lastAudit: string;
  trafficTrend: number; // +12%
  crawlStatus: "Healthy" | "Warnings" | "Errors";
  pagesCount: number;
}

export interface AuditIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "Technical" | "Content" | "Performance" | "Schema" | "Mobile";
  title: string;
  description: string;
  urlsAffected: number;
  recommendation: string;
  impactScore: number; // 1-100
  resolved: boolean;
}

export interface KeywordData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  previousPosition: number;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  opportunityScore: number; // 1-100
}

export interface PagePerformance {
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  change: number; // delta
}

export interface MemoryRecord {
  id: string;
  timestamp: string;
  action: "retain" | "recall" | "reflect";
  context: string;
  summary: string;
  details: string;
  confidence: number;
  influence: string;
  outcome?: "improved" | "declined" | "neutral";
}

export interface CodeOptimizationDiff {
  id: string;
  filePath: string;
  title: string;
  category: "Structured Data" | "Meta Tags" | "Core Web Vitals" | "Canonical" | "Robots.txt";
  originalCode: string;
  proposedCode: string;
  aiExplanation: string;
  validationStatus: "passed" | "warning" | "failed";
  validationMessage: string;
  githubBranch: string;
  prStatus: "Ready to PR" | "Draft" | "Merged" | "Approved";
  approvalStatus: "pending" | "approved" | "rejected";
}

