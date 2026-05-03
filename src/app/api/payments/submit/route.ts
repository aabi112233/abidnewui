import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, bundleId, itemType, paymentMethod, transactionId, pricePaid, proofImageUrl } = await req.json();

    if ((!courseId && !bundleId) || !paymentMethod || !transactionId || !pricePaid) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check if TID already submitted (only block APPROVED or PENDING — rejected TIDs are freed)
    const existingTx = await prisma.purchase.findFirst({
      where: {
        transactionId: transactionId.trim(),
        status: { in: ["APPROVED", "PENDING"] }
      }
    });
    if (existingTx) {
      return NextResponse.json({ error: "This Transaction ID has already been used. Please enter a different Transaction ID." }, { status: 400 });
    }

    // Determine item type
    const resolvedType = itemType || (bundleId ? "BUNDLE" : "COURSE");

    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        itemType: resolvedType,
        courseId: courseId || undefined,
        bundleId: bundleId || undefined,
        status: "PENDING",
        paymentMethod,
        transactionId: transactionId.trim(),
        pricePaid: parseFloat(pricePaid),
        proofImageUrl: proofImageUrl || ""
      }
    });

    return NextResponse.json({ success: true, purchaseId: purchase.id });

  } catch (error: any) {
    console.error("Payment Submission Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
