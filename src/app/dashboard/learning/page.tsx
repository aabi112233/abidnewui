import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MyLearningClient from "./MyLearningClient";

export default async function MyLearningPage() {
  const session = await auth();

  const purchases = await prisma.purchase.findMany({
    where: { user: { email: session?.user?.email }, status: "APPROVED" },
    include: {
      course: {
        include: {
          sections: {
            include: { lessons: { select: { id: true } } },
          },
        },
      },
      bundle: {
        include: {
          courses: {
            include: {
              course: {
                include: {
                  sections: {
                    include: { lessons: { select: { id: true } } },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const courseMap = new Map<string, any>();
  for (const purchase of purchases) {
    if (purchase.itemType === "COURSE" && purchase.course) {
      courseMap.set(purchase.course.id, purchase.course);
    }
    if (purchase.itemType === "BUNDLE" && purchase.bundle) {
      for (const bc of purchase.bundle.courses) {
        if (bc.course) courseMap.set(bc.course.id, bc.course);
      }
    }
  }

  const unlockedCourses = Array.from(courseMap.values());

  // Fetch progress for all unlocked courses
  let progressMap: Record<string, Set<string>> = {};
  if (session?.user?.email && unlockedCourses.length > 0) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      const progressRecords = await prisma.courseProgress.findMany({
        where: { userId: user.id, completed: true },
        select: { lessonId: true, courseId: true },
      });
      for (const rec of progressRecords) {
        if (!progressMap[rec.courseId]) progressMap[rec.courseId] = new Set();
        progressMap[rec.courseId].add(rec.lessonId);
      }
    }
  }

  // Compute progress % for each course
  const coursesWithProgress = unlockedCourses.map((course) => {
    const totalLessons = course.sections.reduce(
      (s: number, sec: any) => s + sec.lessons.length, 0
    );
    const completedCount = progressMap[course.id]?.size || 0;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    return {
      id: course.id,
      title: course.title,
      thumbnailUrl: course.thumbnailUrl,
      duration: course.duration,
      totalLessons,
      completedCount,
      progressPercent,
      sections: course.sections,
    };
  });

  return <MyLearningClient courses={coursesWithProgress} />;
}
