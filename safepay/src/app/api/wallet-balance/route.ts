import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, formatEther, http, isAddress } from "viem";
import { sepolia } from "viem/chains";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  try {
    const client = createPublicClient({
      chain: sepolia,
      transport: http(process.env.CHAIN_RPC_URL as string),
    });

    const raw = await client.getBalance({ address: address as `0x${string}` });
    const balance = formatEther(raw);

    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
