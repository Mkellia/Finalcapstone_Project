// lib/payment-gateway.ts
// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE NOTE:
//   Crypto (ETH) payments are NOT processed here anymore.
//   The buyer signs the escrow directly via MetaMask in the browser.
//   This file only handles fiat (MoMo) payments on the server.
//
//   Crypto flow:
//     1. Browser → POST /api/payments/crypto-sign  (gets backend signature)
//     2. Browser → MetaMask → contract.createEscrow()  (buyer pays on-chain)
//     3. Browser → POST /api/orders  (records tx_hash in DB)
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'mobile_money' | 'crypto';

export interface PaymentResult {
  success:     boolean;
  tx_hash:     string;
  method:      PaymentMethod;
  amount:      number;
  gateway_ref: string;
  message:     string;
}

// ─── MTN Mobile Money ─────────────────────────────────────────────────────────
async function processMoMoPayment(
  amount: number,
  phoneNumber?: string,
  momoReference?: string,
): Promise<PaymentResult> {
  // If a momoReference is passed, the MoMo push was already confirmed
  // by the buyer dashboard polling /api/payments/[referenceId].
  // We just record the result here.
  if (momoReference) {
    const gatewayRef = momoReference;
    return {
      success:     true,
      tx_hash:     `0xMOMO-${gatewayRef}`,  // non-ETH placeholder, makes tx_hash non-null
      method:      'mobile_money',
      amount,
      gateway_ref: gatewayRef,
      message:     `MTN Mobile Money payment of ${amount.toLocaleString()} RWF confirmed`,
    };
  }

  // Fallback: no reference means payment wasn't pre-confirmed (shouldn't happen)
  return {
    success:     false,
    tx_hash:     '',
    method:      'mobile_money',
    amount,
    gateway_ref: '',
    message:     'MoMo reference missing. Payment not confirmed.',
  };
}

// ─── Crypto: record only (actual payment happened in browser via MetaMask) ────
function recordCryptoPayment(
  orderId:  string,
  amount:   number,
  txHash:   string,
): PaymentResult {
  if (!txHash) {
    return {
      success:     false,
      tx_hash:     '',
      method:      'crypto',
      amount,
      gateway_ref: '',
      message:     'No tx_hash provided. MetaMask transaction may have failed.',
    };
  }

  return {
    success:     true,
    tx_hash:     txHash,
    method:      'crypto',
    amount,
    gateway_ref: txHash,   // on-chain tx hash is the canonical reference
    message:     `ETH locked in SafePayEscrow contract (tx: ${txHash.slice(0, 20)}…)`,
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────────
export async function processPayment(
  orderId:        string,
  amount:         number,
  method:         PaymentMethod,
  options?: {
    phoneNumber?:    string;   // MoMo
    momoReference?:  string;   // MoMo pre-confirmed reference ID
    cryptoTxHash?:   string;   // crypto: tx hash from MetaMask (already on-chain)
  }
): Promise<PaymentResult> {
  switch (method) {
    case 'mobile_money':
      return processMoMoPayment(amount, options?.phoneNumber, options?.momoReference);

    case 'crypto':
      return recordCryptoPayment(orderId, amount, options?.cryptoTxHash ?? '');

    default:
      return {
        success:     false,
        tx_hash:     '',
        method:      'mobile_money',
        amount,
        gateway_ref: '',
        message:     `Unknown payment method: ${method}`,
      };
  }
}