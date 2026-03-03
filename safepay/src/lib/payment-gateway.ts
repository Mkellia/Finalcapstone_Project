import { createEscrow } from "@/lib/blockchain";

export type PaymentMethod = 'mobile_money' | 'bank_transfer' | 'crypto';

export interface PaymentResult {
  success:     boolean;
  tx_hash:     string;
  method:      PaymentMethod;
  amount:      number;
  gateway_ref: string;
  message:     string;
}

function fakeTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

async function simulateFiatPayment(
  amount: number,
  method: PaymentMethod
): Promise<PaymentResult> {
  // Simulate gateway processing delay
  await new Promise(r => setTimeout(r, 2000));

  const success = Math.random() > 0.05; // 95% success rate

  if (!success) {
    return {
      success:     false,
      tx_hash:     '',
      method,
      amount,
      gateway_ref: '',
      message:     'Payment declined by gateway. Please try again.',
    };
  }

  const prefix     = method === 'mobile_money' ? 'MTN' : 'BNK';
  const gatewayRef = prefix + Math.random().toString(36).substring(2, 10).toUpperCase();

  return {
    success:     true,
    tx_hash:     fakeTxHash(),
    method,
    amount,
    gateway_ref: gatewayRef,
    message:     method === 'mobile_money'
      ? `MTN Mobile Money payment of ${amount.toLocaleString()} RWF confirmed`
      : `Bank Transfer of ${amount.toLocaleString()} RWF confirmed`,
  };
}

async function simulateCryptoEscrow(
  orderId: string,
  amount:  number,
  sellerWalletAddress?: string,
): Promise<PaymentResult> {
  if (!sellerWalletAddress) {
    return {
      success: false,
      tx_hash: '',
      method: 'crypto',
      amount,
      gateway_ref: '',
      message: 'Seller wallet address is missing. Ask seller to save wallet before crypto checkout.',
    };
  }

  const rwfPerEth = Number(process.env.SEPOLIA_RWF_PER_ETH || '4000000');
  const minEscrowEth = Number(process.env.SEPOLIA_MIN_ESCROW_ETH || '0.00001');
  const amountEth = Math.max(amount / rwfPerEth, minEscrowEth);

  let tx_hash = '';
  try {
    tx_hash = await createEscrow(orderId, sellerWalletAddress, amountEth.toFixed(8));
  } catch (err: unknown) {
    const msg =
      typeof err === 'object' && err !== null && 'message' in err
        ? String((err as { message?: string }).message)
        : 'Unknown blockchain error';
    return {
      success: false,
      tx_hash: '',
      method: 'crypto',
      amount,
      gateway_ref: '',
      message: `Sepolia escrow failed: ${msg}`,
    };
  }

  return {
    success:     true,
    tx_hash,
    method:      'crypto',
    amount,
    gateway_ref: tx_hash,
    message:     `ETH locked in escrow on Sepolia testnet (${amountEth.toFixed(6)} ETH)`,
  };
}

export async function processPayment(
  orderId: string,
  amount:  number,
  method:  PaymentMethod,
  sellerWalletAddress?: string,
): Promise<PaymentResult> {
  if (method === 'crypto') {
    return simulateCryptoEscrow(orderId, amount, sellerWalletAddress);
  }
  return simulateFiatPayment(amount, method);
}
