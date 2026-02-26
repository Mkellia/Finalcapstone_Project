import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { dispute_id, order_id, resolution } = await req.json();

  await query(
    `UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1`,
    [order_id]
  );

  await query(
    `UPDATE payments SET status = 'refunded' WHERE order_id = $1`,
    [order_id]
  );

  await query(
    `UPDATE disputes SET status = 'resolved', resolution = $1 WHERE id = $2`,
    [resolution, dispute_id]
  );

  return NextResponse.json({ success: true });
}