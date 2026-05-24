/**
 * Supported AI tools and form constants
 */

import type { AITool, UseCase } from "@/types/audit";

export const AI_TOOLS: readonly AITool[] = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
] as const;

export const USE_CASES: readonly UseCase[] = [
  "Coding",
  "Writing",
  "Research",
  "Customer Support",
  "Data Analysis",
  "Design",
  "Marketing",
  "Other",
] as const;

/** Annual savings threshold to show Credex consultation CTA */
export const HIGH_SAVINGS_ANNUAL_THRESHOLD = 1000;

/** Monthly savings threshold for "high saver" messaging */
export const HIGH_SAVINGS_MONTHLY_THRESHOLD = 150;
