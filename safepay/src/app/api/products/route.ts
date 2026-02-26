import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let result;
    if (category && category !== 'All') {
      result = await query(
        `SELECT p.*, u.name as seller_name
         FROM products p
         JOIN users u ON u.id = p.seller_id
         WHERE p.in_stock = true AND p.category = $1
         ORDER BY p.created_at DESC`,
        [category]
      );
    } else {
      result = await query(
        `SELECT p.*, u.name as seller_name
         FROM products p
         JOIN users u ON u.id = p.seller_id
         WHERE p.in_stock = true
         ORDER BY p.created_at DESC`
      );
    }

    return NextResponse.json({ products: result.rows });
  } catch (err) {
    console.error('Products API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}