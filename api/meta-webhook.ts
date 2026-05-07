import { supabaseAdmin } from "./_lib/supabase";
import { jsonResponse } from "./_lib/auth";

export const config = { runtime: "edge" };

/**
 * Meta Lead Ads webhook endpoint.
 *
 * Setup:
 * 1. Create Meta App in https://developers.facebook.com/apps/
 * 2. Add "Webhooks" product → subscribe to `leadgen` topic
 * 3. Callback URL: https://[your-domain]/api/meta-webhook
 * 4. Verify Token: set the same string in Meta + as META_WEBHOOK_VERIFY_TOKEN env var
 * 5. Subscribe Anna's Page to the leadgen topic
 *
 * GET = Meta verification handshake
 * POST = real lead notifications
 */

interface MetaLeadgenChange {
  field: "leadgen";
  value: {
    leadgen_id: string;
    page_id: string;
    form_id: string;
    ad_id?: string;
    campaign_id?: string;
    adgroup_id?: string;
    created_time: number;
  };
}

interface MetaWebhookEntry {
  id: string;
  time: number;
  changes: MetaLeadgenChange[];
}

interface MetaWebhookBody {
  object: string;
  entry: MetaWebhookEntry[];
}

interface MetaLeadDetails {
  id: string;
  field_data: Array<{ name: string; values: string[] }>;
  created_time?: string;
  ad_id?: string;
  form_id?: string;
  campaign_id?: string;
  adset_id?: string;
}

export default async function handler(req: Request): Promise<Response> {
  // 1. Verification handshake (Meta sends GET on subscription)
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const expected = process.env.META_WEBHOOK_VERIFY_TOKEN;
    if (mode === "subscribe" && expected && token === expected) {
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // 2. Real lead notification
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: MetaWebhookBody;
  try {
    body = (await req.json()) as MetaWebhookBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  if (!supabaseAdmin) {
    return jsonResponse({ error: "Supabase not configured" }, 503);
  }

  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[meta-webhook] META_PAGE_ACCESS_TOKEN missing");
    // Acknowledge to prevent Meta retries — we'll fix the config and replay manually if needed
    return jsonResponse({ ok: true, warn: "no_token" });
  }

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "leadgen") continue;
      const v = change.value;

      // Fetch full lead details from Graph API
      try {
        const r = await fetch(
          `https://graph.facebook.com/v21.0/${v.leadgen_id}?access_token=${encodeURIComponent(accessToken)}`
        );
        const lead: MetaLeadDetails = await r.json();

        // Map field_data -> normalized record
        const fields: Record<string, string> = {};
        for (const fd of lead.field_data || []) {
          fields[fd.name.toLowerCase()] = (fd.values || [])[0] || "";
        }

        const name =
          fields["full_name"] ||
          fields["imię_i_nazwisko"] ||
          fields["imie_i_nazwisko"] ||
          [fields["first_name"], fields["last_name"]].filter(Boolean).join(" ") ||
          null;
        const phone = fields["phone_number"] || fields["telefon"] || null;
        const email = fields["email"] || null;
        const situation =
          fields["na_jakim_etapie_jesteś?"] ||
          fields["na_jakim_etapie_jesteś"] ||
          fields["etap"] ||
          null;

        await supabaseAdmin
          .from("leads")
          .upsert(
            {
              source: "meta_lead_ad",
              name,
              phone,
              email,
              situation,
              consent: true, // Meta Lead Ads requires consent within their flow
              meta_lead_id: lead.id,
              meta_form_id: v.form_id || lead.form_id,
              meta_ad_id: v.ad_id || lead.ad_id,
              meta_campaign_id: v.campaign_id || lead.campaign_id,
              meta_adset_id: v.adgroup_id || lead.adset_id,
              meta_raw: lead as unknown as Record<string, unknown>,
              status: "new",
            },
            { onConflict: "meta_lead_id" }
          );
      } catch (err) {
        console.error("[meta-webhook] Lead fetch/insert failed:", err);
      }
    }
  }

  return jsonResponse({ ok: true });
}
