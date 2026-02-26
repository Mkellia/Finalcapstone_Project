import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import { generateOTP } from "@/lib/otp";

function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST!,
    port:   Number(process.env.SMTP_PORT!),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
    tls: { rejectUnauthorized: false },
  });
}

async function sendOtpEmail(
  to: string,
  buyerName: string,
  otp: string,
  itemName: string
) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from:    `"SafePay" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Your SafePay OTP: ${otp}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:16px;">
        <h1 style="color:#1565c0;text-align:center;">🔐 SafePay</h1>
        <div style="background:white;border-radius:12px;padding:24px;border:1px solid #e5e7eb;">
          <p>Hi <strong>${buyerName}</strong>,</p>
          <p>Your delivery OTP for <strong>${itemName}</strong>:</p>
          <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;
            padding:20px;text-align:center;margin:20px 0;">
            <p style="margin:0;font-size:13px;color:#1d4ed8;font-weight:600;">YOUR OTP CODE</p>
            <p style="margin:8px 0 0;font-size:48px;font-weight:900;
              color:#1e40af;letter-spacing:12px;">${otp}</p>
            <p style="margin:8px 0 0;font-size:12px;color:#3b82f6;">⏱ Expires in 5 minutes</p>
          </div>
          <p style="color:#6b7280;font-size:13px;">
            Share this code with your seller <strong>only when they deliver your item</strong>.
          </p>
          <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;
            padding:12px;margin-top:16px;">
            <p style="margin:0;font-size:12px;color:#92400e;">
              ⚠️ Never share this code before receiving your item.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { order_id, action } = body;

  if (!order_id || !action) {
    return NextResponse.json({ error: 'Missing order_id or action' }, { status: 400 });
  }

  // ── GENERATE ──────────────────────────────────────────────
  if (action === 'generate') {
    try {
      const otp     = generateOTP(); // plain 6-digit string e.g. "482910"
      const expires = new Date(Date.now() + 5 * 60 * 1000);

      // Store the ACTUAL OTP code (not a secret) so we can compare directly
      await query(
        `UPDATE orders SET otp_code = $1, otp_expires_at = $2 WHERE id = $3`,
        [otp, expires.toISOString(), order_id]
      );

      // Get buyer info for email
      const orderRes = await query(
        `SELECT o.item_name, u.email, u.name
         FROM orders o
         JOIN users u ON u.id = o.buyer_id
         WHERE o.id = $1`,
        [order_id]
      );

      const order = orderRes.rows[0];
      let email_sent = false;

      if (order?.email) {
        try {
          await sendOtpEmail(order.email, order.name, otp, order.item_name);
          email_sent = true;
          console.log(`✅ OTP ${otp} sent to ${order.email}`);
        } catch (emailErr) {
          console.error('❌ Email error:', emailErr);
        }
      }

      return NextResponse.json({
        otp,                          // always return so UI can show it
        expires: expires.toISOString(),
        email_sent,
      });

    } catch (err) {
      console.error('Generate error:', err);
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }
  }

 // ── VERIFY ────────────────────────────────────────────────
 if (action === 'verify') {
    try {
      const { otp_token } = body;

      if (!otp_token) {
        return NextResponse.json({ error: 'Missing OTP' }, { status: 400 });
      }

      // Do expiry check in SQL using DB time — avoids timezone mismatch
      const result = await query(
        `SELECT 
           otp_code,
           otp_expires_at,
           NOW() as db_now,
           otp_expires_at > NOW() as still_valid
         FROM orders WHERE id = $1`,
        [order_id]
      );

      const order = result.rows[0];

      console.log('OTP debug:', {
        stored:      order?.otp_code,
        entered:     otp_token,
        expires:     order?.otp_expires_at,
        db_now:      order?.db_now,
        still_valid: order?.still_valid,
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (!order.otp_code) {
        return NextResponse.json({ error: 'No OTP generated for this order' }, { status: 400 });
      }

      if (!order.still_valid) {
        return NextResponse.json(
          { error: 'OTP has expired. Please generate a new one.' },
          { status: 400 }
        );
      }

      if (otp_token.trim() !== order.otp_code.trim()) {
        return NextResponse.json({ error: 'Invalid OTP code' }, { status: 400 });
      }

      await query(
        `UPDATE orders SET status = 'completed', otp_code = null, updated_at = NOW() WHERE id = $1`,
        [order_id]
      );
      await query(
        `UPDATE payments SET status = 'released' WHERE order_id = $1`,
        [order_id]
      );

      return NextResponse.json({ success: true, message: 'Delivery confirmed. Payment released.' });

    } catch (err) {
      console.error('Verify error:', err);
      return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}