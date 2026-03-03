import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { authOptions } from "@/lib/auth";
import { signCreateEscrow } from "@/lib/blockchain";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, seller, amountWei } = await req.json();

    if (!orderId || !seller || !amountWei) {
      return NextResponse.json(
        { error: "orderId, seller and amountWei are required" },
        { status: 400 }
      );
    }

    if (!isAddress(String(seller))) {
      return NextResponse.json({ error: "Invalid seller address" }, { status: 400 });
    }

    const wei = BigInt(String(amountWei));
    if (wei <= BigInt(0)) {
      return NextResponse.json({ error: "amountWei must be > 0" }, { status: 400 });
    }

    const signature = await signCreateEscrow(orderId, seller as `0x${string}`, wei);

    return NextResponse.json({
      signature,
      contractAddress:
        process.env.ESCROW_CONTRACT_ADDRESS ||
        process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS,
      chainId: Number(process.env.CHAIN_ID ?? "11155111"),
    });
  } catch (err: unknown) {
    const message =
      typeof err === "object" && err !== null && "message" in err
        ? String((err as { message?: string }).message)
        : "Unknown error";
    console.error("Crypto sign error:", err);
    return NextResponse.json({ error: "Failed to sign escrow payload", details: message }, { status: 500 });
  }
}
