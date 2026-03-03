// lib/blockchain.ts
import { createPublicClient, createWalletClient, http, isAddress, parseAbi, parseEther } from "viem";
import { mainnet, polygon, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// ─── ABI — only the functions this app needs ──────────────────────────────────
const ESCROW_ABI = parseAbi([
  "function createEscrow(string orderId, address seller, bytes sig) payable",
  "function releasePayment(string orderId) nonpayable",
  "function refundBuyer(string orderId) nonpayable",
  "function claimTimeout(string orderId) nonpayable",
  "function getEscrow(string orderId) view returns ((address buyer, address seller, uint256 amount, uint256 createdAt, uint8 status))",
  "function getEscrowByKey(bytes32 key) view returns ((address buyer, address seller, uint256 amount, uint256 createdAt, uint8 status))",
  "function orderKey(string orderId) pure returns (bytes32)",
  "function feeBps() view returns (uint256)",
  "function paused() view returns (bool)",
  "event EscrowCreated(string indexed orderId, bytes32 indexed key, address indexed buyer, address seller, uint256 amount)",
  "event PaymentReleased(string indexed orderId, bytes32 indexed key, address indexed seller, uint256 sellerAmount, uint256 fee)",
  "event PaymentRefunded(string indexed orderId, bytes32 indexed key, address indexed buyer, uint256 amount)",
]);

// ─── EscrowStatus enum mirrors the contract ───────────────────────────────────
export const EscrowStatus = {
  FUNDED:   0,
  RELEASED: 1,
  REFUNDED: 2,
} as const;
export type EscrowStatusType = (typeof EscrowStatus)[keyof typeof EscrowStatus];

// ─── Config (all values come from env) ───────────────────────────────────────
const CONTRACT_ADDRESS  = process.env.ESCROW_CONTRACT_ADDRESS  as `0x${string}`;
const OWNER_PRIVATE_KEY = (process.env.ESCROW_OWNER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY) as `0x${string}`;
const RPC_URL           = process.env.CHAIN_RPC_URL || process.env.SEPOLIA_RPC_URL;
const CHAIN_ID          = Number(process.env.CHAIN_ID ?? "11155111");

if (!CONTRACT_ADDRESS)  throw new Error("Missing env: ESCROW_CONTRACT_ADDRESS");
if (!OWNER_PRIVATE_KEY) throw new Error("Missing env: ESCROW_OWNER_PRIVATE_KEY (or DEPLOYER_PRIVATE_KEY)");
if (!RPC_URL)           throw new Error("Missing env: CHAIN_RPC_URL");

function resolveChain(chainId: number) {
  switch (chainId) {
    case 1:
      return mainnet;
    case 137:
      return polygon;
    case 11155111:
    default:
      return sepolia;
  }
}
const CHAIN = resolveChain(CHAIN_ID);

// ─── Viem client factory ──────────────────────────────────────────────────────
function getClients() {
  const account = privateKeyToAccount(OWNER_PRIVATE_KEY);

  const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: CHAIN,
    transport: http(RPC_URL),
  });

  return { publicClient, walletClient, account };
}

// ─── Helper: read escrow state ────────────────────────────────────────────────
export async function getEscrow(orderId: string) {
  const { publicClient } = getClients();

  const data = await publicClient.readContract({
    address:      CONTRACT_ADDRESS,
    abi:          ESCROW_ABI,
    functionName: "getEscrow",
    args:         [orderId],
  }) as { buyer: `0x${string}`; seller: `0x${string}`; amount: bigint; createdAt: bigint; status: number };

  return {
    buyer:     data.buyer,
    seller:    data.seller,
    amount:    data.amount,           // in wei
    createdAt: Number(data.createdAt),
    status:    data.status as EscrowStatusType,
  };
}

// ─── Helper: release payment to seller (called after OTP confirmation) ────────
export async function releasePayment(orderId: string): Promise<string> {
  const { publicClient, walletClient, account } = getClients();

  // Verify state before sending tx
  const escrow = await getEscrow(orderId);
  if (escrow.status !== EscrowStatus.FUNDED) {
    throw new Error(`Cannot release: escrow status is ${escrow.status} (expected FUNDED=0)`);
  }

  // Simulate to catch revert reasons early (saves gas on failure)
  const { request } = await publicClient.simulateContract({
    address:      CONTRACT_ADDRESS,
    abi:          ESCROW_ABI,
    functionName: "releasePayment",
    args:         [orderId],
    account,
  });

  const txHash = await walletClient.writeContract(request);

  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}

// ─── Helper: refund buyer (called by admin on dispute resolution) ─────────────
export async function refundBuyer(orderId: string): Promise<string> {
  const { publicClient, walletClient, account } = getClients();

  // Guard: only call if still FUNDED
  const escrow = await getEscrow(orderId);
  if (escrow.status !== EscrowStatus.FUNDED) {
    throw new Error(`Cannot refund: escrow status is ${escrow.status} (expected FUNDED=0)`);
  }

  // Simulate first
  const { request } = await publicClient.simulateContract({
    address:      CONTRACT_ADDRESS,
    abi:          ESCROW_ABI,
    functionName: "refundBuyer",
    args:         [orderId],
    account,
  });

  const txHash = await walletClient.writeContract(request);

  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}

// ─── Helper: create escrow on-chain (called at crypto checkout) ───────────────
export async function createEscrow(
  orderId: string,
  seller: string,
  amountEth: string
): Promise<string> {
  if (!isAddress(seller)) {
    throw new Error(`Invalid seller wallet address: ${seller}`);
  }

  const { publicClient, walletClient, account } = getClients();
  const amount = parseEther(amountEth);
  const sig = await signCreateEscrow(orderId, seller as `0x${string}`, amount);

  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: "createEscrow",
    args: [orderId, seller as `0x${string}`, sig],
    value: amount,
    account,
  });

  const txHash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}

// ─── Helper: sign a createEscrow payload (called server-side before buyer tx) ──
export async function signCreateEscrow(
  orderId: string,
  seller:  `0x${string}`,
  amount:  bigint
): Promise<`0x${string}`> {
  const { walletClient } = getClients();

  // Must match the hash in the contract:
  // keccak256(abi.encodePacked(orderId, seller, msg.value))
  const { keccak256, encodePacked, toBytes } = await import("viem");

  const hash = keccak256(
    encodePacked(["string", "address", "uint256"], [orderId, seller, amount])
  );

  // Sign with Ethereum prefix (\x19Ethereum Signed Message:\n32)
  const sig = await walletClient.signMessage({ message: { raw: toBytes(hash) } });
  return sig;
}
