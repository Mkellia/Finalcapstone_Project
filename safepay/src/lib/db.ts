import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

function resolveSslConfig(connectionString: string) {
  // Let libpq-style sslmode in DATABASE_URL drive SSL behavior when present.
  const sslMode = new URL(connectionString).searchParams.get("sslmode")?.toLowerCase();

  if (!sslMode) {
    return connectionString.includes("localhost") ? false : { rejectUnauthorized: false };
  }

  if (sslMode === "disable") return false;
  if (sslMode === "verify-full" || sslMode === "verify-ca") return { rejectUnauthorized: true };

  // require / prefer / allow default to encrypted connection without cert verification.
  return { rejectUnauthorized: false };
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: resolveSslConfig(DATABASE_URL),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error', err);
});

function isRetryableDbError(err: unknown) {
  if (!err || typeof err !== "object") return false;
  const code = "code" in err ? String((err as { code?: string }).code) : "";
  const message = "message" in err ? String((err as { message?: string }).message) : "";

  return (
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "ECONNREFUSED" ||
    message.includes("Connection terminated") ||
    message.includes("timeout")
  );
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function query(text: string, params?: unknown[]) {
  const attempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(text, params);
      return result;
    } catch (err) {
      lastError = err;
      if (!isRetryableDbError(err) || attempt === attempts) {
        throw err;
      }
      await sleep(250 * attempt);
    } finally {
      client?.release();
    }
  }

  throw lastError;
}

export default pool;
