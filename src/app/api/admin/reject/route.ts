import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.email !== "admin@nexuslearn.com") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { purchaseId } = await req.json();
    if (!purchaseId) {
      return NextResponse.json({ error: "Purchase ID required" }, { status: 400 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    if (purchase.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending payments can be rejected" }, { status: 400 });
    }

    // Reject and clear the transaction ID so it's freed up for reuse
    // The user can now resubmit with a corrected TID + screenshot
    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status: "REJECTED",
        transactionId: `REJECTED_${purchase.transactionId}_${Date.now()}`,
      },
    });

    return NextResponse.json({ success: true, message: "Payment rejected. Transaction ID has been freed for resubmission." });
  } catch (error: any) {
    console.error("Payment Rejection Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
