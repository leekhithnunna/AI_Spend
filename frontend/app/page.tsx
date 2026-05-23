import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { AuditForm } from "@/components/audit/AuditForm";
import { AuditResults } from "@/components/audit/AuditResults";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-white text-sm">AI Spend Audit</span>
          </div>
          <a
            href="#audit-form"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Start Audit →
          </a>
        </div>
      </nav>

      {/* Page sections */}
      <div className="pt-14">
        <Hero />
        <Features />
        <AuditForm />
        <AuditResults />
        <Footer />
      </div>
    </main>
  );
}
