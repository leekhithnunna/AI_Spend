import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2">
        {steps.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={label} className="flex flex-1 items-center gap-2 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold border transition-colors",
                    done && "bg-violet-600 border-violet-600 text-white",
                    active && "border-violet-500 bg-violet-500/20 text-violet-300",
                    !done && !active && "border-white/15 text-white/30"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-[10px] sm:text-xs text-center truncate w-full px-0.5",
                    active ? "text-white font-medium" : "text-white/40"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 mb-6 min-w-[8px]",
                    i < currentStep ? "bg-violet-500/60" : "bg-white/10"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
