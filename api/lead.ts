import { supabaseAdmin } from "./_lib/supabase";
import { jsonResponse } from "./_lib/auth";
import { sendCapiEvent, extractFbCookies } from "./_lib/capi";

export const config = { runtime: "edge" };

interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  situation?: string;
  message?: string;
  consent?: boolean;
  source?: string;
  event_id?: string;
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

  // Notify Anna + Patrycja by email (best-effort, doesn't block UI on error)
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmailRaw = process.env.NOTIFY_EMAIL || "dietetyk.grudzinska@gmail.com";
  const notifyEmails = notifyEmailRaw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (resendKey && notifyEmails.length > 0) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Bariatria Lead <onboarding@resend.dev>",
          to: notifyEmails,
          subject: `🎯 Nowy lead: ${lead.name}`,
          text: [
            `Nowy lead z formularza na bariatriadietetyk.blog:`,
            ``,
            `Imię: ${lead.name}`,
            `Telefon: ${lead.phone}`,
            lead.email ? `Email: ${lead.email}` : null,
            lead.situation ? `Etap: ${lead.situation}` : null,
            lead.message ? `Wiadomość: ${lead.message}` : null,
            ``,
            `Panel: https://${req.headers.get("host") || "bariatriadietetyk.blog"}/panel`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("[lead] Resend HTTP error:", res.status, errText);
      }
    } catch (err) {
      console.error("[lead] Resend failed:", err);
    }
  }

  // Server-side Meta CAPI — dedup with Pixel via event_id (best-effort).
  if (body.event_id) {
    const { fbp, fbc } = extractFbCookies(req.headers.get("cookie"));
    const eventSourceUrl =
      req.headers.get("referer") ||
      `https://${req.headers.get("host") || "bariatriadietetyk.blog"}/`;
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      undefined;
    const clientUa = req.headers.get("user-agent") || undefined;

    // Fire Lead + CompleteRegistration (matches what the Pixel sends client-side)
    await Promise.allSettled([
      sendCapiEvent({
        eventName: "Lead",
        eventId: body.event_id,
        eventSourceUrl,
        userData: {
          email: lead.email,
          phone: lead.phone,
          name: lead.name,
          clientIpAddress: clientIp,
          clientUserAgent: clientUa,
          fbp,
          fbc,
        },
      }),
      sendCapiEvent({
        eventName: "CompleteRegistration",
        eventId: body.event_id,
        eventSourceUrl,
        userData: {
          email: lead.email,
          phone: lead.phone,
          name: lead.name,
          clientIpAddress: clientIp,
          clientUserAgent: clientUa,
          fbp,
          fbc,
        },
        customData: {
          content_name: "bariatric_consultation_request",
          status: true,
        },
      }),
    ]);
  }

  return jsonResponse({ ok: true });
}
