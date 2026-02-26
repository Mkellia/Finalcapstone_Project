import crypto from "crypto";

export function generateOTP(): string {
  return String(crypto.randomInt(100000, 999999));
}

export function generateSecret(): string {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

// kept for backwards compat but not used anymore
export function verifyOTP(token: string, stored: string): boolean {
  return token === stored;
}