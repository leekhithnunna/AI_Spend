"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, FileSearch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuditResults } from "@/components/audit/AuditResults";
import { useAuditStore } from "@/store/audit-store";
import { useStoreHydration } from "@/hooks/use-store-hydration";

export function AuditResultsPage() {
  const router = useRouter();
  const hydrated = useStoreHydration();
  const { auditResult, showResults } = useAuditStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!showResults || !auditResult) {
      router.replace("/audit");
    }
  }, [hydrated, showResults, auditResult, router]);

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        <p className="text-white/50 text-sm">Loading your audit results...</p>
      </div>
    );
  }

  if (!showResults || !auditResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4 text-center">
        <FileSearch className="h-10 w-10 text-white/30" />
        <p className="text-white/50">No audit results yet.</p>
        <Link href="/audit" className={cn(buttonVariants())}>
          Start an audit
        </Link>
      </div>
    );
  }

  return <AuditResults />;
}
