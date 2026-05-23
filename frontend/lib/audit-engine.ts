/**
 * AI Spend Audit Engine
 *
 * Deterministic, rule-based audit logic. No AI API calls.
 * All rules are hardcoded business logic — fast, free, transparent.
 */

import type {
  ToolEntry,
  AuditResult,
  ToolAuditResult,
  Recommendation,
} from "@/types/audit";
import { generateId } from "@/lib/utils";

// ============================================================
// Plan pricing reference (monthly per seat, USD)
// Used to calculate what the user SHOULD be paying
// ============================================================
const PLAN_PRICING: Record<string, Record<string, number>> = {
  Cursor: {
    Free: 0,
    Pro: 20,
    Business: 40,
  },
  "GitHub Copilot": {
    Free: 0,
    Pro: 10,
    Business: 19,
    Enterprise: 39,
  },
  Claude: {
    Free: 0,
    Pro: 20,
    Team: 30,
    Enterprise: 60,
  },
  ChatGPT: {
    Free: 0,
    Plus: 20,
    Team: 30,
    Enterprise: 60,
  },
  "Anthropic API": {
    "API (Pay-as-you-go)": 0, // variable — use user-entered cost
  },
  "OpenAI API": {
    "API (Pay-as-you-go)": 0, // variable — use user-entered cost
  },
  Gemini: {
    Free: 0,
    Pro: 20,
    Business: 30,
    Enterprise: 50,
  },
  Windsurf: {
    Free: 0,
    Pro: 15,
    Team: 35,
  },
};

// ============================================================
// Rule engine — returns recommendations for a single tool
// ============================================================
function auditTool(entry: ToolEntry): ToolAuditResult {
  const recommendations: Recommendation[] = [];
  let optimizedMonthlyCost = entry.monthlyCost;

  // ── Rule 1: ChatGPT Team with ≤2 seats → downgrade to Plus ──
  if (entry.tool === "ChatGPT" && entry.plan === "Team" && entry.seats <= 2) {
    const plusCost = 20 * entry.seats;
    const savings = entry.monthlyCost - plusCost;
    if (savings > 0) {
      optimizedMonthlyCost = plusCost;
      recommendations.push({
        id: generateId(),
        severity: "warning",
        title: "Downgrade ChatGPT Team → Plus",
        description: `You have ${entry.seats} seat(s) on ChatGPT Team ($30/seat). ChatGPT Plus ($20/seat) covers the same use case for small teams.`,
        estimatedMonthlySavings: savings,
        action: "Switch to ChatGPT Plus at chatgpt.com/pricing",
      });
    }
  }

  // ── Rule 2: Claude Team with ≤3 seats → downgrade to Pro ──
  if (entry.tool === "Claude" && entry.plan === "Team" && entry.seats <= 3) {
    const proCost = 20 * entry.seats;
    const savings = entry.monthlyCost - proCost;
    if (savings > 0) {
      optimizedMonthlyCost = proCost;
      recommendations.push({
        id: generateId(),
        severity: "warning",
        title: "Downgrade Claude Team → Pro",
        description: `You have ${entry.seats} seat(s) on Claude Team ($30/seat). Claude Pro ($20/seat) is sufficient for teams of 3 or fewer.`,
        estimatedMonthlySavings: savings,
        action: "Switch to Claude Pro at claude.ai/upgrade",
      });
    }
  }

  // ── Rule 3: API spend > $500/mo → recommend Credex consultation ──
  if (
    (entry.tool === "Anthropic API" || entry.tool === "OpenAI API") &&
    entry.monthlyCost > 500
  ) {
    recommendations.push({
      id: generateId(),
      severity: "critical",
      title: "High API Spend Detected — Get Expert Help",
      description: `You're spending $${entry.monthlyCost}/mo on ${entry.tool}. At this scale, prompt optimization, caching, and model selection can cut costs by 30–60%.`,
      estimatedMonthlySavings: Math.round(entry.monthlyCost * 0.35),
      action: "Contact Credex for a free API cost optimization consultation",
    });
    optimizedMonthlyCost = Math.round(entry.monthlyCost * 0.65);
  }

  // ── Rule 4: Enterprise plan with team size < 5 → recommend downgrade ──
  if (entry.plan === "Enterprise" && entry.teamSize < 5) {
    const teamPricing = PLAN_PRICING[entry.tool];
    const teamPlanCost = teamPricing?.Team
      ? teamPricing.Team * entry.seats
      : entry.monthlyCost * 0.5;
    const savings = entry.monthlyCost - teamPlanCost;
    if (savings > 0) {
      optimizedMonthlyCost = Math.min(optimizedMonthlyCost, teamPlanCost);
      recommendations.push({
        id: generateId(),
        severity: "warning",
        title: `Downgrade ${entry.tool} Enterprise → Team`,
        description: `Enterprise plans are designed for 10+ person teams. With ${entry.teamSize} people, a Team plan gives you the same features at a fraction of the cost.`,
        estimatedMonthlySavings: savings,
        action: `Contact ${entry.tool} sales to downgrade your plan`,
      });
    }
  }

  // ── Rule 5: Seats significantly exceed team size → reduce seats ──
  if (entry.seats > entry.teamSize * 1.2 && entry.seats > 1) {
    const unusedSeats = entry.seats - entry.teamSize;
    const costPerSeat = entry.monthlyCost / entry.seats;
    const savings = Math.round(unusedSeats * costPerSeat);
    if (savings > 0) {
      optimizedMonthlyCost = Math.min(
        optimizedMonthlyCost,
        entry.monthlyCost - savings
      );
      recommendations.push({
        id: generateId(),
        severity: "info",
        title: `Remove ${unusedSeats} Unused ${entry.tool} Seat(s)`,
        description: `You have ${entry.seats} seats but only ${entry.teamSize} team members. You're paying for ${unusedSeats} unused seat(s).`,
        estimatedMonthlySavings: savings,
        action: "Go to your billing settings and reduce seat count",
      });
    }
  }

  // ── Rule 6: GitHub Copilot Business when Pro is enough (≤3 devs) ──
  if (
    entry.tool === "GitHub Copilot" &&
    entry.plan === "Business" &&
    entry.seats <= 3
  ) {
    const proCost = 10 * entry.seats;
    const savings = entry.monthlyCost - proCost;
    if (savings > 0) {
      optimizedMonthlyCost = Math.min(optimizedMonthlyCost, proCost);
      recommendations.push({
        id: generateId(),
        severity: "info",
        title: "Downgrade GitHub Copilot Business → Pro",
        description: `With ${entry.seats} developer(s), GitHub Copilot Pro ($10/seat) covers all core features. Business adds admin controls you likely don't need yet.`,
        estimatedMonthlySavings: savings,
        action: "Downgrade at github.com/settings/copilot",
      });
    }
  }

  // ── Rule 7: Cursor Business for solo/pair → downgrade to Pro ──
  if (entry.tool === "Cursor" && entry.plan === "Business" && entry.seats <= 2) {
    const proCost = 20 * entry.seats;
    const savings = entry.monthlyCost - proCost;
    if (savings > 0) {
      optimizedMonthlyCost = Math.min(optimizedMonthlyCost, proCost);
      recommendations.push({
        id: generateId(),
        severity: "info",
        title: "Downgrade Cursor Business → Pro",
        description: `Cursor Pro ($20/seat) is sufficient for individuals and small teams. Business adds SSO and admin features you don't need at ${entry.seats} seat(s).`,
        estimatedMonthlySavings: savings,
        action: "Downgrade at cursor.com/settings",
      });
    }
  }

  // ── Rule 8: API spend between $100–$500 → suggest optimization ──
  if (
    (entry.tool === "Anthropic API" || entry.tool === "OpenAI API") &&
    entry.monthlyCost >= 100 &&
    entry.monthlyCost <= 500
  ) {
    const savings = Math.round(entry.monthlyCost * 0.2);
    recommendations.push({
      id: generateId(),
      severity: "info",
      title: "Optimize API Usage",
      description: `At $${entry.monthlyCost}/mo, switching to a smaller model for simple tasks (e.g., GPT-4o-mini vs GPT-4o) can reduce costs by ~20%.`,
      estimatedMonthlySavings: savings,
      action: "Review your API calls and use smaller models where possible",
    });
    optimizedMonthlyCost = Math.min(
      optimizedMonthlyCost,
      entry.monthlyCost - savings
    );
  }

  const monthlySavings = Math.max(0, entry.monthlyCost - optimizedMonthlyCost);
  const annualSavings = monthlySavings * 12;

  const status: ToolAuditResult["status"] =
    recommendations.some((r) => r.severity === "critical")
      ? "warning"
      : monthlySavings > 0
      ? "can-save"
      : "optimized";

  return {
    tool: entry.tool,
    plan: entry.plan,
    currentMonthlyCost: entry.monthlyCost,
    optimizedMonthlyCost: Math.max(0, optimizedMonthlyCost),
    monthlySavings,
    annualSavings,
    status,
    recommendations,
  };
}

// ============================================================
// Main audit function — processes all tools
// ============================================================
export function runAudit(tools: ToolEntry[]): AuditResult {
  const toolBreakdowns = tools.map(auditTool);

  const totalMonthlyCost = tools.reduce((sum, t) => sum + t.monthlyCost, 0);
  const totalOptimizedCost = toolBreakdowns.reduce(
    (sum, r) => sum + r.optimizedMonthlyCost,
    0
  );
  const totalMonthlySavings = Math.max(0, totalMonthlyCost - totalOptimizedCost);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const savingsPercentage =
    totalMonthlyCost > 0 ? (totalMonthlySavings / totalMonthlyCost) * 100 : 0;

  // Collect all recommendations, sorted by savings (highest first)
  const allRecommendations = toolBreakdowns
    .flatMap((r) => r.recommendations)
    .sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings);

  const overallStatus: AuditResult["overallStatus"] =
    savingsPercentage > 20
      ? "overspending"
      : totalMonthlySavings > 0
      ? "can-save"
      : "optimized";

  return {
    totalMonthlyCost,
    totalOptimizedCost,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsPercentage,
    overallStatus,
    toolBreakdowns,
    topRecommendations: allRecommendations.slice(0, 5),
    auditedAt: new Date().toISOString(),
  };
}
