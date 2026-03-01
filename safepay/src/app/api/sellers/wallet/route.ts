import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { wallet_address } = await req.json();

  await query(
    `UPDATE users SET wallet_address = $1 WHERE id = $2`,
    [wallet_address, session.user.id]
  );

  return NextResponse.json({ success: true });
}
