import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ACTIVITY = [
  { user: "Ali R.", action: "earned Rs. 2,000", detail: "Level 1 Commission", time: "2m ago", color: "text-green-600", bg: "bg-green-50" },
  { user: "Ayesha K.", action: "joined the network", detail: "via referral NEXUS***", time: "5m ago", color: "text-blue-600", bg: "bg-blue-50" },
  { user: "Hamza S.", action: "withdrew Rs. 15,000", detail: "Meezan Bank transfer", time: "12m ago", color: "text-purple-600", bg: "bg-purple-50" },
  { user: "Sana M.", action: "earned Rs. 800", detail: "Level 2 Commission", time: "18m ago", color: "text-green-600", bg: "bg-green-50" },
  { user: "Tariq B.", action: "unlocked a course", detail: "Mastering AI 2026", time: "1h ago", color: "text-orange-600", bg: "bg-orange-50" },
];

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "MOCK_ACTIVITY" } });
    if (setting && setting.value) {
      return NextResponse.json(JSON.parse(setting.value));
    }
    return NextResponse.json(DEFAULT_ACTIVITY);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
