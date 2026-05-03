import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === "admin@nexuslearn.com";
}

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const requests = await prisma.withdrawalRequest.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { name: true, email: true, isMockUser: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id, action, adminNote } = await req.json(); // action: "APPROVE" | "REJECT"
    if (!id || !action) return NextResponse.json({ error: "ID and action required" }, { status: 400 });

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { user: { include: { wallet: true } } },
    });
    if (!withdrawal) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "APPROVE") {
      await prisma.withdrawalRequest.update({
        where: { id },
        data: { status: "APPROVED", adminNote: adminNote || null },
      });
      // Move from pendingEarnings → deduct (payment is going out)
      if (withdrawal.user.wallet) {
        await prisma.wallet.update({
          where: { userId: withdrawal.userId },
          data: { pendingEarnings: { decrement: withdrawal.amount } },
        });
      }
    } else if (action === "REJECT") {
      await prisma.withdrawalRequest.update({
        where: { id },
        data: { status: "REJECTED", adminNote: adminNote || null },
      });
      // Refund the balance back
      if (withdrawal.user.wallet) {
        await prisma.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            balance: { increment: withdrawal.amount },
            pendingEarnings: { decrement: withdrawal.amount },
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
