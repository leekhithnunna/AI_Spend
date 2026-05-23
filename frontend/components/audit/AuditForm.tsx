"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolEntryRow } from "@/components/audit/ToolEntry";
import { useAuditStore } from "@/store/audit-store";
import { runAudit } from "@/lib/audit-engine";
import { saveAudit } from "@/lib/supabase";
import type { AuditFormInput, ToolEntry } from "@/types/audit";
import { generateId } from "@/lib/utils";

// ── Zod schema ──────────────────────────────────────────────
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

// ── Component ───────────────────────────────────────────────
export function AuditForm() {
  const { tools: storedTools, setAuditResult, setShowResults } = useAuditStore();

  const methods = useForm<AuditFormInput>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: {
      tools: storedTools.length > 0 ? storedTools : [defaultTool()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "tools",
  });

  // Auto-save form state to Zustand store on every change
  // Using onChange event on the form element avoids the React Compiler
  // incompatible-library warning from methods.watch()
  const syncToStore = () => {
    const values = methods.getValues();
    if (values.tools) {
      useAuditStore.setState({ tools: values.tools as ToolEntry[] });
    }
  };

  const onSubmit = async (data: AuditFormInput) => {
    const result = runAudit(data.tools);
    setAuditResult(result);
    setShowResults(true);

    // Scroll to results
    setTimeout(() => {
      document.getElementById("audit-results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Optionally save to Supabase (fire and forget)
    saveAudit({
      audit_data: { tools: data.tools, results: result },
      monthly_savings: result.totalMonthlySavings,
      annual_savings: result.totalAnnualSavings,
    }).catch(() => {
      // Silently fail — Supabase is optional
    });
  };

  return (
    <section id="audit-form" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Audit your AI spend
          </h2>
          <p className="text-white/50">
            Add each AI tool your team pays for. We&apos;ll find the waste.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} onChange={syncToStore} noValidate>
            {/* Tool entries */}
            <div className="space-y-4 mb-6">
              {fields.map((field, index) => (
                <ToolEntryRow
                  key={field.id}
                  index={index}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>

            {/* Add tool button */}
            <Button
              type="button"
              variant="outline"
              className="w-full mb-8 border-dashed"
              onClick={() =>
                append(defaultTool())
              }
            >
              <Plus className="h-4 w-4" />
              Add Another Tool
            </Button>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
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

            {/* Form-level error */}
            {methods.formState.errors.tools?.root && (
              <p className="mt-3 text-center text-sm text-red-400">
                {methods.formState.errors.tools.root.message}
              </p>
            )}
          </form>
        </FormProvider>
      </div>
    </section>
  );
}

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
