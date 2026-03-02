import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/db";
import pool from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const result = await query(
    `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
  );
  return NextResponse.json({ users: result.rows });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, email, password, role } = await req.json();

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 12);
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
    [name, email, password_hash, role]
  );

  return NextResponse.json({ user: result.rows[0] }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  }

  if (id === session.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own admin account' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Remove rows that may reference this user's orders or account before deleting user.
    await client.query(
      `DELETE FROM payments p
       USING orders o
       WHERE p.order_id = o.id
         AND (o.buyer_id = $1 OR o.seller_id = $1)`,
      [id]
    );

    await client.query(
      `DELETE FROM disputes d
       USING orders o
       WHERE d.order_id = o.id
         AND (o.buyer_id = $1 OR o.seller_id = $1)`,
      [id]
    );

    await client.query(`DELETE FROM disputes WHERE raised_by = $1`, [id]);
    await client.query(`DELETE FROM orders WHERE buyer_id = $1 OR seller_id = $1`, [id]);
    await client.query(`DELETE FROM products WHERE seller_id = $1`, [id]);

    const deleted = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email, role',
      [id]
    );

    if (deleted.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true, user: deleted.rows[0] });
  } catch (err: unknown) {
    await client.query('ROLLBACK');
    const pgErr = err as { code?: string; detail?: string; message?: string };
    console.error('Admin user delete error:', err);

    if (pgErr.code === '23503') {
      return NextResponse.json(
        { error: 'Cannot delete user due to related records', details: pgErr.detail || pgErr.message },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  } finally {
    client.release();
  }
}
