import { ethers } from "ethers";

const ABI = [
  'function createEscrow(string orderId, address seller) payable',
  'function releasePayment(string orderId) external',
  'function refundBuyer(string orderId) external',
  'event EscrowCreated(string orderId, address buyer, address seller, uint256 amount)',
  'event PaymentReleased(string orderId)',
  'event BuyerRefunded(string orderId)',
];

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
}

function getSigner() {
  const provider = getProvider();
  return new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
}

function getContract() {
  const signer = getSigner();
  return new ethers.Contract(process.env.ESCROW_CONTRACT_ADDRESS!, ABI, signer);
}

export async function createEscrow(
  orderId: string,
  sellerAddress: string,
  amountEth: string
): Promise<string> {
  const contract = getContract();
  const tx = await contract.createEscrow(orderId, sellerAddress, {
    value: ethers.parseEther(amountEth),
  });
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function releasePayment(orderId: string): Promise<string> {
  const contract = getContract();
  const tx = await contract.releasePayment(orderId);
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function refundBuyer(orderId: string): Promise<string> {
  const contract = getContract();
  const tx = await contract.refundBuyer(orderId);
  const receipt = await tx.wait();
  return receipt.hash;
}