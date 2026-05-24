/**
 * Centralized AI tool pricing configuration.
 * Update prices here — audit engine and form both consume this data.
 */

import type { AITool, PlanType } from "@/types/audit";

export interface PricingSource {
  url: string;
  label: string;
  lastVerified: string;
}

export interface PlanPricing {
  plan: PlanType;
  /** USD per seat per month. 0 for free or variable API billing. */
  pricePerSeatMonthly: number;
  note?: string;
}

export interface ToolPricingConfig {
  tool: AITool;
  plans: PlanPricing[];
  pricingSource: PricingSource;
}

export const TOOL_PRICING_CONFIG: Record<AITool, ToolPricingConfig> = {
  Cursor: {
    tool: "Cursor",
    plans: [
      { plan: "Free", pricePerSeatMonthly: 0 },
      { plan: "Pro", pricePerSeatMonthly: 20 },
      { plan: "Business", pricePerSeatMonthly: 40 },
    ],
    pricingSource: {
      url: "https://www.cursor.com/pricing",
      label: "Cursor Pricing",
      lastVerified: "2026-05-01",
    },
  },
  "GitHub Copilot": {
    tool: "GitHub Copilot",
    plans: [
      { plan: "Free", pricePerSeatMonthly: 0 },
      { plan: "Pro", pricePerSeatMonthly: 10 },
      { plan: "Business", pricePerSeatMonthly: 19 },
      { plan: "Enterprise", pricePerSeatMonthly: 39 },
    ],
    pricingSource: {
      url: "https://github.com/features/copilot/plans",
      label: "GitHub Copilot Plans",
      lastVerified: "2026-05-01",
    },
  },
  Claude: {
    tool: "Claude",
    plans: [
      { plan: "Free", pricePerSeatMonthly: 0 },
      { plan: "Pro", pricePerSeatMonthly: 20 },
      { plan: "Team", pricePerSeatMonthly: 30 },
      { plan: "Enterprise", pricePerSeatMonthly: 60, note: "Custom pricing typical" },
    ],
    pricingSource: {
      url: "https://www.anthropic.com/pricing",
      label: "Anthropic Claude Pricing",
      lastVerified: "2026-05-01",
    },
  },
  ChatGPT: {
    tool: "ChatGPT",
    plans: [
      { plan: "Free", pricePerSeatMonthly: 0 },
      { plan: "Plus", pricePerSeatMonthly: 20 },
      { plan: "Team", pricePerSeatMonthly: 30 },
      { plan: "Enterprise", pricePerSeatMonthly: 60, note: "Custom pricing typical" },
    ],
    pricingSource: {
      url: "https://openai.com/chatgpt/pricing",
      label: "ChatGPT Pricing",
      lastVerified: "2026-05-01",
    },
  },
  "Anthropic API": {
    tool: "Anthropic API",
    plans: [
      {
        plan: "API (Pay-as-you-go)",
        pricePerSeatMonthly: 0,
        note: "Variable — enter actual monthly bill",
      },
    ],
    pricingSource: {
      url: "https://www.anthropic.com/pricing#api",
      label: "Anthropic API Pricing",
      lastVerified: "2026-05-01",
    },
  },
  "OpenAI API": {
    tool: "OpenAI API",
    plans: [
      {
        plan: "API (Pay-as-you-go)",
        pricePerSeatMonthly: 0,
        note: "Variable — enter actual monthly bill",
      },
    ],
    pricingSource: {
      url: "https://openai.com/api/pricing",
      label: "OpenAI API Pricing",
      lastVerified: "2026-05-01",
    },
  },
  Gemini: {
    tool: "Gemini",
    plans: [
      { plan: "Free", pricePerSeatMonthly: 0 },
      { plan: "Pro", pricePerSeatMonthly: 20 },
      { plan: "Business", pricePerSeatMonthly: 30 },
      { plan: "Enterprise", pricePerSeatMonthly: 50, note: "Custom pricing typical" },
    ],
    pricingSource: {
      url: "https://ai.google.dev/gemini-api/docs/pricing",
      label: "Google Gemini Pricing",
      lastVerified: "2026-05-01",
    },
  },
  Windsurf: {
    tool: "Windsurf",
    plans: [
      { plan: "Free", pricePerSeatMonthly: 0 },
      { plan: "Pro", pricePerSeatMonthly: 15 },
      { plan: "Team", pricePerSeatMonthly: 35 },
    ],
    pricingSource: {
      url: "https://windsurf.com/pricing",
      label: "Windsurf Pricing",
      lastVerified: "2026-05-01",
    },
  },
};

/** Flat lookup: tool → plan → price per seat (monthly USD) */
export function getPlanPriceMap(): Record<string, Record<string, number>> {
  const map: Record<string, Record<string, number>> = {};
  for (const config of Object.values(TOOL_PRICING_CONFIG)) {
    map[config.tool] = {};
    for (const p of config.plans) {
      map[config.tool][p.plan] = p.pricePerSeatMonthly;
    }
  }
  return map;
}

export function getPlansForTool(tool: AITool): PlanType[] {
  return TOOL_PRICING_CONFIG[tool].plans.map((p) => p.plan);
}

export function getDefaultPlanForTool(tool: AITool): PlanType {
  const paid = TOOL_PRICING_CONFIG[tool].plans.find((p) => p.pricePerSeatMonthly > 0);
  return paid?.plan ?? TOOL_PRICING_CONFIG[tool].plans[0].plan;
}

/** Suggested total monthly cost for seat-based plans */
export function getSuggestedMonthlyCost(
  tool: AITool,
  plan: PlanType,
  seats: number
): number | null {
  const entry = TOOL_PRICING_CONFIG[tool].plans.find((p) => p.plan === plan);
  if (!entry || entry.pricePerSeatMonthly === 0) return null;
  return entry.pricePerSeatMonthly * Math.max(1, seats);
}

export function getPricingSource(tool: AITool): PricingSource {
  return TOOL_PRICING_CONFIG[tool].pricingSource;
}
