import { supabaseAdmin } from "./_lib/supabase";
import { requireAdmin, jsonResponse } from "./_lib/auth";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const authError = requireAdmin(req);
  if (authError) return authError;

  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!supabaseAdmin) {
    return jsonResponse({ error: "Supabase not configured" }, 503);
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[leads-list]", error);
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ leads: data ?? [] });
}
