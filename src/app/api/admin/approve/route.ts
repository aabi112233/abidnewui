import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    // Ensure only Admin can approve
    if (!session?.user || session.user.email !== "admin@nexuslearn.com") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { purchaseId } = await req.json();
    if (!purchaseId) {
      return NextResponse.json({ error: "Purchase ID required" }, { status: 400 });
    }

    // 1. Fetch Purchase along with the 4-Level Sponsor Tree
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        user: {
          include: {
            referredBy: { // Level 1
              include: {
                referredBy: { // Level 2
                  include: {
                    referredBy: { // Level 3
                      include: {
                        referredBy: true // Level 4
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }
    
    if (purchase.status === "APPROVED") {
      return NextResponse.json({ error: "Already approved" }, { status: 400 });
    }

    // 2. Linear Updates (avoiding tx scope errors)
    // 2a. Update Purchase Status
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { status: "APPROVED" }
    });

    // Read percentages from settings or use defaults (50% total: 25, 15, 5, 5)
    let percentages = [0.25, 0.15, 0.05, 0.05];
    try {
      const setting = await prisma.setting.findUnique({ where: { key: "COMMISSION_RATES" } });
      if (setting && setting.value) {
        // expect format [25, 15, 5, 5] as percentages
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          percentages = parsed.map(val => Number(val) / 100);
        }
      }
    } catch(e) {
      console.warn("Failed to parse commission rates override", e);
    }

    let currentSponsor: any = purchase.user.referredBy;
    let level = 1;

    // 2b. Traverse up the tree and distribute funds
    while (currentSponsor && level <= 4) {
      const commissionAmount = purchase.pricePaid * percentages[level - 1];

      // Create Commission Log
      await prisma.commission.create({
        data: {
          amount: commissionAmount,
          level: level,
          toUserId: currentSponsor.id,
          purchaseId: purchase.id,
          fromUserId: purchase.userId
        }
      });

      // Update Sponsor's Wallet Balance
      await prisma.wallet.update({
        where: { userId: currentSponsor.id },
        data: {
          balance: { increment: commissionAmount },
          totalEarnings: { increment: commissionAmount }
        }
      });

      // Move to next sponsor above
      currentSponsor = currentSponsor.referredBy;
      level++;
    }

    return NextResponse.json({ success: true, message: "Purchase approved & commissions distributed!" });

  } catch (error: any) {
    console.error("Commission Approval Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error", stack: error.stack }, { status: 500 });
  }
}
