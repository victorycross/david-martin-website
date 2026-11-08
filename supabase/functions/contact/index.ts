// Contact form for david-martin.ca.
// Sends one email to David via Resend. It no longer emails a copy to the address
// the visitor typed, which would let anyone send mail from this domain to any address.
import { Resend } from "npm:resend@4.0.0";

const ALLOWED_ORIGINS = new Set([
  "https://david-martin.ca",
  "https://www.david-martin.ca",
  "http://localhost:8080",
  "http://localhost:5173",
]);

const LIMITS = { name: 100, email: 254, subject: 200, message: 5000 };

const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://david-martin.ca",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  Vary: "Origin",
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400, origin);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ success: true }, 200, origin);

  const field = (k: keyof typeof LIMITS) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const name = field("name");
  const email = field("email");
  const subject = field("subject");
  const message = field("message");

  if (!name || !email || !subject || !message) return json({ error: "Please fill in every field." }, 400, origin);
  for (const [k, max] of Object.entries(LIMITS)) {
    if (field(k as keyof typeof LIMITS).length > max) return json({ error: `The ${k} is too long.` }, 400, origin);
  }
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400, origin);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return json({ error: "The contact form isn't configured yet." }, 503, origin);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "david-martin.ca contact form <david@david-martin.ca>",
      to: ["david@david-martin.ca"],
      replyTo: email,
      subject: `Contact form: ${subject.replace(/[\r\n]+/g, " ")}`,
      html: `
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;margin:10px 0;white-space:pre-wrap;">${escapeHtml(message)}</div>
        <p style="color:#666;font-size:12px;">Sent from the contact form on david-martin.ca. Reply to answer the sender.</p>
      `,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
    if (error) throw new Error(error.message);
    return json({ success: true }, 200, origin);
  } catch (e) {
    console.error("Contact send failed:", e instanceof Error ? e.message : e);
    return json({ error: "Your message couldn't be sent. Please try again later." }, 502, origin);
  }
});
