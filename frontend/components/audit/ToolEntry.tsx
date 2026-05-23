"use client";

import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AuditFormInput, AITool, PlanType, UseCase } from "@/types/audit";

const AI_TOOLS: AITool[] = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
];

const PLANS_BY_TOOL: Record<AITool, PlanType[]> = {
  Cursor: ["Free", "Pro", "Business"],
  "GitHub Copilot": ["Free", "Pro", "Business", "Enterprise"],
  Claude: ["Free", "Pro", "Team", "Enterprise"],
  ChatGPT: ["Free", "Plus", "Team", "Enterprise"],
  "Anthropic API": ["API (Pay-as-you-go)"],
  "OpenAI API": ["API (Pay-as-you-go)"],
  Gemini: ["Free", "Pro", "Business", "Enterprise"],
  Windsurf: ["Free", "Pro", "Team"],
};

const USE_CASES: UseCase[] = [
  "Coding",
  "Writing",
  "Research",
  "Customer Support",
  "Data Analysis",
  "Design",
  "Marketing",
  "Other",
];

interface ToolEntryProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export function ToolEntryRow({ index, onRemove, canRemove }: ToolEntryProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AuditFormInput>();

  const selectedTool = watch(`tools.${index}.tool`) as AITool;
  const availablePlans = PLANS_BY_TOOL[selectedTool] ?? [];

  // Safely extract error message from RHF error object
  const getErr = (field: "monthlyCost" | "seats" | "teamSize"): string | undefined => {
    const toolErrors = errors.tools?.[index];
    if (!toolErrors) return undefined;
    const err = toolErrors[field];
    if (!err || typeof err !== "object") return undefined;
    return "message" in err ? (err.message as string) : undefined;
  };

  // For enum fields (tool, plan, useCase) errors are simpler
  const hasEnumErr = (field: "tool" | "plan" | "useCase"): boolean => {
    return !!errors.tools?.[index]?.[field];
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
          Tool #{index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-7 w-7 text-white/30 hover:text-red-400"
            aria-label="Remove tool"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* AI Tool */}
        <div className="space-y-1.5">
          <Label htmlFor={`tool-${index}`}>AI Tool</Label>
          <Select
            id={`tool-${index}`}
            {...register(`tools.${index}.tool`)}
            className={cn(hasEnumErr("tool") && "border-red-500/50")}
          >
            {AI_TOOLS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        {/* Plan */}
        <div className="space-y-1.5">
          <Label htmlFor={`plan-${index}`}>Plan</Label>
          <Select
            id={`plan-${index}`}
            {...register(`tools.${index}.plan`)}
            className={cn(hasEnumErr("plan") && "border-red-500/50")}
          >
            {availablePlans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>

        {/* Monthly Spend */}
        <div className="space-y-1.5">
          <Label htmlFor={`cost-${index}`}>Monthly Spend ($)</Label>
          <Input
            id={`cost-${index}`}
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 30"
            {...register(`tools.${index}.monthlyCost`, { valueAsNumber: true })}
            className={cn(getErr("monthlyCost") && "border-red-500/50")}
          />
          {getErr("monthlyCost") && (
            <p className="text-xs text-red-400">{getErr("monthlyCost")}</p>
          )}
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <Label htmlFor={`seats-${index}`}>Seats / Licenses</Label>
          <Input
            id={`seats-${index}`}
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 5"
            {...register(`tools.${index}.seats`, { valueAsNumber: true })}
            className={cn(getErr("seats") && "border-red-500/50")}
          />
          {getErr("seats") && (
            <p className="text-xs text-red-400">{getErr("seats")}</p>
          )}
        </div>

        {/* Team Size */}
        <div className="space-y-1.5">
          <Label htmlFor={`teamSize-${index}`}>Actual Team Size</Label>
          <Input
            id={`teamSize-${index}`}
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 4"
            {...register(`tools.${index}.teamSize`, { valueAsNumber: true })}
            className={cn(getErr("teamSize") && "border-red-500/50")}
          />
          {getErr("teamSize") && (
            <p className="text-xs text-red-400">{getErr("teamSize")}</p>
          )}
        </div>

        {/* Use Case */}
        <div className="space-y-1.5">
          <Label htmlFor={`useCase-${index}`}>Primary Use Case</Label>
          <Select
            id={`useCase-${index}`}
            {...register(`tools.${index}.useCase`)}
          >
            {USE_CASES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
