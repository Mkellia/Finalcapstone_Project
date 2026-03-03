// app/api/profile/wallet/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

// ─── POST /api/profile/wallet — save or update wallet address ─────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { wallet_address } = await req.json();

  // Validate Ethereum address format
  if (!wallet_address || !/^0x[0-9a-fA-F]{40}$/.test(wallet_address)) {
    return NextResponse.json(
      { error: "Invalid Ethereum wallet address. Must be 0x followed by 40 hex characters." },
      { status: 400 }
    );
  }

  await query(
    `UPDATE users SET wallet_address = $1, updated_at = NOW() WHERE id = $2`,
    [wallet_address.toLowerCase(), session.user.id]
  );

  return NextResponse.json({ success: true, wallet_address: wallet_address.toLowerCase() });
}

// ─── GET /api/profile/wallet — fetch current wallet ───────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await query(
    `SELECT wallet_address FROM users WHERE id = $1`,
    [session.user.id]
  );

  return NextResponse.json({ wallet_address: result.rows[0]?.wallet_address ?? null });
}