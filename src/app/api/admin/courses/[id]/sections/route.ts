import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === "admin@nexuslearn.com";
}

// GET /api/admin/courses/[id]/sections
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id } = await params;
    const sections = await prisma.section.findMany({
      where: { courseId: id },
      orderBy: { order: "asc" },
      include: { lessons: { orderBy: { order: "asc" } } }
    });
    return NextResponse.json(sections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/courses/[id]/sections
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id } = await params;
    const { title, order } = await req.json();

    if (!title) return NextResponse.json({ error: "Section title required" }, { status: 400 });

    const section = await prisma.section.create({
      data: { courseId: id, title, order: order ?? 0 },
      include: { lessons: true }
    });
    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/courses/[id]/sections  (rename section)
export async function PATCH(req: Request, { params: _params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { sectionId, title, order } = await req.json();
    if (!sectionId) return NextResponse.json({ error: "sectionId required" }, { status: 400 });
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (order !== undefined) data.order = order;
    const section = await prisma.section.update({ where: { id: sectionId }, data });
    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/courses/[id]/sections
export async function DELETE(req: Request, { params: _params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { sectionId } = await req.json();
    if (!sectionId) return NextResponse.json({ error: "sectionId required" }, { status: 400 });
    await prisma.section.delete({ where: { id: sectionId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
