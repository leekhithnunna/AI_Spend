"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Loader2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolEntryRow } from "@/components/audit/ToolEntry";
import { StepIndicator } from "@/components/audit/StepIndicator";
import { useAuditStore } from "@/store/audit-store";
import { runAudit } from "@/lib/audit-engine";
import { saveAudit } from "@/lib/supabase";
import { formatCurrency, generateId } from "@/lib/utils";
import type { AuditFormInput, ToolEntry } from "@/types/audit";

const STEPS = ["Tools", "Plans", "Spend", "Team", "Review"] as const;

const toolSchema = z.object({
  id: z.string(),
  tool: z.enum([
    "Cursor",
    "GitHub Copilot",
    "Claude",
    "ChatGPT",
    "Anthropic API",
    "OpenAI API",
    "Gemini",
    "Windsurf",
  ]),
  plan: z.enum([
    "Free",
    "Pro",
    "Plus",
    "Team",
    "Enterprise",
    "API (Pay-as-you-go)",
    "Business",
  ]),
  monthlyCost: z
    .number({ error: "Enter a valid number" })
    .min(0, "Cost cannot be negative")
    .max(100000, "That seems too high — double check"),
  seats: z
    .number({ error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "At least 1 seat required"),
  teamSize: z
    .number({ error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "Team size must be at least 1"),
  useCase: z.enum([
    "Coding",
    "Writing",
    "Research",
    "Customer Support",
    "Data Analysis",
    "Design",
    "Marketing",
    "Other",
  ]),
});

const auditFormSchema = z.object({
  tools: z.array(toolSchema).min(1, "Add at least one tool"),
});

const stepFields: Record<number, (keyof ToolEntry)[][]> = {
  0: [["tool"]],
  1: [["plan"]],
  2: [["monthlyCost"], ["seats"]],
  3: [["teamSize"], ["useCase"]],
};

function defaultTool(): ToolEntry {
  return {
    id: generateId(),
    tool: "ChatGPT",
    plan: "Plus",
    monthlyCost: 20,
    seats: 1,
    teamSize: 1,
    useCase: "Writing",
  };
}

export function AuditForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { tools: storedTools, setAuditResult, setShowResults } = useAuditStore();

  const methods = useForm<AuditFormInput>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      tools: storedTools.length > 0 ? storedTools : [defaultTool()],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "tools",
  });

  const syncToStore = () => {
    const values = methods.getValues();
    if (values.tools) {
      useAuditStore.setState({ tools: values.tools as ToolEntry[] });
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    if (step === 4) return methods.trigger("tools");

    const fieldPaths = fields.flatMap((_, index) =>
      (stepFields[step] ?? []).map(
        (keys) => `tools.${index}.${keys[0]}` as const
      )
    );

    return methods.trigger(fieldPaths);
  };

  const goNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;
    syncToStore();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    syncToStore();
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (data: AuditFormInput) => {
    setSubmitError(null);
    try {
      const result = runAudit(data.tools);
      setAuditResult(result);
      setShowResults(true);
      syncToStore();

      saveAudit({
        audit_data: { tools: data.tools, results: result },
        monthly_savings: result.totalMonthlySavings,
        annual_savings: result.totalAnnualSavings,
      }).catch(() => {});

      router.push("/results");
    } catch {
      setSubmitError("Something went wrong running your audit. Please try again.");
    }
  };

  const fieldMode =
    step === 0
      ? "tool"
      : step === 1
        ? "plan"
        : step === 2
          ? "spend"
          : step === 3
            ? "team"
            : "all";

  const watchedTools = methods.getValues("tools");

  return (
    <section className="py-12 sm:py-16 px-4 flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Audit your AI spend
          </h1>
          <p className="text-white/50 max-w-lg mx-auto">
            Step {step + 1} of {STEPS.length} — add each tool your team pays for.
          </p>
        </div>

        <StepIndicator steps={[...STEPS]} currentStep={step} />

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            onChange={syncToStore}
            noValidate
          >
            {step < 4 && (
              <div className="space-y-4 mb-6">
                {fields.map((field, index) => (
                  <ToolEntryRow
                    key={field.id}
                    index={index}
                    onRemove={() => remove(index)}
                    canRemove={fields.length > 1}
                    fields={fieldMode}
                  />
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="rounded-xl border border-white/10 bg-white/3 p-6 mb-6 space-y-4">
                <h3 className="font-semibold text-white">Review your entries</h3>
                {watchedTools?.map((t, i) => (
                  <div
                    key={t.id ?? i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-white">{t.tool}</p>
                      <p className="text-xs text-white/40">
                        {t.plan} · {t.seats} seat{t.seats !== 1 ? "s" : ""} · Team of{" "}
                        {t.teamSize} · {t.useCase}
                      </p>
                    </div>
                    <p className="text-violet-400 font-semibold">
                      {formatCurrency(t.monthlyCost)}/mo
                    </p>
                  </div>
                ))}
                <p className="text-sm text-white/50 pt-2">
                  Total:{" "}
                  <span className="text-white font-medium">
                    {formatCurrency(
                      watchedTools?.reduce((s, t) => s + (t.monthlyCost || 0), 0) ?? 0
                    )}
                    /mo
                  </span>
                </p>
              </div>
            )}

            {step < 4 && (
              <Button
                type="button"
                variant="outline"
                className="w-full mb-6 border-dashed"
                onClick={() => append(defaultTool())}
              >
                <Plus className="h-4 w-4" />
                Add Another Tool
              </Button>
            )}

            {submitError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 mb-4 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {submitError}
              </div>
            )}

            <div className="flex gap-3">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={goBack} className="flex-1">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}

              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={goNext} className="flex-1">
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={methods.formState.isSubmitting}
                >
                  {methods.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Run Audit
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
