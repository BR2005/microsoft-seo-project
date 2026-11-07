import { Experiment, Integration, MemoryStatus, WorkflowState } from "../types";

const API_BASE = typeof window !== "undefined" && window.location.port === "5173"
  ? ""
  : "http://127.0.0.1:8001";

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  static async getHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }

  static async getMemoryStatus(): Promise<MemoryStatus> {
    return this.request<MemoryStatus>("/api/memory/status");
  }

  static async getIntegrations(): Promise<Integration[]> {
    const res = await this.request<{ integrations: Integration[] }>("/api/integrations");
    return res.integrations || [];
  }

  static async getExperiments(): Promise<Experiment[]> {
    const res = await this.request<{ experiments: Experiment[] }>("/api/experiments");
    return res.experiments || [];
  }

  static async runAudit(customerId: string, websiteId: string, query: string): Promise<WorkflowState> {
    return this.request<WorkflowState>("/api/workflows/audit", {
      method: "POST",
      body: JSON.stringify({
        customer_id: customerId,
        website_id: websiteId,
        query,
      }),
    });
  }

  static async approveWorkflow(runId: string, approved: boolean = true): Promise<WorkflowState> {
    return this.request<WorkflowState>(`/api/workflows/${runId}/approval`, {
      method: "POST",
      body: JSON.stringify({ approved }),
    });
  }

  static async createExperiment(data: { name: string; hypothesis: string; website_id: string }): Promise<Experiment> {
    return this.request<Experiment>("/api/experiments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
