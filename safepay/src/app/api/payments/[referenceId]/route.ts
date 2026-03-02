import { NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/momo";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ referenceId: string }> }
) {
  try {
    const { referenceId } = await params;
    const data = await getPaymentStatus(referenceId);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const details =
      typeof err === "object" && err !== null
        ? (err as { response?: { data?: unknown }; message?: string }).response?.data ??
          (err as { message?: string }).message ??
          "Unknown error"
        : "Unknown error";
    console.error("MoMo status error:", details);
    return NextResponse.json(
      { error: "Status check failed", details },
      { status: 500 }
    );
  }
}
