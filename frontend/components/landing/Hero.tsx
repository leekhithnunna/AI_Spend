"use client";

import { ArrowDown, Sparkles, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("audit-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow label */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Free AI Spend Audit</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Find hidden AI{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            subscription waste
          </span>{" "}
          in minutes
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Most teams overpay for AI tools by 20–40%. Enter your current subscriptions
          and get an instant breakdown of where you can cut costs — no signup required.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            <span>Avg. $340/mo saved per team</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>8 AI tools supported</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span>No account needed</span>
          </div>
        </div>

        {/* CTA */}
        <Button size="xl" onClick={scrollToForm} className="group">
          Audit My AI Spend
          <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
        </Button>

        <p className="mt-4 text-xs text-white/30">
          Takes 2 minutes · 100% free · No email required
        </p>
      </div>
    </section>
  );
}
