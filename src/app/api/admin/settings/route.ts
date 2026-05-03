import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === "admin@nexuslearn.com";
}

function safeParse(val: string) {
  try { return JSON.parse(val); } catch { return val; }
}

export async function GET(req: Request) {
  try {
    // Allow public access for certain read-only keys via query param
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const publicKey = searchParams.get('public');

    if (publicKey) {
      // Public endpoint for non-sensitive settings
      const allowed = ["MIN_WITHDRAWAL", "ANNOUNCEMENT_HTML", "ANNOUNCEMENT_ACTIVE", "ANNOUNCEMENT_PAGES"];
      if (!allowed.includes(publicKey)) {
        return NextResponse.json({ error: "Not accessible" }, { status: 403 });
      }
      const setting = await prisma.setting.findUnique({ where: { key: publicKey } });
      return NextResponse.json(setting ? safeParse(setting.value) : null);
    }

    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    if (key) {
      const setting = await prisma.setting.findUnique({ where: { key } });
      return NextResponse.json(setting ? safeParse(setting.value) : null);
    }

    const allSettings = await prisma.setting.findMany();
    const settingsMap = allSettings.reduce((acc: any, s) => {
      acc[s.key] = safeParse(s.value);
      return acc;
    }, {});
    
    return NextResponse.json(settingsMap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing key or value" }, { status: 400 });
    }

    // Store strings as-is, objects/arrays as JSON
    const valueStr = typeof value === "string" ? value : JSON.stringify(value);

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: valueStr },
      create: { key, value: valueStr }
    });

    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
