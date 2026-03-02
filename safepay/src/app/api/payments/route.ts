import { NextResponse } from "next/server";
import { requestToPay } from "@/lib/momo";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = body?.amount;
    const phoneNumber = body?.phoneNumber;
    const orderId = body?.orderId; // optional (cart id / order id)

    if (!amount || !phoneNumber) {
      return NextResponse.json(
        { error: "amount and phoneNumber are required" },
        { status: 400 }
      );
    }

    const referenceId = uuid();

    await requestToPay({
      amount: String(amount),
      phone: String(phoneNumber),
      referenceId,
      externalId: String(orderId ?? referenceId),
    });

    return NextResponse.json({
      message: "MoMo prompt sent. Approve on phone.",
      referenceId,
    });
  } catch (err: unknown) {
    const details =
      typeof err === "object" && err !== null
        ? (err as { response?: { data?: unknown }; message?: string }).response?.data ??
          (err as { message?: string }).message ??
          "Unknown error"
        : "Unknown error";
    console.error("MoMo payment error:", details);
    return NextResponse.json(
      { error: "Payment request failed", details },
      { status: 500 }
    );
  }
}
