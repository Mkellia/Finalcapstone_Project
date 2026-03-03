import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await query(
    `SELECT wallet_address FROM users WHERE id = $1 LIMIT 1`,
    [session.user.id]
  );

  return NextResponse.json({ wallet_address: result.rows[0]?.wallet_address || "" });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { wallet_address } = await req.json();
  if (wallet_address && !isAddress(wallet_address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
  }

  await query(
    `UPDATE users SET wallet_address = $1 WHERE id = $2`,
    [wallet_address, session.user.id]
  );

  return NextResponse.json({ success: true });
}
