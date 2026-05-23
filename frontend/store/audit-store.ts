/**
 * Zustand store for audit state
 * Uses persist middleware — survives page refresh and accidental reloads
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ToolEntry, AuditResult } from "@/types/audit";
import { generateId } from "@/lib/utils";

interface AuditStore {
  // Form state
  tools: ToolEntry[];
  // Results state
  auditResult: AuditResult | null;
  // Whether results are being shown
  showResults: boolean;

  // Actions
  addTool: () => void;
  removeTool: (id: string) => void;
  updateTool: (id: string, updates: Partial<ToolEntry>) => void;
  setAuditResult: (result: AuditResult) => void;
  setShowResults: (show: boolean) => void;
  resetAudit: () => void;
}

const defaultTool = (): ToolEntry => ({
  id: generateId(),
  tool: "ChatGPT",
  plan: "Plus",
  monthlyCost: 20,
  seats: 1,
  teamSize: 1,
  useCase: "Writing",
});

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      tools: [defaultTool()],
      auditResult: null,
      showResults: false,

      addTool: () =>
        set((state) => ({
          tools: [...state.tools, defaultTool()],
        })),

      removeTool: (id) =>
        set((state) => ({
          tools: state.tools.filter((t) => t.id !== id),
        })),

      updateTool: (id, updates) =>
        set((state) => ({
          tools: state.tools.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      setAuditResult: (result) =>
        set({ auditResult: result, showResults: true }),

      setShowResults: (show) => set({ showResults: show }),

      resetAudit: () =>
        set({
          tools: [defaultTool()],
          auditResult: null,
          showResults: false,
        }),
    }),
    {
      name: "ai-spend-audit", // localStorage key
      // Only persist tools and results — not transient UI state
      partialize: (state) => ({
        tools: state.tools,
        auditResult: state.auditResult,
        showResults: state.showResults,
      }),
    }
  )
);
