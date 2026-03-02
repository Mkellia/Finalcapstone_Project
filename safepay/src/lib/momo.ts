import axios from "axios";

const BASE = process.env.MOMO_BASE_URL!;
const SUB_KEY = process.env.MOMO_SUBSCRIPTION_KEY!; // MUST be Collections key
const USER = process.env.MOMO_USER_ID!;
const API_KEY = process.env.MOMO_API_KEY!;
const TARGET = process.env.MOMO_TARGET_ENVIRONMENT ?? "sandbox";
const CURRENCY = process.env.MOMO_CURRENCY ?? "EUR";
const CALLBACK_URL = process.env.MOMO_CALLBACK_URL;

function requireEnv(name: string, val: string | undefined) {
  if (!val) throw new Error(`Missing env var: ${name}`);
}

requireEnv("MOMO_BASE_URL", BASE);
requireEnv("MOMO_SUBSCRIPTION_KEY", SUB_KEY);
requireEnv("MOMO_USER_ID", USER);
requireEnv("MOMO_API_KEY", API_KEY);

async function getAccessToken() {
  const auth = Buffer.from(`${USER}:${API_KEY}`).toString("base64");

  const res = await axios.post(
    `${BASE}/collection/token/`,
    {},
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Ocp-Apim-Subscription-Key": SUB_KEY,
      },
      timeout: 20000,
    }
  );

  return res.data.access_token as string;
}

/**
 * Request To Pay (Collections)
 */
export async function requestToPay(params: {
  amount: string;
  phone: string;       // MSISDN e.g. 25078xxxxxxx
  referenceId: string; // UUID
  externalId: string;  // your cart/order id
}) {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "X-Reference-Id": params.referenceId,
    "X-Target-Environment": TARGET,
    "Ocp-Apim-Subscription-Key": SUB_KEY,
    "Content-Type": "application/json",
  };

  if (CALLBACK_URL) {
    headers["X-Callback-Url"] = CALLBACK_URL;
  }

  await axios.post(
    `${BASE}/collection/v1_0/requesttopay`,
    {
      amount: params.amount,
      currency: CURRENCY,
      externalId: params.externalId,
      payer: { partyIdType: "MSISDN", partyId: params.phone },
      payerMessage: "Payment for SafePay",
      payeeNote: "SafePay escrow",
    },
    {
      headers,
      timeout: 20000,
    }
  );
}

/**
 * Payment status
 */
export async function getPaymentStatus(referenceId: string) {
  const token = await getAccessToken();

  const res = await axios.get(
    `${BASE}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Target-Environment": TARGET,
        "Ocp-Apim-Subscription-Key": SUB_KEY,
      },
      timeout: 20000,
    }
  );

  return res.data; // { status: "PENDING" | "SUCCESSFUL" | "FAILED", ... }
}
