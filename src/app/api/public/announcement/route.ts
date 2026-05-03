import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function safeParse(val: string) {
  try { return JSON.parse(val); } catch { return val; }
}

export async function GET() {
  try {
    const [htmlRow, activeRow, pagesRow] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "ANNOUNCEMENT_HTML" } }),
      prisma.setting.findUnique({ where: { key: "ANNOUNCEMENT_ACTIVE" } }),
      prisma.setting.findUnique({ where: { key: "ANNOUNCEMENT_PAGES" } }),
    ]);

    return NextResponse.json({
      html:   htmlRow?.value   || "",
      active: activeRow?.value === "true",
      // pages is stored as JSON array of path strings e.g. ["/", "/dashboard"]
      // empty array / null = show on all pages
      pages:  pagesRow ? safeParse(pagesRow.value) : [],
    });
  } catch (error: any) {
    return NextResponse.json({ html: "", active: false, pages: [] });
  }
}
