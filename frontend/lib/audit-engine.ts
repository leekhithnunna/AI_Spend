/**
 * AI Spend Audit Engine
 *
 * Deterministic, rule-based audit logic. No AI API calls.
 * Pricing reference data lives in config/pricing.ts.
 */

import type {
  ToolEntry,
  AuditResult,
  ToolAuditResult,
  Recommendation,
} from "@/types/audit";
import { getPlanPriceMap } from "@/config/pricing";
import { generateId } from "@/lib/utils";

const PLAN_PRICING = getPlanPriceMap();

function auditTool(entry: ToolEntry): ToolAuditResult {
  const recommendations: Recommendation[] = [];
  let optimizedMonthlyCost = entry.monthlyCost;

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

  const listedPrice = PLAN_PRICING[entry.tool]?.[entry.plan];
  if (
    listedPrice !== undefined &&
    listedPrice > 0 &&
    entry.monthlyCost > listedPrice * entry.seats * 1.15
  ) {
    const fairCost = listedPrice * entry.seats;
    const savings = entry.monthlyCost - fairCost;
    if (savings > 0 && !recommendations.some((r) => r.title.includes("Wrong plan"))) {
      optimizedMonthlyCost = Math.min(optimizedMonthlyCost, fairCost);
      recommendations.push({
        id: generateId(),
        severity: "warning",
        title: `Wrong plan selection — ${entry.tool}`,
        description: `You're paying ${formatUsd(entry.monthlyCost)}/mo but list price for ${entry.plan} is ~${formatUsd(fairCost)}/mo for ${entry.seats} seat(s). You may be on a legacy or mis-billed tier.`,
        estimatedMonthlySavings: savings,
        action: `Verify billing at ${entry.tool}'s pricing page and align to ${entry.plan}`,
      });
    }
  }

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

  if (entry.tool === "Windsurf" && entry.plan === "Team" && entry.seats <= 2) {
    const proCost = 15 * entry.seats;
    const savings = entry.monthlyCost - proCost;
    if (savings > 0) {
      optimizedMonthlyCost = Math.min(optimizedMonthlyCost, proCost);
      recommendations.push({
        id: generateId(),
        severity: "info",
        title: "Downgrade Windsurf Team → Pro",
        description: `With ${entry.seats} user(s), Windsurf Pro ($15/seat) is enough. Team adds shared admin you may not need yet.`,
        estimatedMonthlySavings: savings,
        action: "Review plans at windsurf.com/pricing",
      });
    }
  }

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

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

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
