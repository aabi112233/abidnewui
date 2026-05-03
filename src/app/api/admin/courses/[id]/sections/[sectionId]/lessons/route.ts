import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === "admin@nexuslearn.com";
}

// POST /api/admin/courses/[id]/sections/[sectionId]/lessons
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { sectionId } = await params;
    const { title, url, duration, type, order, isFree, description } = await req.json();

    if (!title) return NextResponse.json({ error: "Lesson title required" }, { status: 400 });

    const lesson = await prisma.lesson.create({
      data: {
        sectionId,
        title,
        url: url || null,
        duration: duration || null,
        type: type || "VIDEO",
        order: order ?? 0,
        isFree: isFree ?? false,
        description: description || null
      }
    });
    return NextResponse.json({ success: true, lesson });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/courses/[id]/sections/[sectionId]/lessons
export async function PATCH(
  req: Request,
  { params: _params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { lessonId, title, url, duration, type, order, isFree, description } = await req.json();

    if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (url !== undefined) data.url = url || null;
    if (duration !== undefined) data.duration = duration || null;
    if (type !== undefined) data.type = type;
    if (order !== undefined) data.order = order;
    if (isFree !== undefined) data.isFree = isFree;
    if (description !== undefined) data.description = description || null;

    const lesson = await prisma.lesson.update({ where: { id: lessonId }, data });
    return NextResponse.json({ success: true, lesson });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/courses/[id]/sections/[sectionId]/lessons
export async function DELETE(
  req: Request,
  { params: _params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { lessonId } = await req.json();
    if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });
    await prisma.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
