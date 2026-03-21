import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { query } from "@/lib/db";

function createTransporter() {
  const secure = String(process.env.SMTP_SECURE ?? "").toLowerCase() === "true";
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST!,
    port:   Number(process.env.SMTP_PORT!),
    secure,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASSWORD! },
    tls: { rejectUnauthorized: false },
  });
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Create table on first use — safe to run every time
  await query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      token      TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used       BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const userRes = await query("SELECT id, name FROM users WHERE email = $1", [email.toLowerCase().trim()]);

  // Return 200 regardless — never reveal whether an email exists
  if (userRes.rows.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const user = userRes.rows[0];
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Invalidate any existing unused tokens for this user
  await query(
    "UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false",
    [user.id]
  );

  await query(
    "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [user.id, token, expires.toISOString()]
  );

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    `"SafePay" <${process.env.EMAIL_FROM}>`,
      to:      email,
      subject: "Reset your SafePay password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:16px;">
          <h1 style="color:#1565c0;text-align:center;margin-bottom:4px;">🔐 SafePay</h1>
          <p style="text-align:center;color:#6b7280;font-size:13px;margin-top:0;">Password Reset</p>
          <div style="background:white;border-radius:12px;padding:24px;border:1px solid #e5e7eb;margin-top:16px;">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p style="color:#374151;">We received a request to reset your SafePay password. Click the button below to choose a new password:</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${resetUrl}"
                 style="background:#1d4ed8;color:white;padding:14px 32px;border-radius:9px;
                        text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">
                Reset Password →
              </a>
            </div>
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:12px;margin-top:8px;">
              <p style="margin:0;font-size:12px;color:#92400e;">
                ⏱ This link expires in <strong>1 hour</strong>. If you didn't request a reset, ignore this email — your password won't change.
              </p>
            </div>
            <p style="margin-top:20px;font-size:12px;color:#9ca3af;">
              Or copy this link into your browser:<br/>
              <span style="color:#3b82f6;word-break:break-all;">${resetUrl}</span>
            </p>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px;">
            SafePay · ALU Capstone Project · Ethereum Sepolia Testnet
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send reset email:", err);
    // Still return ok — token is saved, user can try again
  }

  return NextResponse.json({ ok: true });
}
