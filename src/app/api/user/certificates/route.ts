import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const certificates = await (prisma as any).certificate.findMany({
      where: { userId: user.id },
      orderBy: { issuedAt: "desc" },
      include: {
        course: { select: { title: true, category: true, instructorName: true, duration: true } },
      },
    });

    return NextResponse.json({ certificates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { courseId } = await req.json();
    if (!courseId) return NextResponse.json({ error: "Course ID required" }, { status: 400 });

    // Verify course is complete (100% progress)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { sections: { include: { lessons: { select: { id: true } } } } },
    });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const totalLessons = course.sections.reduce((s: number, sec: any) => s + sec.lessons.length, 0);
    const completedLessons = await prisma.courseProgress.count({
      where: { userId: user.id, courseId, completed: true },
    });

    if (totalLessons === 0 || completedLessons < totalLessons) {
      return NextResponse.json({ error: "Complete all lessons to earn certificate" }, { status: 400 });
    }

    // Check if cert already exists
    const existing = await (prisma as any).certificate.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    if (existing) return NextResponse.json({ certificate: existing });

    const cert = await (prisma as any).certificate.create({
      data: { userId: user.id, courseId },
      include: { course: { select: { title: true, category: true } } },
    });

    return NextResponse.json({ certificate: cert });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
