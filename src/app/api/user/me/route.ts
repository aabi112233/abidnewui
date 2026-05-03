import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wallet: true,
        _count: {
          select: { referrals: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If mock user, return mock earnings data
    if (user.isMockUser && user.mockEarnings) {
      try {
        const mockData = JSON.parse(user.mockEarnings as string);
        return NextResponse.json({
          id: user.id,
          name: user.name,
          email: user.email,
          referralCode: user.referralCode,
          wallet: user.wallet,
          savedPaymentMethod: user.savedPaymentMethod,
          _count: {
            referrals: mockData.referralCount || user._count.referrals
          },
          isMockUser: true,
          earningsBreakdown: {
            today: mockData.today || 0,
            last7days: mockData.last7days || 0,
            thisMonth: mockData.thisMonth || 0,
            lifetime: mockData.lifetime || 0
          }
        });
      } catch (e) {}
    }

    // Calculate real earnings breakdown from commissions
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayEarnings, last7DaysEarnings, thisMonthEarnings] = await Promise.all([
      prisma.commission.aggregate({
        where: { toUserId: user.id, createdAt: { gte: startOfToday } },
        _sum: { amount: true }
      }),
      prisma.commission.aggregate({
        where: { toUserId: user.id, createdAt: { gte: last7Days } },
        _sum: { amount: true }
      }),
      prisma.commission.aggregate({
        where: { toUserId: user.id, createdAt: { gte: startOfMonth } },
        _sum: { amount: true }
      })
    ]);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      wallet: user.wallet,
      savedPaymentMethod: user.savedPaymentMethod,
      _count: user._count,
      isMockUser: false,
      earningsBreakdown: {
        today: todayEarnings._sum.amount || 0,
        last7days: last7DaysEarnings._sum.amount || 0,
        thisMonth: thisMonthEarnings._sum.amount || 0,
        lifetime: user.wallet?.totalEarnings || 0
      }
    });

  } catch (error) {
    console.error("Fetch User API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
