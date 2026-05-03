import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";
import LoggedInHome from "@/components/LoggedInHome";

export default async function Home() {
  const session = await auth();

  // If user is logged in, show a personalized post-login home
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        isMockUser: true,
        wallet: { select: { balance: true, totalEarnings: true } },
        _count: { select: { referrals: true } },
      },
    });

    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, price: true, shortDescription: true, thumbnailUrl: true, level: true, category: true, duration: true },
    });

    return (
      <LoggedInHome
        user={{
          name: user?.name || session.user.name || "User",
          email: user?.email || session.user.email,
          referralCode: user?.referralCode || null,
          isMockUser: user?.isMockUser || false,
          wallet: user?.wallet || null,
          referralCount: user?._count?.referrals || 0,
        }}
        courses={courses as any}
      />
    );
  }

  // Public homepage for guests
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  const serialized = courses.map(c => ({
    id:               c.id,
    title:            c.title,
    price:            c.price,
    originalPrice:    (c as any).originalPrice ?? null,
    level:            (c as any).level         ?? "BEGINNER",
    category:         (c as any).category      ?? null,
    thumbnailUrl:     (c as any).thumbnailUrl   ?? null,
    duration:         (c as any).duration       ?? null,
    language:         (c as any).language       ?? "Urdu",
    shortDescription: (c as any).shortDescription ?? c.description ?? null,
  }));

  return <HomePageClient courses={serialized} />;
}
