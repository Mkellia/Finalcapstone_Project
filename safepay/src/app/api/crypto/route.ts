// app/api/payments/crypto-sign/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { signCreateEscrow } from "@/lib/blockchain"; // ← from your blockchain.ts

// ─── POST /api/payments/crypto-sign ──────────────────────────────────────────
// Called by the buyer dashboard BEFORE MetaMask opens.
// Returns a backend signature so the contract can verify the escrow is legitimate.
// Without this signature, the contract rejects createEscrow() — preventing
// buyers from creating arbitrary escrows to wrong addresses.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, seller, amountWei } = await req.json();

  // ── Validate inputs ────────────────────────────────────────────────────────
  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }
  if (!seller || !/^0x[0-9a-fA-F]{40}$/.test(seller)) {
    return NextResponse.json({ error: "seller must be a valid Ethereum address" }, { status: 400 });
  }
  if (!amountWei || isNaN(Number(amountWei)) || BigInt(amountWei) <= BigInt(0)) {
    return NextResponse.json({ error: "amountWei must be a positive integer string" }, { status: 400 });
  }

  try {
    // ✅ signCreateEscrow() from blockchain.ts:
    //    - hashes keccak256(abi.encodePacked(orderId, seller, amountWei))
    //    - signs with owner private key (Ethereum prefix applied)
    //    - returns 65-byte hex signature
    //    The contract verifies this signature in createEscrow() to confirm
    //    the backend approved this (orderId, seller, amount) combination.
    const signature = await signCreateEscrow(
      orderId,
      seller as `0x${string}`,
      BigInt(amountWei)
    );

    return NextResponse.json({
      signature,
      contractAddress: process.env.ESCROW_CONTRACT_ADDRESS,
      chainId:         process.env.CHAIN_ID ?? "11155111",
    });

  } catch (err: unknown) {
    console.error("[crypto-sign] Signing failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Signing failed" },
      { status: 500 }
    );
  }
}