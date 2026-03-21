import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const tokenRes = await query(
    `SELECT id, user_id FROM password_reset_tokens
     WHERE token = $1 AND used = false AND expires_at > NOW()`,
    [token]
  );

  if (tokenRes.rows.length === 0) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const { id: tokenId, user_id } = tokenRes.rows[0];
  const hashed = await bcrypt.hash(password, 12);

  await query("UPDATE users SET password = $1 WHERE id = $2", [hashed, user_id]);
  await query("UPDATE password_reset_tokens SET used = true WHERE id = $1", [tokenId]);

  return NextResponse.json({ ok: true });
}
