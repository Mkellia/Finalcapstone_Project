import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const result = await query(
    `SELECT id, name, email FROM users WHERE role = 'seller' ORDER BY name`
  );
  return NextResponse.json({ sellers: result.rows });
}