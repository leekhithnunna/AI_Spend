import { createClient } from "@supabase/supabase-js";
import type { AuditRecord } from "@/types/audit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null if env vars are not set — allows app to work without Supabase
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabaseClient();

// Save an audit result to Supabase
// Returns the audit ID if successful, null otherwise
export async function saveAudit(record: AuditRecord): Promise<string | null> {
  if (!supabase) {
    console.info("Supabase not configured — skipping save");
    return null;
  }

  const { data, error } = await supabase
    .from("audits")
    .insert({
      audit_data: record.audit_data,
      monthly_savings: record.monthly_savings,
      annual_savings: record.annual_savings,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save audit:", error.message);
    return null;
  }

  return data?.id ?? null;
}

// Save a lead to Supabase
export async function saveLead(lead: {
  email: string;
  company?: string;
  role?: string;
  team_size?: number;
  audit_id?: string;
}): Promise<boolean> {
  if (!supabase) {
    console.info("Supabase not configured — skipping lead save");
    return false;
  }

  const { error } = await supabase.from("leads").insert(lead);

  if (error) {
    console.error("Failed to save lead:", error.message);
    return false;
  }

  return true;
}
