import { AuditResultsPage } from "@/components/audit/AuditResultsPage";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = {
  title: "Audit Results — AI Spend Audit",
  description: "Your personalized AI subscription savings breakdown and recommendations.",
};

export default function ResultsRoute() {
  return (
    <PageShell>
      <main className="flex-1">
        <AuditResultsPage />
      </main>
    </PageShell>
  );
}
