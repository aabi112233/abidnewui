import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Lock, ArrowLeft, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import CoursePlayerClient from "./CoursePlayerClient";

export const dynamic = "force-dynamic";

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // Verify access
  const directPurchase = await prisma.purchase.findFirst({
    where: { user: { email: session.user.email }, status: "APPROVED", itemType: "COURSE", courseId },
  });
  const bundlePurchase = await prisma.purchase.findFirst({
    where: {
      user: { email: session.user.email }, status: "APPROVED", itemType: "BUNDLE",
      bundle: { courses: { some: { courseId } } },
    },
  });

  const hasAccess = !!directPurchase || !!bundlePurchase;

  if (!hasAccess) {
    const pendingPurchase = await prisma.purchase.findFirst({
      where: {
        user: { email: session.user.email },
        OR: [
          { courseId, itemType: "COURSE" },
          { itemType: "BUNDLE", bundle: { courses: { some: { courseId } } } },
        ],
      },
    });

    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Lock className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-3xl font-black text-[var(--text-primary)] mb-3">Access Restricted</h2>
        {pendingPurchase ? (
          <>
            <p className="text-[var(--text-secondary)] mb-2 font-medium">
              Your payment is currently <span className="text-amber-600 font-black">pending verification</span>.
            </p>
            <p className="text-[var(--text-tertiary)] text-sm mb-8">
              Admin will approve your purchase within 24 hours. You&apos;ll get access as soon as it&apos;s reviewed.
            </p>
            <Link href="/dashboard" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <p className="text-[var(--text-secondary)] mb-8 font-medium">
              You haven&apos;t purchased this course yet.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/dashboard/store" className="btn-primary inline-flex items-center gap-2">
                <Zap className="w-4 h-4" /> Go to Store
              </Link>
              <Link href="/dashboard/learning" className="btn-secondary inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> My Courses
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  // Fetch full course data
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) {
    return (
      <div className="p-10 text-center">
        <p className="text-[var(--text-secondary)]">Course not found.</p>
        <Link href="/dashboard/learning" className="btn-primary mt-4 inline-flex">Back to Learning</Link>
      </div>
    );
  }

  const sections = course.sections || [];
  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);

  // Fetch completed lesson IDs for this user+course
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  
  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="text-[var(--text-secondary)]">User account not found.</p>
        <Link href="/login" className="btn-primary mt-4 inline-flex">Please Log In Again</Link>
      </div>
    );
  }

  const completedProgress = await prisma.courseProgress.findMany({
    where: { userId: user.id, courseId, completed: true },
    select: { lessonId: true },
  });

  const initialCompletedIds = completedProgress.map((p) => p.lessonId);

  return (
    <CoursePlayerClient
      course={course as any}
      sections={sections as any}
      totalLessons={totalLessons}
      initialCompletedIds={initialCompletedIds}
    />
  );
}
