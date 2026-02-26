import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  let result;
  if (role === 'buyer') {
    result = await query(
      `SELECT o.*, u.name as seller_name FROM orders o
       JOIN users u ON u.id = o.seller_id
       WHERE o.buyer_id = $1 ORDER BY o.created_at DESC`,
      [session.user.id]
    );
  } else if (role === 'seller') {
    result = await query(
      `SELECT o.*, u.name as buyer_name FROM orders o
       JOIN users u ON u.id = o.buyer_id
       WHERE o.seller_id = $1 ORDER BY o.created_at DESC`,
      [session.user.id]
    );
  } else {
    result = await query(
      `SELECT o.*, b.name as buyer_name, s.name as seller_name
       FROM orders o
       JOIN users b ON b.id = o.buyer_id
       JOIN users s ON s.id = o.seller_id
       ORDER BY o.created_at DESC`
    );
  }

  return NextResponse.json({ orders: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { seller_id, item_name, amount, payment_method } = await req.json();

    const result = await query(
      `INSERT INTO orders (buyer_id, seller_id, item_name, amount, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [session.user.id, seller_id, item_name, amount]
    );

    const order = result.rows[0];

    await query(
      `INSERT INTO payments (order_id, amount, method, status)
       VALUES ($1, $2, $3, 'pending')`,
      [order.id, amount, payment_method]
    );

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}