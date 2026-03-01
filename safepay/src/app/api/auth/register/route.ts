import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role } = await req.json();

    if (!name || !email || !password || !phone || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // Validate phone — strip spaces, must be digits only after +250 prefix
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number — enter 9 digits (e.g. 7XX XXX XXX)' },
        { status: 400 }
      );
    }
    const fullPhone = `+250${cleanPhone}`;

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const phoneExists = await query('SELECT id FROM users WHERE phone = $1', [fullPhone]);
    if (phoneExists.rows.length > 0) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = await query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role`,
      [name, email, password_hash, fullPhone, role]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}