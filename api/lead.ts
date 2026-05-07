import { supabaseAdmin } from "./_lib/supabase";
import { jsonResponse } from "./_lib/auth";

export const config = { runtime: "edge" };

interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  situation?: string;
  message?: string;
  consent?: boolean;
  source?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  // Required fields
  if (!body.name?.trim() || !body.phone?.trim()) {
    return jsonResponse({ error: "name and phone are required" }, 400);
  }
  if (!body.consent) {
    return jsonResponse({ error: "consent required" }, 400);
  }

  const lead = {
    source: "landing" as const,
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: body.email?.trim() || null,
    situation: body.situation || null,
    message: body.message?.trim() || null,
    consent: true,
    status: "new" as const,
  };

  // Persist
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from("leads").insert(lead);
    if (error) {
      console.error("[lead] Supabase insert failed:", error);
      // We still return 200 to UI — but log to server. Email fallback below could save us.
    }
  } else {
    console.warn("[lead] Supabase not configured. Lead lost:", lead);
  }

  // Notify Anna by email (best-effort, doesn't block UI on error)
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL || "dietetyk.grudzinska@gmail.com";
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Anna Lead <onboarding@resend.dev>",
          to: notifyEmail,
          subject: `🎯 Nowy lead: ${lead.name}`,
          text: [
            `Nowy lead z formularza:`,
            ``,
            `Imię: ${lead.name}`,
            `Telefon: ${lead.phone}`,
            lead.email ? `Email: ${lead.email}` : null,
            lead.situation ? `Etap: ${lead.situation}` : null,
            lead.message ? `Wiadomość: ${lead.message}` : null,
            ``,
            `Panel: https://${req.headers.get("host") || "[domena]"}/panel`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
    } catch (err) {
      console.error("[lead] Resend failed:", err);
    }
  }

  return jsonResponse({ ok: true });
}
