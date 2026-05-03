import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json([], { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isMockUser: true },
    });
    if (!user) return NextResponse.json([]);

    // Real users only — fetch actual commissions and referrals
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [commissions, referrals, withdrawals] = await Promise.all([
      prisma.commission.findMany({
        where: { toUserId: user.id, createdAt: { gte: last30 } },
        orderBy: { createdAt: "desc" },
        take: 15,
        include: { purchase: { select: { pricePaid: true } } },
      }),
      prisma.user.findMany({
        where: { referredById: user.id, createdAt: { gte: last30 } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { name: true, createdAt: true },
      }),
      prisma.withdrawalRequest.findMany({
        where: { userId: user.id, updatedAt: { gte: last30 }, status: { not: "PENDING" } },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

    function timeAgo(date: Date) {
      const diff = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }

    const notifs = [
      ...commissions.map((c, i) => ({
        id: `comm_${c.id}`,
        type: "earning" as const,
        title: `Commission Received (Level ${c.level})`,
        body: `You earned Rs. ${c.amount.toLocaleString()} from a Level ${c.level} referral purchase`,
        time: timeAgo(new Date(c.createdAt)),
        read: i > 2,
      })),
      ...referrals.map((r, i) => ({
        id: `ref_${r.name}_${i}`,
        type: "referral" as const,
        title: "New Referral Joined! 🎉",
        body: `${r.name} joined the platform via your referral code`,
        time: timeAgo(new Date(r.createdAt)),
        read: i > 1,
      })),
      ...withdrawals.map((w, i) => ({
        id: `wd_${w.id}`,
        type: "withdrawal" as const,
        title: w.status === "APPROVED" ? "Withdrawal Approved ✅" : "Withdrawal Rejected",
        body: `Rs. ${w.amount.toLocaleString()} withdrawal ${w.status === "APPROVED" ? "has been processed to your account" : "was rejected. Contact support."}`,
        time: timeAgo(new Date(w.updatedAt)),
        read: true,
      })),
    ].sort((a, b) => {
      // Keep unread first
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      return 0;
    }).slice(0, 20);

    return NextResponse.json(notifs);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}
