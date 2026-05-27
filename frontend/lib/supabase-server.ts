import { createClient } from "@supabase/supabase-js";
import type { AuditResult } from "@/types/audit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseServerClient() {
  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function fetchAuditById(auditId: string): Promise<{ audit_data: { tools: unknown[]; results: AuditResult } } | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("audits")
    .select("audit_data")
    .eq("id", auditId)
    .single();

  if (error || !data) {
    console.error("Supabase server audit fetch failed", error?.message);
    return null;
  }

  return data as { audit_data: { tools: unknown[]; results: AuditResult } };
}
