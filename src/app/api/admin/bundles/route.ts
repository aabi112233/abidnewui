import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.email !== "admin@nexuslearn.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, description, price, courseIds } = await req.json();

    if (!title || !description || !price || !courseIds?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create bundle + link courses
    const bundle = await prisma.bundle.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        courses: {
          create: courseIds.map((courseId: string) => ({ courseId }))
        }
      },
      include: { courses: { include: { course: true } } }
    });

    return NextResponse.json({ success: true, bundleId: bundle.id });

  } catch (error: any) {
    console.error("Bundle Create Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.email !== "admin@nexuslearn.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const bundles = await prisma.bundle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        courses: { include: { course: { select: { id: true, title: true, price: true } } } },
        _count: { select: { purchases: true } }
      }
    });

    return NextResponse.json(bundles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.email !== "admin@nexuslearn.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await req.json();
    await prisma.bundle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
