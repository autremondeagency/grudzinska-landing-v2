import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[supabase] Missing env vars: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Lead persistence will fail."
  );
}

// Service role client — bypasses RLS. Used only in serverless functions.
export const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export type LeadStatus = "new" | "contacted" | "won" | "lost";
export type LeadSource = "landing" | "meta_lead_ad" | "other";

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  source: LeadSource;
  name: string | null;
  phone: string | null;
  email: string | null;
  situation: string | null;
  message: string | null;
  consent: boolean;
  meta_lead_id: string | null;
  meta_form_id: string | null;
  meta_ad_id: string | null;
  meta_campaign_id: string | null;
  meta_adset_id: string | null;
  meta_raw: Record<string, unknown> | null;
  status: LeadStatus;
  notes: string | null;
  contacted_at: string | null;
  closed_at: string | null;
}
