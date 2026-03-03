import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";

// GET /api/products — public, supports ?category= filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let result;
    if (category && category !== 'All') {
      result = await query(
        `SELECT p.*, u.name as seller_name, u.wallet_address as seller_wallet_address
         FROM products p
         JOIN users u ON u.id = p.seller_id
         WHERE p.in_stock = true AND p.category = $1
         ORDER BY p.created_at DESC`,
        [category]
      );
    } else {
      result = await query(
        `SELECT p.*, u.name as seller_name, u.wallet_address as seller_wallet_address
         FROM products p
         JOIN users u ON u.id = p.seller_id
         WHERE p.in_stock = true
         ORDER BY p.created_at DESC`
      );
    }

    return NextResponse.json({ products: result.rows });
  } catch (err) {
    console.error('Products GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/products — seller only, creates a new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, category, image_url, in_stock } = await req.json();

    if (!name || !price || !image_url) {
      return NextResponse.json({ error: 'Name, price and image are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO products (seller_id, name, description, price, category, image_url, in_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        session.user.id,
        name,
        description || '',
        Number(price),
        category || 'Other',
        image_url,
        in_stock ?? true,
      ]
    );

    return NextResponse.json({ product: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Products POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
