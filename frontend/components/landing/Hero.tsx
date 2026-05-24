"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, TrendingDown, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Free · Instant · No signup</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
          Stop overpaying for{" "}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300 bg-clip-text text-transparent">
            AI subscriptions
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Most teams waste 20–40% on the wrong plans, unused seats, and enterprise tiers they
          don&apos;t need. Run a free audit in under two minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/audit"
            className={cn(buttonVariants({ size: "xl" }), "group w-full sm:w-auto")}
          >
            Start Free Audit
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "w-full sm:w-auto text-center"
            )}
          >
            See how it works
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <span>Avg. $340/mo saved</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>8 tools supported</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-medium">✓</span>
            <span>Runs in your browser</span>
          </div>
        </div>

        <div className="mt-16 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-transparent p-1 shadow-2xl shadow-violet-500/10">
          <div className="rounded-xl bg-zinc-900/90 p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-xs text-white/30">Audit preview</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Monthly savings", value: "$287", color: "text-violet-400" },
                { label: "Annual savings", value: "$3,444", color: "text-emerald-400" },
                { label: "Current spend", value: "$890", color: "text-white" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/5 bg-white/3 p-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90">
              ↓ Downgrade ChatGPT Team → Plus — save $60/mo for 2 seats
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
