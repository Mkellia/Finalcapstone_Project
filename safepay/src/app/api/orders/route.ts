import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import { processPayment } from "@/lib/payment-gateway";

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = new URL(req.url).searchParams.get("role");
  let result;

  if (role === "buyer") {
    result = await query(
      `SELECT o.*, u.name as seller_name FROM orders o
       JOIN users u ON u.id = o.seller_id
       WHERE o.buyer_id = $1 ORDER BY o.created_at DESC`,
      [session.user.id]
    );
  } else if (role === "seller") {
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
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const {
      order_id,
      seller_id,
      item_name,
      amount,
      payment_method,
      momo_reference, // ✅ we will pass this from buyer page after SUCCESSFUL
      crypto_tx_hash,
    } = await req.json();

    if (!seller_id || !item_name || !amount || !payment_method) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (
      payment_method === "crypto" &&
      (!order_id || !UUID_V4_RE.test(String(order_id)))
    ) {
      return NextResponse.json(
        { error: "For crypto orders, order_id must be a valid UUID v4" },
        { status: 400 }
      );
    }

    // Step 1 — create order as 'pending' (or use client-provided id for crypto flow)
    const orderResult = await query(
      payment_method === "crypto" && order_id
        ? `INSERT INTO orders (id, buyer_id, seller_id, item_name, amount, status)
           VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`
        : `INSERT INTO orders (buyer_id, seller_id, item_name, amount, status)
           VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      payment_method === "crypto" && order_id
        ? [order_id, session.user.id, seller_id, item_name, amount]
        : [session.user.id, seller_id, item_name, amount]
    );

    const order = orderResult.rows[0];

    // ✅ If MoMo: we do NOT call processPayment again.
    // We assume buyer already paid (RequestToPay SUCCESSFUL) and is now creating orders.
    if (payment_method === "mobile_money") {
      if (!momo_reference) {
        // payment method is momo but no reference provided → reject
        await query(`DELETE FROM orders WHERE id = $1`, [order.id]);
        return NextResponse.json(
          { error: "Missing momo_reference. Pay with MoMo first." },
          { status: 400 }
        );
      }

      // Step 3 — update order to in_escrow with tx_hash set to momo reference
      await query(
        `UPDATE orders SET status = 'in_escrow', tx_hash = $1, updated_at = NOW()
         WHERE id = $2`,
        [`MOMO:${momo_reference}`, order.id]
      );

      // Step 4 — create payment record
      await query(
        `INSERT INTO payments (order_id, amount, method, status, tx_hash)
         VALUES ($1, $2, $3, 'confirmed', $4)`,
        [order.id, amount, payment_method, `MOMO:${momo_reference}`]
      );

      return NextResponse.json(
        {
          order: { ...order, status: "in_escrow", tx_hash: `MOMO:${momo_reference}` },
          payment: {
            gateway_ref: momo_reference,
            message: "MoMo payment confirmed (client verified)",
            tx_hash: `MOMO:${momo_reference}`,
            method: payment_method,
          },
        },
        { status: 201 }
      );
    }

    // ✅ If Crypto: on-chain MetaMask payment happened on client already.
    if (payment_method === "crypto") {
      if (!crypto_tx_hash) {
        await query(`DELETE FROM orders WHERE id = $1`, [order.id]);
        return NextResponse.json(
          { error: "Missing crypto_tx_hash. Pay with MetaMask first." },
          { status: 400 }
        );
      }

      await query(
        `UPDATE orders SET status = 'in_escrow', tx_hash = $1, updated_at = NOW()
         WHERE id = $2`,
        [crypto_tx_hash, order.id]
      );

      await query(
        `INSERT INTO payments (order_id, amount, method, status, tx_hash)
         VALUES ($1, $2, $3, 'confirmed', $4)`,
        [order.id, amount, payment_method, crypto_tx_hash]
      );

      return NextResponse.json(
        {
          order: { ...order, status: "in_escrow", tx_hash: crypto_tx_hash },
          payment: {
            gateway_ref: crypto_tx_hash,
            message: "Crypto payment confirmed on-chain via MetaMask",
            tx_hash: crypto_tx_hash,
            method: payment_method,
          },
        },
        { status: 201 }
      );
    }

    // ✅ Non-MoMo flows keep your existing gateway behavior
    const payment = await processPayment(order.id, Number(amount), payment_method);

    if (!payment.success) {
      await query(`DELETE FROM orders WHERE id = $1`, [order.id]);
      return NextResponse.json({ error: payment.message }, { status: 402 });
    }

    await query(
      `UPDATE orders SET status = 'in_escrow', tx_hash = $1, updated_at = NOW()
       WHERE id = $2`,
      [payment.tx_hash, order.id]
    );

    await query(
      `INSERT INTO payments (order_id, amount, method, status, tx_hash)
       VALUES ($1, $2, $3, 'confirmed', $4)`,
      [order.id, amount, payment_method, payment.tx_hash]
    );

    return NextResponse.json(
      {
        order: { ...order, status: "in_escrow", tx_hash: payment.tx_hash },
        payment: {
          gateway_ref: payment.gateway_ref,
          message: payment.message,
          tx_hash: payment.tx_hash,
          method: payment_method,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
