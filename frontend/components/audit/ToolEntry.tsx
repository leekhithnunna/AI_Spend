"use client";

import { useEffect } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AI_TOOLS, USE_CASES } from "@/config/tools";
import {
  getPlansForTool,
  getDefaultPlanForTool,
  getSuggestedMonthlyCost,
  getPricingSource,
} from "@/config/pricing";
import type { AuditFormInput, AITool } from "@/types/audit";

export type ToolEntryFields = "all" | "tool" | "plan" | "spend" | "team";

interface ToolEntryProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  fields?: ToolEntryFields;
}

export function ToolEntryRow({
  index,
  onRemove,
  canRemove,
  fields = "all",
}: ToolEntryProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AuditFormInput>();

  const selectedTool = watch(`tools.${index}.tool`) as AITool;
  const selectedPlan = watch(`tools.${index}.plan`);
  const seats = watch(`tools.${index}.seats`) || 1;
  const availablePlans = getPlansForTool(selectedTool);
  const pricingSource = getPricingSource(selectedTool);
  const suggestedCost = getSuggestedMonthlyCost(
    selectedTool,
    selectedPlan,
    Number(seats)
  );

  useEffect(() => {
    if (!availablePlans.includes(selectedPlan as (typeof availablePlans)[number])) {
      setValue(`tools.${index}.plan`, getDefaultPlanForTool(selectedTool));
    }
  }, [selectedTool, availablePlans, selectedPlan, index, setValue]);

  const showTool = fields === "all" || fields === "tool";
  const showPlan = fields === "all" || fields === "plan";
  const showSpend = fields === "all" || fields === "spend";
  const showTeam = fields === "all" || fields === "team";

  const getErr = (field: "monthlyCost" | "seats" | "teamSize"): string | undefined => {
    const toolErrors = errors.tools?.[index];
    if (!toolErrors) return undefined;
    const err = toolErrors[field];
    if (!err || typeof err !== "object") return undefined;
    return "message" in err ? (err.message as string) : undefined;
  };

  const hasEnumErr = (field: "tool" | "plan" | "useCase"): boolean => {
    return !!errors.tools?.[index]?.[field];
  };

  const applySuggestedCost = () => {
    if (suggestedCost !== null) {
      setValue(`tools.${index}.monthlyCost`, suggestedCost);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
          Tool #{index + 1}
        </span>
        <div className="flex items-center gap-2">
          {showPlan && (
            <a
              href={pricingSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
            >
              Pricing
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showTool && (
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
        )}

        {showPlan && (
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
        )}

        {showSpend && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor={`cost-${index}`}>Monthly Spend ($)</Label>
              <div className="flex gap-2">
                <Input
                  id={`cost-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 30"
                  {...register(`tools.${index}.monthlyCost`, { valueAsNumber: true })}
                  className={cn(getErr("monthlyCost") && "border-red-500/50")}
                />
                {suggestedCost !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={applySuggestedCost}
                  >
                    Use ${suggestedCost}
                  </Button>
                )}
              </div>
              {getErr("monthlyCost") && (
                <p className="text-xs text-red-400">{getErr("monthlyCost")}</p>
              )}
            </div>

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
          </>
        )}

        {showTeam && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
