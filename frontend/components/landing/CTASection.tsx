import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent p-10 sm:p-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Ready to find your hidden waste?
        </h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Join teams saving hundreds per month. Free audit — no credit card, no email.
        </p>
        <Link
          href="/audit"
          className={cn(buttonVariants({ size: "xl" }), "group inline-flex")}
        >
          Audit My AI Spend
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
