import { AuditForm } from "@/components/audit/AuditForm";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = {
  title: "AI Spend Audit — Enter Your Subscriptions",
  description: "Add your AI tools, plans, and spend to get instant savings recommendations.",
};

export default function AuditPage() {
  return (
    <PageShell showFooter={false}>
      <main className="flex-1 flex flex-col">
        <AuditForm />
      </main>
    </PageShell>
  );
}
