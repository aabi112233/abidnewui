import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    const sponsor = await prisma.user.findUnique({
      where: { referralCode }
    });

    if (!sponsor) {
      return NextResponse.json({ error: "Invalid Referral Code. Please ask your sponsor for their correct code." }, { status: 400 });
    }

    return NextResponse.json({ valid: true, sponsorName: sponsor.name });
  } catch (error) {
    return NextResponse.json({ error: "Server error checking referral code." }, { status: 500 });
  }
}
