import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.email !== "admin@nexuslearn.com") return null;
  return session;
}

export async function GET() {
  const accounts = await prisma.paymentAccount.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const s = await checkAdmin();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  try {
    const body = await req.json();
    const account = await prisma.paymentAccount.create({
      data: {
        label: body.label,
        accountTitle: body.accountTitle,
        accountNumber: body.accountNumber,
        type: body.type,
        logoUrl: body.logoUrl || null,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      }
    });
    return NextResponse.json(account);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const s = await checkAdmin();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  try {
    const body = await req.json();
    const account = await prisma.paymentAccount.update({
      where: { id: body.id },
      data: {
        label: body.label,
        accountTitle: body.accountTitle,
        accountNumber: body.accountNumber,
        type: body.type,
        logoUrl: body.logoUrl || null,
        isActive: body.isActive,
        sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      }
    });
    return NextResponse.json(account);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const s = await checkAdmin();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  try {
    const { id } = await req.json();
    await prisma.paymentAccount.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
