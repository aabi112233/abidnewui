import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ShoppingBag, Sparkles } from "lucide-react";
import StoreClient from "./StoreClient";

export default async function StorePage() {
  const session = await auth();

  const [courses, bundles, paymentAccounts, userPurchases] = await Promise.all([
    prisma.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        sections: {
          include: { lessons: { select: { id: true } } },
        },
      },
    }),
    prisma.bundle.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
      include: { courses: { include: { course: { select: { id: true, title: true } } } } },
    }),
    (prisma as any).paymentAccount.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    session?.user?.email
      ? prisma.purchase.findMany({
          where: { user: { email: session.user.email }, status: "APPROVED" },
          select: { courseId: true, bundleId: true, itemType: true },
        })
      : Promise.resolve([]),
  ]);

  // Build set of purchased course IDs
  const purchasedCourseIds = new Set<string>();
  const purchasedBundleIds = new Set<string>();

  for (const p of userPurchases) {
    if (p.itemType === "COURSE" && p.courseId) purchasedCourseIds.add(p.courseId);
    if (p.itemType === "BUNDLE" && p.bundleId) purchasedBundleIds.add(p.bundleId);
  }
  for (const bundle of bundles) {
    if (purchasedBundleIds.has(bundle.id)) {
      for (const bc of bundle.courses) {
        purchasedCourseIds.add(bc.course.id);
      }
    }
  }

  // Fetch course progress for owned courses
  let courseProgressMap: Record<string, number> = {};
  if (session?.user?.email && purchasedCourseIds.size > 0) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      const progressRecords = await prisma.courseProgress.findMany({
        where: { userId: user.id, completed: true },
        select: { lessonId: true, courseId: true },
      });

      // Build a map of courseId → completed lesson set
      const completedByCourse: Record<string, Set<string>> = {};
      for (const rec of progressRecords) {
        if (!completedByCourse[rec.courseId]) completedByCourse[rec.courseId] = new Set();
        completedByCourse[rec.courseId].add(rec.lessonId);
      }

      for (const course of courses) {
        const totalLessons = course.sections.reduce((s, sec) => s + sec.lessons.length, 0);
        if (totalLessons > 0 && completedByCourse[course.id]) {
          courseProgressMap[course.id] = Math.round(
            (completedByCourse[course.id].size / totalLessons) * 100
          );
        }
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="mb-6 sm:mb-10 animate-fade-up">
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-900)] via-blue-900 to-[var(--brand-900)] rounded-xl sm:rounded-2xl p-5 sm:p-7 md:p-8 text-white">
          {/* Background sparkles */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 50% 80%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 flex items-start gap-3 sm:gap-4">
            <div className="hidden sm:flex w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm items-center justify-center border border-white/20 flex-shrink-0">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1.5 sm:mb-2">
                Course Store
              </h1>
              <p className="text-white/70 font-medium text-xs sm:text-sm max-w-xl">
                Master high-income skills with our premium courses. Earn referral commissions while you learn.
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-[10px] sm:text-xs font-bold">
                <span className="bg-white/10 backdrop-blur px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 flex items-center gap-1 sm:gap-1.5">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {courses.length} Courses
                </span>
                <span className="bg-green-500/20 backdrop-blur px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-400/30 text-green-300 flex items-center gap-1 sm:gap-1.5">
                  ✓ Lifetime Access
                </span>
                <span className="hidden xs:flex bg-amber-500/20 backdrop-blur px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-400/30 text-amber-300 items-center gap-1 sm:gap-1.5">
                  🏆 Certificate
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <StoreClient
        courses={courses as any}
        bundles={bundles as any}
        paymentAccounts={paymentAccounts}
        purchasedCourseIds={Array.from(purchasedCourseIds)}
        purchasedBundleIds={Array.from(purchasedBundleIds)}
        courseProgressMap={courseProgressMap}
      />
    </div>
  );
}
