/**
 * Basic Auth guard for admin endpoints.
 * Set ADMIN_PASSWORD env var in Vercel.
 * Returns null if authorized, or a Response if not.
 */
export function requireAdmin(req: Request): Response | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new Response(
      JSON.stringify({ error: "Admin not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const auth = req.headers.get("authorization") || "";
  const match = auth.match(/^Basic\s+(.+)$/i);
  if (!match) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Panel Anny", charset="UTF-8"',
      },
    });
  }

  let decoded: string;
  try {
    decoded = atob(match[1]);
  } catch {
    return new Response("Invalid authorization", { status: 400 });
  }

  const [, pass] = decoded.split(":", 2);
  if (pass !== password) {
    return new Response("Invalid password", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Panel Anny", charset="UTF-8"',
      },
    });
  }

  return null;
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
