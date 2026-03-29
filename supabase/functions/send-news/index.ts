// Supabase Edge Function: Send news update to all subscribers via Zoho SMTP

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(
  conn: Deno.TlsConn,
  encoder: TextEncoder,
  decoder: TextDecoder,
  from: string,
  to: string,
  subject: string,
  textBody: string,
  htmlBody: string
): Promise<boolean> {
  async function readResponse(): Promise<string> {
    let result = "";
    while (true) {
      const buf = new Uint8Array(4096);
      const n = await conn.read(buf);
      if (!n) break;
      result += decoder.decode(buf.subarray(0, n));
      const lines = result.trim().split("\r\n");
      const lastLine = lines[lines.length - 1];
      if (lastLine.length >= 4 && lastLine[3] === " ") break;
      if (lastLine.length >= 4 && lastLine[3] !== "-") break;
    }
    return result;
  }

  async function sendCommand(cmd: string): Promise<string> {
    await conn.write(encoder.encode(cmd + "\r\n"));
    return await readResponse();
  }

  const boundary = "----=_Part_" + crypto.randomUUID().replace(/-/g, "");
  const mimeMessage = [
    `From: "Family Reunion Updates" <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  // RSET to start fresh for each recipient (reuse connection)
  await sendCommand("RSET");
  const mailFrom = await sendCommand(`MAIL FROM:<${from}>`);
  if (!mailFrom.includes("250")) return false;
  const rcptTo = await sendCommand(`RCPT TO:<${to}>`);
  if (!rcptTo.includes("250")) return false;
  await sendCommand("DATA");
  await conn.write(encoder.encode(mimeMessage + "\r\n.\r\n"));
  const dataResult = await readResponse();
  return dataResult.includes("250");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, body, recipients } = await req.json();

    if (!title || !body || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: title, body, recipients[]" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const smtpUser = Deno.env.get("ZOHO_SMTP_USER") ?? "";
    const smtpPass = Deno.env.get("ZOHO_SMTP_PASS") ?? "";
    const smtpHost = Deno.env.get("ZOHO_SMTP_HOST") ?? "smtppro.zohocloud.ca";

    if (!smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({ error: "SMTP credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = `Family Reunion Update: ${title}`;

    const textBody = `${title}\n\n${body}\n\n---\nVisit https://david-martin.ca/reunion for more details.\nThe Jorgensen & Martin Family`;

    const htmlBody = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#1a1612;color:#e8ddd0;border-radius:12px;">
  <h1 style="font-size:24px;color:#f0e6d8;text-align:center;margin-bottom:4px;">2026 Family Reunion</h1>
  <p style="text-align:center;color:#b8956a;letter-spacing:3px;font-size:11px;text-transform:uppercase;margin-bottom:28px;">Update</p>
  <div style="background:rgba(184,149,106,0.1);border:1px solid rgba(184,149,106,0.2);border-radius:8px;padding:20px;margin-bottom:24px;">
    <h2 style="font-size:18px;color:#f0e6d8;margin:0 0 12px 0;">${title}</h2>
    <p style="color:#d4c4b0;line-height:1.6;margin:0;white-space:pre-line;">${body}</p>
  </div>
  <div style="text-align:center;margin:24px 0;">
    <a href="https://david-martin.ca/reunion" style="display:inline-block;background:linear-gradient(135deg,#b8956a,#9a7a52);color:#1a1612;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:14px;">Visit Reunion Site</a>
  </div>
  <hr style="border:none;border-top:1px solid rgba(184,149,106,0.15);margin:24px 0;"/>
  <p style="color:#d4c4b0;font-size:11px;text-align:center;opacity:0.5;">The Jorgensen & Martin Family</p>
</div>`;

    // Connect and authenticate once
    const conn = await Deno.connectTls({ hostname: smtpHost, port: 465 });
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function readResponse(): Promise<string> {
      let result = "";
      while (true) {
        const buf = new Uint8Array(4096);
        const n = await conn.read(buf);
        if (!n) break;
        result += decoder.decode(buf.subarray(0, n));
        const lines = result.trim().split("\r\n");
        const lastLine = lines[lines.length - 1];
        if (lastLine.length >= 4 && lastLine[3] === " ") break;
        if (lastLine.length >= 4 && lastLine[3] !== "-") break;
      }
      return result;
    }

    async function sendCommand(cmd: string): Promise<string> {
      await conn.write(encoder.encode(cmd + "\r\n"));
      return await readResponse();
    }

    await readResponse();
    await sendCommand("EHLO localhost");
    const authStart = await sendCommand("AUTH LOGIN");
    if (!authStart.includes("334")) {
      conn.close();
      return new Response(
        JSON.stringify({ error: "SMTP AUTH failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    await sendCommand(btoa(smtpUser));
    const authResult = await sendCommand(btoa(smtpPass));
    if (!authResult.includes("235")) {
      conn.close();
      return new Response(
        JSON.stringify({ error: "SMTP auth failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send to each recipient, reusing the connection
    const results: { email: string; success: boolean }[] = [];
    for (const email of recipients) {
      try {
        const ok = await sendEmail(conn, encoder, decoder, smtpUser, email, subject, textBody, htmlBody);
        results.push({ email, success: ok });
      } catch {
        results.push({ email, success: false });
      }
    }

    await sendCommand("QUIT");
    conn.close();

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({ success: true, sent, failed, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send news error:", error);
    return new Response(
      JSON.stringify({ error: error.message ?? "Failed to send news" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
