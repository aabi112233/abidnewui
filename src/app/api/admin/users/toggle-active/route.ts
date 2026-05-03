import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.email !== "admin@nexuslearn.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, isActive } = await req.json();

  if (!userId || typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Missing userId or isActive" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  return NextResponse.json({ success: true });
}
