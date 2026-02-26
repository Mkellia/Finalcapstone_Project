import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const result = await query(
    `SELECT d.*, o.item_name, o.amount, b.name as buyer_name, s.name as seller_name
     FROM disputes d
     JOIN orders o ON o.id = d.order_id
     JOIN users b ON b.id = o.buyer_id
     JOIN users s ON s.id = o.seller_id
     ORDER BY d.created_at DESC`
  );

  return NextResponse.json({ disputes: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { order_id, reason } = await req.json();

  await query(
    `UPDATE orders SET status = 'disputed', updated_at = NOW() WHERE id = $1`,
    [order_id]
  );

  const result = await query(
    `INSERT INTO disputes (order_id, raised_by, reason, status)
     VALUES ($1, $2, $3, 'open') RETURNING *`,
    [order_id, session.user.id, reason]
  );

  return NextResponse.json({ dispute: result.rows[0] }, { status: 201 });
}