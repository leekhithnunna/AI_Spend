"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  HIGH_SAVINGS_ANNUAL_THRESHOLD,
  HIGH_SAVINGS_MONTHLY_THRESHOLD,
} from "@/config/tools";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuditStore } from "@/store/audit-store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { AuditResult, Recommendation, ToolAuditResult } from "@/types/audit";

// ── Severity icon map ────────────────────────────────────────
function SeverityIcon({ severity }: { severity: Recommendation["severity"] }) {
  if (severity === "critical")
    return <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />;
  if (severity === "warning")
    return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />;
  return <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />;
}

// ── Status badge ─────────────────────────────────────────────
function StatusBadge({ status }: { status: ToolAuditResult["status"] }) {
  if (status === "optimized")
    return <Badge variant="success">Optimized</Badge>;
  if (status === "warning")
    return <Badge variant="destructive">High Spend</Badge>;
  return <Badge variant="warning">Can Save</Badge>;
}

// ── Summary cards ────────────────────────────────────────────
function SummaryCards({ result }: { result: AuditResult }) {
  const isOptimized = result.overallStatus === "optimized";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Monthly savings */}
      <Card className={isOptimized ? "border-emerald-500/20" : "border-violet-500/20"}>
        <CardContent className="p-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
            Monthly Savings
          </p>
          <p
            className={`text-3xl font-bold ${
              isOptimized ? "text-emerald-400" : "text-violet-400"
            }`}
          >
            {formatCurrency(result.totalMonthlySavings)}
          </p>
          <p className="text-xs text-white/40 mt-1">per month</p>
        </CardContent>
      </Card>

      {/* Annual savings */}
      <Card className={isOptimized ? "border-emerald-500/20" : "border-violet-500/20"}>
        <CardContent className="p-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
            Annual Savings
          </p>
          <p
            className={`text-3xl font-bold ${
              isOptimized ? "text-emerald-400" : "text-violet-400"
            }`}
          >
            {formatCurrency(result.totalAnnualSavings)}
          </p>
          <p className="text-xs text-white/40 mt-1">per year</p>
        </CardContent>
      </Card>

      {/* Current spend */}
      <Card>
        <CardContent className="p-6">
          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
            Current Spend
          </p>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(result.totalMonthlyCost)}
          </p>
          <p className="text-xs text-white/40 mt-1">
            {result.totalMonthlySavings > 0
              ? `${formatPercent(result.savingsPercentage)} reducible`
              : "already optimized"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Overall status banner ────────────────────────────────────
function StatusBanner({ result }: { result: AuditResult }) {
  if (result.overallStatus === "optimized") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 mb-8">
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-emerald-300">Your AI spend looks optimized</p>
          <p className="text-sm text-emerald-300/70 mt-0.5">
            Based on your current plans and team sizes, you&apos;re not leaving significant
            money on the table. Nice work.
          </p>
        </div>
      </div>
    );
  }

  if (result.overallStatus === "overspending") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 mb-8">
        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-300">
            Significant overspend detected — {formatPercent(result.savingsPercentage)} reducible
          </p>
          <p className="text-sm text-red-300/70 mt-0.5">
            You could save {formatCurrency(result.totalMonthlySavings)}/mo by following the
            recommendations below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 mb-8">
      <TrendingDown className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-amber-300">
          Savings opportunity found — {formatCurrency(result.totalMonthlySavings)}/mo
        </p>
        <p className="text-sm text-amber-300/70 mt-0.5">
          A few plan adjustments could save you {formatCurrency(result.totalAnnualSavings)}{" "}
          this year.
        </p>
      </div>
    </div>
  );
}

// ── Recommendation card ──────────────────────────────────────
function RecommendationCard({ rec }: { rec: Recommendation }) {
  const borderColor =
    rec.severity === "critical"
      ? "border-red-500/20"
      : rec.severity === "warning"
      ? "border-amber-500/20"
      : "border-blue-500/20";

  return (
    <div className={`rounded-xl border ${borderColor} bg-white/3 p-4`}>
      <div className="flex items-start gap-3">
        <SeverityIcon severity={rec.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-medium text-white text-sm">{rec.title}</p>
            {rec.estimatedMonthlySavings > 0 && (
              <span className="text-xs font-semibold text-emerald-400 shrink-0">
                -{formatCurrency(rec.estimatedMonthlySavings)}/mo
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mb-2 leading-relaxed">
            {rec.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-violet-400">
            <ArrowRight className="h-3 w-3" />
            <span>{rec.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Per-tool breakdown ───────────────────────────────────────
function ToolBreakdown({ breakdown }: { breakdown: ToolAuditResult }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-medium text-white">{breakdown.tool}</p>
          <p className="text-xs text-white/40">{breakdown.plan}</p>
        </div>
        <StatusBadge status={breakdown.status} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-white/40 mb-0.5">Current</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(breakdown.currentMonthlyCost)}/mo
          </p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-0.5">Optimized</p>
          <p className="text-sm font-semibold text-emerald-400">
            {formatCurrency(breakdown.optimizedMonthlyCost)}/mo
          </p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-0.5">Savings</p>
          <p
            className={`text-sm font-semibold ${
              breakdown.monthlySavings > 0 ? "text-violet-400" : "text-white/30"
            }`}
          >
            {breakdown.monthlySavings > 0
              ? `-${formatCurrency(breakdown.monthlySavings)}/mo`
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main results component ───────────────────────────────────
interface AuditResultsProps {
  result?: AuditResult;
  auditId?: string | null;
}

export function AuditResults({ result, auditId }: AuditResultsProps) {
  const router = useRouter();
  const { auditResult, showResults, resetAudit } = useAuditStore();
  const [copied, setCopied] = useState(false);

  const displayResult = result ?? auditResult;
  const showResultView = Boolean(result ?? (showResults && auditResult));

  const shareUrl = auditId
    ? typeof window !== "undefined"
      ? `${window.location.origin}/results/${auditId}`
      : ""
    : typeof window !== "undefined"
    ? window.location.href
    : "";

  if (!showResultView || !displayResult) return null;

  const showCredexCta =
    displayResult.totalAnnualSavings >= HIGH_SAVINGS_ANNUAL_THRESHOLD ||
    displayResult.totalMonthlySavings >= HIGH_SAVINGS_MONTHLY_THRESHOLD;

  const handleReset = () => {
    resetAudit();
    router.push("/audit");
  };

  return (
    <section id="audit-results" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Audit Results</h2>
            <p className="text-white/40 text-sm mt-1">
              Based on {displayResult.toolBreakdowns.length} tool
              {displayResult.toolBreakdowns.length !== 1 ? "s" : ""} audited
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Start Over
          </Button>
        </div>

        {/* Status banner */}
        <StatusBanner result={displayResult} />

        <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_auto] items-start">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60 mb-3">Audit summary</p>
            <p className="text-base text-white/90 leading-7">
              {displayResult.totalMonthlySavings > 0
                ? `This audit finds ${formatCurrency(displayResult.totalMonthlySavings)} in monthly savings and ${formatCurrency(displayResult.totalAnnualSavings)} in annual savings across ${displayResult.toolBreakdowns.length} tool${displayResult.toolBreakdowns.length !== 1 ? "s" : ""}.`
                : `Your current AI subscriptions appear optimized based on the entered team sizes and plan prices.`}
            </p>
            <p className="text-sm text-white/50 mt-3">
              {displayResult.topRecommendations.length > 0
                ? displayResult.topRecommendations[0].description
                : "No major recommendations found — review your audit inputs for any optional tools or seat optimizations."}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60 mb-3">Shareable audit</p>
            <p className="text-sm text-white/50 mb-4">
              {auditId
                ? "This link is backed by Supabase persistence and can be shared with your team."
                : "Share will copy the current URL. To generate a permanent share link, configure Supabase and re-run the audit."}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!shareUrl) return;
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copied" : "Copy share link"}
              </Button>
              {auditId && (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Open shared result
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <SummaryCards result={displayResult} />

        {/* Recommendations */}
        {displayResult.topRecommendations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Top Recommendations
            </h3>
            <div className="space-y-3">
              {displayResult.topRecommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Per-tool breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Per-Tool Breakdown
          </h3>
          <div className="space-y-3">
            {displayResult.toolBreakdowns.map((breakdown, i) => (
              <ToolBreakdown key={i} breakdown={breakdown} />
            ))}
          </div>
        </div>

        {showCredexCta && (
          <div className="mt-10 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-600/20 to-indigo-600/10 p-6 sm:p-8 text-center">
            <p className="text-lg font-semibold text-white mb-1">
              You could save {formatCurrency(displayResult.totalAnnualSavings)}/year
            </p>
            <p className="text-white/50 text-sm mb-4 max-w-md mx-auto">
              High-impact savings detected. Credex helps teams implement plan changes, optimize
              API spend, and build cost-efficient AI workflows.
            </p>
            <a
              href="https://credex.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25"
            >
              Get help from Credex
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}

        {displayResult.totalAnnualSavings > 0 && !showCredexCta && (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/3 p-6 text-center">
            <p className="text-sm text-white/50 mb-4">
              Implement these changes in your billing dashboards to start saving.
            </p>
            <Link
              href="/audit"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Edit audit inputs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
