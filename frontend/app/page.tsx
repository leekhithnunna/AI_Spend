import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";
import { PageShell } from "@/components/layout/PageShell";

export default function Home() {
  return (
    <PageShell>
      <main className="flex-1">
        <Hero />
        <Features />
        <CTASection />
      </main>
    </PageShell>
  );
}
