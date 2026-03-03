// app/api/admin/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import { refundBuyer } from "@/lib/blockchain";

// ─── POST /api/admin — resolve dispute + optional on-chain refund ─────────────
export async function POST(req: NextRequest) {
  // 1. Auth guard — admin only
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { dispute_id, order_id, resolution } = await req.json();

  if (!dispute_id || !order_id) {
    return NextResponse.json(
      { error: "dispute_id and order_id are required" },
      { status: 400 }
    );
  }

  // 2. Guard: dispute must exist and still be open
  const disputeResult = await query(
    `SELECT id, status FROM disputes WHERE id = $1`,
    [dispute_id]
  );
  if (!disputeResult.rows[0]) {
    return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
  }
  if (disputeResult.rows[0].status === "resolved") {
    return NextResponse.json(
      { error: "Dispute is already resolved" },
      { status: 409 }
    );
  }

  // 3. Fetch payment method
  const pay = await query(
    `SELECT method FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [order_id]
  );
  const method = pay.rows[0]?.method as string | undefined;

  let txHash: string | null = null;

  // 4. On-chain refund for crypto payments
  if (method === "crypto") {
    try {
      // refundBuyer() in @/lib/blockchain calls refundBuyer(orderId) on the
      // SafePayEscrow contract and should return the tx hash
      txHash = await refundBuyer(order_id);
    } catch (chainErr) {
      console.error("[admin] On-chain refund failed:", chainErr);
      return NextResponse.json(
        {
          error: "On-chain refund failed",
          detail: chainErr instanceof Error ? chainErr.message : String(chainErr),
        },
        { status: 500 }
      );
    }
  }

  // 5. Persist results to DB (all three updates in sequence)
  await query(
    `UPDATE orders
        SET status     = 'refunded',
            updated_at = NOW()
      WHERE id = $1`,
    [order_id]
  );

  await query(
    `UPDATE payments
        SET status   = 'refunded',
            tx_hash  = $1
      WHERE order_id = $2`,
    [txHash, order_id]
  );

  await query(
    `UPDATE disputes
        SET status      = 'resolved',
            resolution  = $1,
            tx_hash     = $2,
            resolved_at = NOW()
      WHERE id = $3`,
    [resolution || "Refund approved by admin", txHash, dispute_id]
  );

  return NextResponse.json({
    success: true,
    tx_hash: txHash,
    message: txHash
      ? `On-chain refund confirmed (tx: ${txHash})`
      : "Dispute resolved successfully",
  });
}

// ─── GET /api/admin — list all disputes with order + user info ────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // optional ?status=open|resolved

  const result = await query(
    `SELECT
        d.id,
        d.order_id,
        d.reason,
        d.status,
        d.resolution,
        d.tx_hash,
        d.created_at,
        d.resolved_at,
        o.amount,
        p.method         AS payment_method,
        l.title          AS item_name,
        buyer.full_name  AS buyer_name,
        seller.full_name AS seller_name
      FROM disputes d
      JOIN orders   o      ON o.id       = d.order_id
      JOIN payments p      ON p.order_id = o.id
      JOIN listings l      ON l.id       = o.listing_id
      JOIN profiles buyer  ON buyer.id   = o.buyer_id
      JOIN profiles seller ON seller.id  = o.seller_id
      WHERE ($1::text IS NULL OR d.status = $1)
      ORDER BY d.created_at DESC`,
    [status ?? null]
  );

  return NextResponse.json({ disputes: result.rows });
}