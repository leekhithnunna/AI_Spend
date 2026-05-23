// ============================================================
// TypeScript interfaces for the AI Spend Audit Tool
// ============================================================

export type AITool =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API"
  | "OpenAI API"
  | "Gemini"
  | "Windsurf";

export type PlanType =
  | "Free"
  | "Pro"
  | "Plus"
  | "Team"
  | "Enterprise"
  | "API (Pay-as-you-go)"
  | "Business";

export type UseCase =
  | "Coding"
  | "Writing"
  | "Research"
  | "Customer Support"
  | "Data Analysis"
  | "Design"
  | "Marketing"
  | "Other";

// A single tool entry from the form
export interface ToolEntry {
  id: string; // local UUID for React key
  tool: AITool;
  plan: PlanType;
  monthlyCost: number;
  seats: number;
  teamSize: number;
  useCase: UseCase;
}

// The full form input
export interface AuditFormInput {
  tools: ToolEntry[];
}

// Per-tool audit result
export interface ToolAuditResult {
  tool: AITool;
  plan: PlanType;
  currentMonthlyCost: number;
  optimizedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  status: "optimized" | "can-save" | "warning";
  recommendations: Recommendation[];
}

// A single recommendation
export interface Recommendation {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  estimatedMonthlySavings: number;
  action: string;
}

// The full audit result returned by the engine
export interface AuditResult {
  totalMonthlyCost: number;
  totalOptimizedCost: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsPercentage: number;
  overallStatus: "optimized" | "can-save" | "overspending";
  toolBreakdowns: ToolAuditResult[];
  topRecommendations: Recommendation[];
  auditedAt: string;
}

// What gets saved to Supabase
export interface AuditRecord {
  audit_data: {
    tools: ToolEntry[];
    results: AuditResult;
  };
  monthly_savings: number;
  annual_savings: number;
}
