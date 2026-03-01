import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import { processPayment } from "@/lib/payment-gateway";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role   = new URL(req.url).searchParams.get('role');
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

    // Step 1 — create order as 'pending'
    const orderResult = await query(
      `INSERT INTO orders (buyer_id, seller_id, item_name, amount, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [session.user.id, seller_id, item_name, amount]
    );
    const order = orderResult.rows[0];

    // Step 2 — process payment
    const payment = await processPayment(order.id, Number(amount), payment_method);

    if (!payment.success) {
      // Delete the pending order if payment failed
      await query(`DELETE FROM orders WHERE id = $1`, [order.id]);
      return NextResponse.json({ error: payment.message }, { status: 402 });
    }

    // Step 3 — update order to in_escrow with tx_hash
    await query(
      `UPDATE orders SET status = 'in_escrow', tx_hash = $1, updated_at = NOW()
       WHERE id = $2`,
      [payment.tx_hash, order.id]
    );

    // Step 4 — create payment record
    await query(
      `INSERT INTO payments (order_id, amount, method, status, tx_hash)
       VALUES ($1, $2, $3, 'confirmed', $4)`,
      [order.id, amount, payment_method, payment.tx_hash]
    );

    return NextResponse.json({
      order: { ...order, status: 'in_escrow', tx_hash: payment.tx_hash },
      payment: {
        gateway_ref: payment.gateway_ref,
        message:     payment.message,
        tx_hash:     payment.tx_hash,
      },
    }, { status: 201 });

  } catch (err) {
    console.error('Order error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}