import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === "admin@nexuslearn.com";
}

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { purchases: true } },
        sections: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } }
        }
      }
    });
    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const {
      title, slug, description, shortDescription,
      price, originalPrice,
      thumbnailUrl, promoVideoUrl,
      level, duration, language, category,
      tags, whatYoullLearn, requirements,
      contentLinks
    } = await req.json();

    if (!title || !description || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Auto-generate slug from title if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const course = await prisma.course.create({
      data: {
        title,
        slug: finalSlug,
        description,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        thumbnailUrl: thumbnailUrl || null,
        promoVideoUrl: promoVideoUrl || null,
        level: level || "BEGINNER",
        duration: duration || null,
        language: language || "Urdu",
        category: category || null,
        tags: tags ? JSON.stringify(tags) : null,
        whatYoullLearn: whatYoullLearn ? JSON.stringify(whatYoullLearn) : null,
        requirements: requirements ? JSON.stringify(requirements) : null,
        contentLinks: contentLinks || "[]"
      }
    });

    return NextResponse.json({ success: true, courseId: course.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const {
      id, title, slug, description, shortDescription,
      price, originalPrice,
      thumbnailUrl, promoVideoUrl,
      level, duration, language, category,
      tags, whatYoullLearn, requirements,
      isActive
    } = await req.json();

    if (!id) return NextResponse.json({ error: "Missing course ID" }, { status: 400 });

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (shortDescription !== undefined) data.shortDescription = shortDescription;
    if (price !== undefined) data.price = parseFloat(price);
    if (originalPrice !== undefined) data.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl || null;
    if (promoVideoUrl !== undefined) data.promoVideoUrl = promoVideoUrl || null;
    if (level !== undefined) data.level = level;
    if (duration !== undefined) data.duration = duration || null;
    if (language !== undefined) data.language = language;
    if (category !== undefined) data.category = category || null;
    if (tags !== undefined) data.tags = tags ? JSON.stringify(tags) : null;
    if (whatYoullLearn !== undefined) data.whatYoullLearn = whatYoullLearn ? JSON.stringify(whatYoullLearn) : null;
    if (requirements !== undefined) data.requirements = requirements ? JSON.stringify(requirements) : null;
    if (isActive !== undefined) data.isActive = isActive;

    const course = await prisma.course.update({ where: { id }, data });
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id } = await req.json();
    await prisma.bundleCourse.deleteMany({ where: { courseId: id } });
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
