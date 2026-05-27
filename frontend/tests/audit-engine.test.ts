import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit-engine";

describe("Audit engine", () => {
  it("suggests ChatGPT Team downgrade for small teams", () => {
    const result = runAudit([
      {
        id: "1",
        tool: "ChatGPT",
        plan: "Team",
        monthlyCost: 60,
        seats: 2,
        teamSize: 2,
        useCase: "Coding",
      },
    ]);

    expect(result.totalMonthlySavings).toBe(20);
    expect(result.toolBreakdowns[0].recommendations[0].title).toContain("Downgrade ChatGPT Team");
  });

  it("flags high API spend for OpenAI API above threshold", () => {
    const result = runAudit([
      {
        id: "2",
        tool: "OpenAI API",
        plan: "API (Pay-as-you-go)",
        monthlyCost: 1200,
        seats: 1,
        teamSize: 3,
        useCase: "Research",
      },
    ]);

    expect(result.overallStatus).toBe("overspending");
    expect(result.toolBreakdowns[0].recommendations[0].severity).toBe("critical");
  });

  it("recommends downgrading Enterprise plans for small teams", () => {
    const result = runAudit([
      {
        id: "3",
        tool: "Claude",
        plan: "Enterprise",
        monthlyCost: 800,
        seats: 5,
        teamSize: 4,
        useCase: "Writing",
      },
    ]);

    expect(result.toolBreakdowns[0].recommendations.some((r) => r.title.includes("Enterprise → Team"))).toBe(true);
  });

  it("detects unused seats and suggests removing extras", () => {
    const result = runAudit([
      {
        id: "4",
        tool: "Cursor",
        plan: "Business",
        monthlyCost: 200,
        seats: 5,
        teamSize: 3,
        useCase: "Design",
      },
    ]);

    expect(result.toolBreakdowns[0].recommendations.some((r) => r.title.includes("Unused"))).toBe(true);
  });

  it("returns optimized status when no savings are available", () => {
    const result = runAudit([
      {
        id: "5",
        tool: "ChatGPT",
        plan: "Plus",
        monthlyCost: 20,
        seats: 1,
        teamSize: 1,
        useCase: "Writing",
      },
    ]);

    expect(result.overallStatus).toBe("optimized");
    expect(result.totalMonthlySavings).toBe(0);
  });
});
