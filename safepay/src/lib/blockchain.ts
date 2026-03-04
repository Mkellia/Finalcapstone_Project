import {
  createPublicClient,
  createWalletClient,
  http,
  isAddress,
  parseAbi,
  parseEther,
  keccak256,
  encodePacked,
  toBytes,
} from "viem";
import { mainnet, polygon, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const ESCROW_ABI = parseAbi([
  "function createEscrow(string orderId, address seller, bytes sig) payable",
  "function releasePayment(string orderId) nonpayable",
  "function refundBuyer(string orderId) nonpayable",
  "function getEscrow(string orderId) view returns ((address buyer, address seller, uint256 amount, uint256 createdAt, uint8 status))",
  "function getEscrowByKey(bytes32 key) view returns ((address buyer, address seller, uint256 amount, uint256 createdAt, uint8 status))",
  "function orderKey(string orderId) pure returns (bytes32)",
  "function getBalance() view returns (uint256)",
  "event EscrowCreated(string indexed orderId, bytes32 indexed key, address indexed buyer, address seller, uint256 amount)",
  "event PaymentReleased(string indexed orderId, bytes32 indexed key, address indexed seller, uint256 sellerAmount, uint256 fee)",
  "event PaymentRefunded(string indexed orderId, bytes32 indexed key, address indexed buyer, uint256 amount)",
]);

export const EscrowStatus = {
  FUNDED: 0,
  RELEASED: 1,
  REFUNDED: 2,
} as const;
export type EscrowStatusType = (typeof EscrowStatus)[keyof typeof EscrowStatus];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS?.trim() as
  | `0x${string}`
  | undefined;
const OWNER_PRIVATE_KEY = (
  process.env.ESCROW_OWNER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY
)?.trim();
const RPC_URL = (process.env.CHAIN_RPC_URL || process.env.SEPOLIA_RPC_URL)?.trim();
const CHAIN_ID = Number(process.env.CHAIN_ID ?? "11155111");

function hasPlaceholderRpc(url: string): boolean {
  const value = url.toLowerCase();
  return (
    value.includes("your_inf") ||
    value.includes("your_key") ||
    value.endsWith("/v3/") ||
    value.endsWith("/v2/")
  );
}

function resolveChain(id: number) {
  if (id === 1) return mainnet;
  if (id === 137) return polygon;
  return sepolia;
}
const CHAIN = resolveChain(CHAIN_ID);

function requireConfig() {
  if (!CONTRACT_ADDRESS)
    throw new Error("Missing env: NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS");
  if (!OWNER_PRIVATE_KEY)
    throw new Error("Missing env: ESCROW_OWNER_PRIVATE_KEY");
  if (!RPC_URL) throw new Error("Missing env: CHAIN_RPC_URL");
  if (hasPlaceholderRpc(RPC_URL)) {
    throw new Error(
      "Invalid env: CHAIN_RPC_URL contains a placeholder. Set a real Sepolia RPC URL (Infura/Alchemy) and restart the server."
    );
  }
}

function getOwnerKey(): `0x${string}` {
  if (!OWNER_PRIVATE_KEY)
    throw new Error("Missing env: ESCROW_OWNER_PRIVATE_KEY");
  return (OWNER_PRIVATE_KEY.startsWith("0x")
    ? OWNER_PRIVATE_KEY
    : `0x${OWNER_PRIVATE_KEY}`) as `0x${string}`;
}

function getClients() {
  requireConfig();
  const account = privateKeyToAccount(getOwnerKey());
  const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL as string),
  });
  const walletClient = createWalletClient({
    account,
    chain: CHAIN,
    transport: http(RPC_URL as string),
  });
  return { publicClient, walletClient, account };
}

export async function getEscrow(orderId: string) {
  requireConfig();
  const { publicClient } = getClients();
  const data = (await publicClient.readContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: "getEscrow",
    args: [orderId],
  })) as {
    buyer: `0x${string}`;
    seller: `0x${string}`;
    amount: bigint;
    createdAt: bigint;
    status: number;
  };

  return {
    buyer: data.buyer,
    seller: data.seller,
    amount: data.amount,
    createdAt: Number(data.createdAt),
    status: data.status as EscrowStatusType,
  };
}

export async function releasePayment(orderId: string): Promise<string> {
  const { publicClient, walletClient, account } = getClients();
  const address = CONTRACT_ADDRESS as `0x${string}`;
  const escrow = await getEscrow(orderId);
  if (escrow.status !== EscrowStatus.FUNDED)
    throw new Error(`Cannot release: status is ${escrow.status} (expected FUNDED=0)`);

  const { request } = await publicClient.simulateContract({
    address,
    abi: ESCROW_ABI,
    functionName: "releasePayment",
    args: [orderId],
    account,
  });
  const txHash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}

export async function refundBuyer(orderId: string): Promise<string> {
  const { publicClient, walletClient, account } = getClients();
  const address = CONTRACT_ADDRESS as `0x${string}`;
  const escrow = await getEscrow(orderId);
  if (escrow.status !== EscrowStatus.FUNDED)
    throw new Error(`Cannot refund: status is ${escrow.status} (expected FUNDED=0)`);

  const { request } = await publicClient.simulateContract({
    address,
    abi: ESCROW_ABI,
    functionName: "refundBuyer",
    args: [orderId],
    account,
  });
  const txHash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  return txHash;
}

export async function createEscrow(
  orderId: string,
  seller: string,
  amountEth: string
): Promise<string> {
  if (!isAddress(seller)) throw new Error(`Invalid seller address: ${seller}`);

  const { publicClient, walletClient, account } = getClients();
  const address = CONTRACT_ADDRESS as `0x${string}`;
  const amount = parseEther(amountEth);
  const sig = await signCreateEscrow(orderId, seller as `0x${string}`, amount);
  const { request } = await publicClient.simulateContract({
    address,
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

export async function signCreateEscrow(
  orderId: string,
  seller: `0x${string}`,
  amount: bigint
): Promise<`0x${string}`> {
  const account = privateKeyToAccount(getOwnerKey());
  const rawHash = keccak256(
    encodePacked(["string", "address", "uint256"], [orderId, seller, amount])
  );
  return account.signMessage({ message: { raw: toBytes(rawHash) } });
}
