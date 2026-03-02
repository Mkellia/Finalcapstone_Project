import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type MomoCallback = {
  status?: string;
  externalId?: string;
  financialTransactionId?: string;
  reason?: { code?: string; message?: string };
  [key: string]: unknown;
};

function normalizeStatus(status?: string) {
  const value = (status || "").toUpperCase();
  if (value === "SUCCESSFUL") return "confirmed";
  if (value === "FAILED" || value === "REJECTED" || value === "TIMEOUT") return "failed";
  return "pending";
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as MomoCallback;
    const status = (payload.status || "").toUpperCase();
    const referenceId = req.headers.get("x-reference-id") || String(payload.externalId || "");

    if (!referenceId) {
      console.warn("MoMo callback received without reference id", payload);
      return NextResponse.json({ received: true, updated: false });
    }

    const txHash = `MOMO:${referenceId}`;
    const paymentStatus = normalizeStatus(status);

    const updatedPayments = await query(
      `UPDATE payments
       SET status = $1
       WHERE tx_hash = $2
       RETURNING order_id`,
      [paymentStatus, txHash]
    );

    if (status === "SUCCESSFUL" && updatedPayments.rowCount > 0) {
      await query(
        `UPDATE orders
         SET status = 'in_escrow', tx_hash = COALESCE(tx_hash, $1), updated_at = NOW()
         WHERE id = ANY($2::uuid[])`,
        [txHash, updatedPayments.rows.map((r: { order_id: string }) => r.order_id)]
      );
    }

    console.log("MoMo callback received:", {
      referenceId,
      status,
      updatedPayments: updatedPayments.rowCount,
      reason: payload.reason,
      financialTransactionId: payload.financialTransactionId,
    });

    return NextResponse.json({
      received: true,
      referenceId,
      status,
      updatedPayments: updatedPayments.rowCount,
    });
  } catch (err: unknown) {
    console.error("MoMo callback error:", err);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
