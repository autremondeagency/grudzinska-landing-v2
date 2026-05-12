/**
 * Meta Conversions API helper — Edge runtime compatible.
 *
 * Sends server-side conversion events to Meta with the same event_id
 * as the browser Pixel, so Meta deduplicates them. PII is SHA-256
 * hashed per Meta's matching requirements.
 */

const PIXEL_ID = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE; // optional, for Events Manager test

const GRAPH_VERSION = "v21.0";

interface CapiUserData {
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null; // _fbp cookie
  fbc?: string | null; // _fbc cookie / fbclid
}

interface CapiEventInput {
  eventName: "Lead" | "CompleteRegistration" | "Contact" | "Schedule" | "ViewContent" | string;
  eventId: string;
  eventSourceUrl?: string;
  userData: CapiUserData;
  customData?: Record<string, unknown>;
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(v: string): string {
  return v.trim().toLowerCase();
}

function normalizePhone(v: string): string {
  // Strip everything except digits. Meta expects E.164-like (digits only, no +).
  const digits = v.replace(/\D/g, "");
  // PL number without country code → prepend 48
  if (digits.length === 9) return `48${digits}`;
  return digits;
}

function splitName(full: string): { fn?: string; ln?: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fn: parts[0].toLowerCase() };
  return {
    fn: parts[0].toLowerCase(),
    ln: parts.slice(1).join(" ").toLowerCase(),
  };
}

/**
 * Fires a single CAPI event. Returns true on HTTP 200, false otherwise.
 * Never throws — failures are logged. Best-effort by design (front-end
 * already fired the Pixel event; CAPI is the redundant signal).
 */
export async function sendCapiEvent(input: CapiEventInput): Promise<boolean> {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    console.warn("[capi] Missing META_PIXEL_ID or META_CAPI_ACCESS_TOKEN — skipping CAPI send.");
    return false;
  }

  const hashedUser: Record<string, string | string[]> = {};

  if (input.userData.email) {
    hashedUser.em = await sha256(normalizeEmail(input.userData.email));
  }
  if (input.userData.phone) {
    hashedUser.ph = await sha256(normalizePhone(input.userData.phone));
  }
  if (input.userData.name) {
    const { fn, ln } = splitName(input.userData.name);
    if (fn) hashedUser.fn = await sha256(fn);
    if (ln) hashedUser.ln = await sha256(ln);
  }
  if (input.userData.clientIpAddress) hashedUser.client_ip_address = input.userData.clientIpAddress;
  if (input.userData.clientUserAgent) hashedUser.client_user_agent = input.userData.clientUserAgent;
  if (input.userData.fbp) hashedUser.fbp = input.userData.fbp;
  if (input.userData.fbc) hashedUser.fbc = input.userData.fbc;

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: hashedUser,
        custom_data: input.customData,
      },
    ],
  };

  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error("[capi] HTTP", res.status, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[capi] fetch failed:", err);
    return false;
  }
}

/**
 * Extracts _fbp / _fbc from Cookie header (Edge runtime — no req.cookies).
 */
export function extractFbCookies(cookieHeader: string | null): { fbp?: string; fbc?: string } {
  if (!cookieHeader) return {};
  const out: { fbp?: string; fbc?: string } = {};
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    const v = rest.join("=");
    if (k === "_fbp") out.fbp = v;
    if (k === "_fbc") out.fbc = v;
  }
  return out;
}
