import { supabaseAdmin } from "./_lib/supabase";
import { requireAdmin, jsonResponse } from "./_lib/auth";

export const config = { runtime: "edge" };

interface UpdatePayload {
  id: string;
  status?: "new" | "contacted" | "won" | "lost";
  notes?: string;
}

export default async function handler(req: Request): Promise<Response> {
  const authError = requireAdmin(req);
  if (authError) return authError;

  if (req.method !== "POST" && req.method !== "PATCH") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: UpdatePayload;
  try {
    body = (await req.json()) as UpdatePayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  if (!body.id) {
    return jsonResponse({ error: "id required" }, 400);
  }

  if (!supabaseAdmin) {
    return jsonResponse({ error: "Supabase not configured" }, 503);
  }

  const update: Record<string, unknown> = {};
  if (body.status) {
    if (!["new", "contacted", "won", "lost"].includes(body.status)) {
      return jsonResponse({ error: "invalid status" }, 400);
    }
    update.status = body.status;
    if (body.status === "contacted") update.contacted_at = new Date().toISOString();
    if (body.status === "won" || body.status === "lost")
      update.closed_at = new Date().toISOString();
  }
  if (typeof body.notes === "string") update.notes = body.notes;

  if (Object.keys(update).length === 0) {
    return jsonResponse({ error: "nothing to update" }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .update(update)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("[lead-update]", error);
    return jsonResponse({ error: error.message }, 500);
  }

  // Log event
  await supabaseAdmin.from("lead_events").insert({
    lead_id: body.id,
    event_type: "status_change",
    payload: update,
  });

  return jsonResponse({ ok: true, lead: data });
}
