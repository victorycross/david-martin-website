// Supabase Edge Function: Send RSVP invitation via Zoho SMTP
// Invoked from the admin panel to send personalized invite emails.

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
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
    const smtpHost = Deno.env.get("ZOHO_SMTP_HOST") ?? "smtppro.zoho.ca";

    if (!smtpUser || !smtpPass) {
      return new Response(
        JSON.stringify({ error: "SMTP credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: 465,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    const subject = `You're Invited! 2026 Family Reunion RSVP`;

    const textBody = [
      `Hi ${name},`,
      ``,
      `You're invited to the 2026 Family Reunion!`,
      ``,
      `📅 Sunday, May 3, 2026`,
      `⏰ 3:00 p.m. – 7:00 p.m.`,
      `📍 Kelsey's 2nd Floor, 371 First Street, Collingwood, ON, L9Y 1B3`,
      ``,
      `Please RSVP and choose your meal by April 7, 2026 using your personal link:`,
      `${inviteUrl}`,
      ``,
      `Your access code is: ${code}`,
      ``,
      `We hope to see you there!`,
      ``,
      `With love,`,
      `Your Family Reunion Planning Committee`,
      ``,
      `Questions? Contact ken_jorgensen33@yahoo.ca or call 647-882-0275`,
    ].join("\n");

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #1a1612; color: #e8ddd0; border-radius: 12px;">
        <h1 style="font-size: 28px; color: #f0e6d8; text-align: center; margin-bottom: 4px;">2026 Family Reunion</h1>
        <p style="text-align: center; color: #b8956a; letter-spacing: 3px; font-size: 12px; text-transform: uppercase; margin-bottom: 32px;">You're Invited</p>

        <p style="color: #d4c4b0;">Hi ${name},</p>
        <p style="color: #d4c4b0;">You're invited to our upcoming Family Reunion! We can't wait to see you.</p>

        <div style="background: rgba(184,149,106,0.1); border: 1px solid rgba(184,149,106,0.2); border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 4px 0; color: #d4c4b0;">📅 <strong style="color: #f0e6d8;">Sunday, May 3, 2026</strong></p>
          <p style="margin: 4px 0; color: #d4c4b0;">⏰ <strong style="color: #f0e6d8;">3:00 p.m. – 7:00 p.m.</strong></p>
          <p style="margin: 4px 0; color: #d4c4b0;">📍 <strong style="color: #f0e6d8;">Kelsey's 2nd Floor</strong>, 371 First Street, Collingwood, ON</p>
        </div>

        <p style="color: #d4c4b0;">Please RSVP and choose your meal by <strong style="color: #f0e6d8;">April 7, 2026</strong>:</p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #b8956a, #9a7a52); color: #1a1612; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">RSVP Now</a>
        </div>

        <p style="color: #d4c4b0; font-size: 13px;">Your access code: <code style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; color: #b8956a;">${code}</code></p>

        <hr style="border: none; border-top: 1px solid rgba(184,149,106,0.15); margin: 24px 0;" />

        <p style="color: #d4c4b0; font-size: 12px; text-align: center; opacity: 0.6;">
          With love, Your Family Reunion Planning Committee<br/>
          Questions? <a href="mailto:ken_jorgensen33@yahoo.ca" style="color: #b8956a;">ken_jorgensen33@yahoo.ca</a> or call 647-882-0275
        </p>
      </div>
    `;

    await client.send({
      from: smtpUser,
      to,
      subject,
      content: textBody,
      html: htmlBody,
    });

    await client.close();

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
