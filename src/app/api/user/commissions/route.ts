import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const commissions = await prisma.commission.findMany({
      where: { toUserId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        fromUser: { select: { name: true, email: true } },
        purchase: { select: { pricePaid: true, course: { select: { title: true } }, bundle: { select: { title: true } } } },
      },
    });

    const formatted = commissions.map((c: any) => ({
      id: c.id,
      level: c.level,
      amount: c.amount,
      fromUser: c.fromUser?.name || c.fromUser?.email || "Unknown",
      courseName: c.purchase?.course?.title || c.purchase?.bundle?.title || "Package",
      pricePaid: c.purchase?.pricePaid || 0,
      createdAt: c.createdAt,
    }));

    // Per-tier breakdown
    const tierBreakdown = [1, 2, 3, 4].map((level) => {
      const tierCommissions = commissions.filter((c: any) => c.level === level);
      return {
        level,
        totalAmount: tierCommissions.reduce((s: number, c: any) => s + c.amount, 0),
        count: tierCommissions.length,
      };
    });

    return NextResponse.json({ commissions: formatted, tierBreakdown });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
