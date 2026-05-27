import { PageShell } from "@/components/layout/PageShell";
import { AuditResults } from "@/components/audit/AuditResults";
import { fetchAuditById } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

interface SharedResultsPageProps {
  params: {
    auditId: string;
  };
}

export async function generateMetadata({ params }: SharedResultsPageProps) {
  return {
    title: "Shared AI Spend Audit Results",
    description: "View a shared AI spend audit report with savings and recommendations.",
    openGraph: {
      title: "Shared AI Spend Audit Results",
      description: "View a shared AI spend audit report with savings and recommendations.",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/results/${params.auditId}`,
    },
  };
}

export default async function SharedAuditResultPage({ params }: SharedResultsPageProps) {
  const record = await fetchAuditById(params.auditId);

  if (!record?.audit_data?.results) {
    notFound();
  }

  return (
    <PageShell>
      <main className="flex-1">
        <AuditResults result={record.audit_data.results} auditId={params.auditId} />
      </main>
    </PageShell>
  );
}
