import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status, tx_hash } = await req.json();

  const result = await query(
    `UPDATE orders SET status = $1, tx_hash = $2, updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [status, tx_hash ?? null, id]
  );

  return NextResponse.json({ order: result.rows[0] });
}