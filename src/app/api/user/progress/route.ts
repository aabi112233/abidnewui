import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/user/progress — mark a lesson as complete
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, courseId } = await req.json();
  if (!lessonId || !courseId) {
    return NextResponse.json({ error: "Missing lessonId or courseId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const record = await prisma.courseProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, courseId, lessonId, completed: true },
    update: { completed: true },
  });

  return NextResponse.json({ success: true, record });
}

// GET /api/user/progress?courseId=xxx — fetch completion for a course
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  if (!courseId) return NextResponse.json({ error: "Missing courseId" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const progress = await prisma.courseProgress.findMany({
    where: { userId: user.id, courseId, completed: true },
    select: { lessonId: true },
  });

  return NextResponse.json({ completedLessonIds: progress.map((p) => p.lessonId) });
}
