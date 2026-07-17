import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email.")
  .max(255)
  .transform((v) => v.toLowerCase());

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendOtpEmail(email: string, code: string): Promise<{ delivered: boolean; devCode?: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.OTP_EMAIL_FROM ?? "PrepBuddy <noreply@yourprepbuddy.com>";

  // If Resend (via Lovable connector gateway) is available, send a real email.
  if (lovableKey && resendKey) {
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: `Your PrepBuddy verification code: ${code}`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#F5F6FC;border-radius:16px">
            <h1 style="margin:0 0 8px 0;font-size:20px;color:#14162B">Verify your email</h1>
            <p style="margin:0 0 16px 0;color:#4b5163">Use the code below to complete your PrepBuddy application. This code expires in 10 minutes.</p>
            <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;padding:16px;background:#fff;border-radius:12px;color:#2A4FE0">${code}</div>
            <p style="margin:16px 0 0 0;font-size:12px;color:#7a7f92">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Resend email failed [${res.status}]: ${errorBody}`);
      throw new Error("Could not send verification email. Please try again shortly.");
    }
    return { delivered: true };
  }

  // Dev/setup fallback: no email provider connected. Log to server and return the code
  // so testing works before Lovable Emails / Resend is wired up.
  console.warn(
    `[otp] No email provider configured. OTP for ${email}: ${code}. ` +
      "Set up Lovable Emails or connect Resend to send real emails.",
  );
  return { delivered: false, devCode: code };
}

export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ email: EmailSchema }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Basic rate limit: max 3 OTPs per email in the last 15 minutes.
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("email_otps")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .eq("purpose", "lead_form")
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      throw new Error("Too many codes requested. Please wait a few minutes and try again.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const code_hash = await sha256(code);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin.from("email_otps").insert({
      email: data.email,
      code_hash,
      purpose: "lead_form",
      expires_at,
    });
    if (error) {
      console.error("email_otps insert failed", error);
      throw new Error("Could not send verification code. Please try again.");
    }

    const result = await sendOtpEmail(data.email, code);
    return { ok: true as const, delivered: result.delivered, devCode: result.devCode };
  });

export const verifyOtp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        email: EmailSchema,
        code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code."),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code_hash = await sha256(data.code);

    const { data: rows, error } = await supabaseAdmin
      .from("email_otps")
      .select("id, code_hash, expires_at, verified_at, attempts")
      .eq("email", data.email)
      .eq("purpose", "lead_form")
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("email_otps lookup failed", error);
      throw new Error("Could not verify code. Please try again.");
    }
    const row = rows?.[0];
    if (!row) throw new Error("No pending code. Request a new one.");
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("Code expired. Request a new one.");
    }
    if (row.attempts >= 5) {
      throw new Error("Too many attempts. Request a new code.");
    }

    if (row.code_hash !== code_hash) {
      await supabaseAdmin
        .from("email_otps")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      throw new Error("Incorrect code. Please try again.");
    }

    await supabaseAdmin
      .from("email_otps")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", row.id);

    return { ok: true as const, email: data.email };
  });
