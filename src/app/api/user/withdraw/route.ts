import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, paymentMethod, accountNumber, accountTitle, saveAccount } = await req.json();

    if (!amount || !paymentMethod || !accountNumber || !accountTitle) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { wallet: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get minimum withdrawal threshold from settings
    let minWithdrawal = 1000;
    try {
      const setting = await prisma.setting.findUnique({ where: { key: "MIN_WITHDRAWAL" } });
      if (setting) minWithdrawal = parseFloat(setting.value);
    } catch (e) {}

    if (amount < minWithdrawal) {
      return NextResponse.json({ error: `Minimum withdrawal is Rs. ${minWithdrawal.toLocaleString()}` }, { status: 400 });
    }

    const balance = user.wallet?.balance || 0;
    if (amount > balance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Create withdrawal request
    const bankDetails = JSON.stringify({ accountTitle, accountNumber, paymentMethod });
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
        paymentMethod,
        bankDetails,
        status: "PENDING"
      }
    });

    // Deduct from wallet balance (freeze it as pending)
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: { decrement: parseFloat(amount) },
        pendingEarnings: { increment: parseFloat(amount) }
      }
    });
 
    // If user wants to save this account
    if (saveAccount) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          savedPaymentMethod: JSON.stringify({ paymentMethod, accountNumber, accountTitle })
        }
      });
    }

    return NextResponse.json({ success: true, withdrawalId: withdrawal.id });
  } catch (error: any) {
    console.error("Withdrawal Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
