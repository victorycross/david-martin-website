// Supabase Edge Function: Send RSVP invitation via Zoho SMTP
// Uses raw SMTP via Deno's TCP sockets with TLS for minimal resource usage.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, name, code, inviteUrl } = await req.json();

    if (!to || !name || !code || !inviteUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, name, code, inviteUrl" }),
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

    const subject = `You're Invited! 2026 Family Reunion RSVP`;

    const htmlBody = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#1a1612;color:#e8ddd0;border-radius:12px;">
  <h1 style="font-size:28px;color:#f0e6d8;text-align:center;margin-bottom:4px;">2026 Family Reunion</h1>
  <p style="text-align:center;color:#b8956a;letter-spacing:3px;font-size:12px;text-transform:uppercase;margin-bottom:32px;">You're Invited</p>
  <p style="color:#d4c4b0;">Hi ${name},</p>
  <p style="color:#d4c4b0;">You're invited to our upcoming Family Reunion! We can't wait to see you.</p>
  <div style="background:rgba(184,149,106,0.1);border:1px solid rgba(184,149,106,0.2);border-radius:8px;padding:16px;margin:24px 0;">
    <p style="margin:4px 0;color:#d4c4b0;">&#x1F4C5; <strong style="color:#f0e6d8;">Sunday, May 3, 2026</strong></p>
    <p style="margin:4px 0;color:#d4c4b0;">&#x23F0; <strong style="color:#f0e6d8;">3:00 p.m. - 7:00 p.m.</strong></p>
    <p style="margin:4px 0;color:#d4c4b0;">&#x1F4CD; <strong style="color:#f0e6d8;">Kelsey's 2nd Floor</strong>, 371 First Street, Collingwood, ON</p>
  </div>
  <p style="color:#d4c4b0;">Please RSVP and choose your meal by <strong style="color:#f0e6d8;">April 7, 2026</strong>:</p>
  <div style="text-align:center;margin:28px 0;">
    <a href="${inviteUrl}" style="display:inline-block;background:linear-gradient(135deg,#b8956a,#9a7a52);color:#1a1612;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;">RSVP Now</a>
  </div>
  <p style="color:#d4c4b0;font-size:13px;">Your access code: <code style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:#b8956a;">${code}</code></p>
  <hr style="border:none;border-top:1px solid rgba(184,149,106,0.15);margin:24px 0;"/>
  <p style="color:#d4c4b0;font-size:12px;text-align:center;opacity:0.6;">With love, The Jorgensen & Martin Family<br/>Questions? <a href="mailto:ken_jorgensen33@yahoo.ca" style="color:#b8956a;">ken_jorgensen33@yahoo.ca</a> or call 647-882-0275</p>
</div>`;

    const textBody = `Hi ${name},\n\nYou're invited to the 2026 Family Reunion!\n\nSunday, May 3, 2026 | 3:00-7:00 p.m.\nKelsey's 2nd Floor, 371 First Street, Collingwood, ON\n\nRSVP here: ${inviteUrl}\nYour code: ${code}\n\nPlease respond by April 7, 2026.\n\nWith love,\nThe Jorgensen & Martin Family\nken_jorgensen33@yahoo.ca | 647-882-0275`;

    // Build MIME message
    const boundary = "----=_Part_" + crypto.randomUUID().replace(/-/g, "");
    const mimeMessage = [
      `From: "Family Reunion" <${smtpUser}>`,
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

    // Connect via TLS to SMTP
    const conn = await Deno.connectTls({ hostname: smtpHost, port: 465 });
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Read until we get a complete SMTP response (final line has space after code, not dash)
    async function readResponse(): Promise<string> {
      let result = "";
      while (true) {
        const buf = new Uint8Array(4096);
        const n = await conn.read(buf);
        if (!n) break;
        result += decoder.decode(buf.subarray(0, n));
        // SMTP multi-line: "250-..." continues, "250 ..." is final
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

    // SMTP handshake
    await readResponse(); // greeting
    await sendCommand("EHLO localhost");

    // AUTH LOGIN (challenge-response: server sends 334 prompts)
    const authStart = await sendCommand("AUTH LOGIN");
    if (!authStart.includes("334")) {
      conn.close();
      return new Response(
        JSON.stringify({ error: "SMTP AUTH not supported: " + authStart.trim() }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const userResp = await sendCommand(btoa(smtpUser));
    if (!userResp.includes("334")) {
      conn.close();
      return new Response(
        JSON.stringify({ error: "SMTP username rejected: " + userResp.trim() }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const authResult = await sendCommand(btoa(smtpPass));

    if (!authResult.includes("235")) {
      conn.close();
      return new Response(
        JSON.stringify({ error: "SMTP auth failed: " + authResult.trim() }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email
    await sendCommand(`MAIL FROM:<${smtpUser}>`);
    await sendCommand(`RCPT TO:<${to}>`);
    await sendCommand("DATA");
    await conn.write(encoder.encode(mimeMessage + "\r\n.\r\n"));
    const dataResult = await readResponse();
    await sendCommand("QUIT");
    conn.close();

    if (!dataResult.includes("250")) {
      return new Response(
        JSON.stringify({ error: "SMTP send failed: " + dataResult.trim() }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: `Invite sent to ${to}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send invite error:", error);
    return new Response(
      JSON.stringify({ error: error.message ?? "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
