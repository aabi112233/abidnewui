import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Generate a random 8-character code for the new user
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { 
      name, email, password, referralCode, 
      courseId, bundleId, paymentMethod, transactionId, proofImageUrl, pricePaid 
    } = await req.json();

    const itemId = bundleId || courseId;
    const itemType = bundleId ? "BUNDLE" : "COURSE";

    if (!email || !password || !referralCode || !itemId || !paymentMethod || !transactionId || !proofImageUrl) {
      return NextResponse.json({ error: "Missing required registration or payment fields" }, { status: 400 });
    }

    // 1. Verify that the referral code exists and get the sponsor
    const sponsor = await prisma.user.findUnique({
      where: { referralCode }
    });

    if (!sponsor) {
      return NextResponse.json({ error: "Invalid Refferal Code. You must have a valid sponsor to join." }, { status: 400 });
    }

    // 2. Check if the user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // 2.5 Check if TID already exists in an APPROVED or PENDING purchase
    // Only block if transaction ID is used by an APPROVED purchase (permanently saved)
    // or by another PENDING purchase (to prevent simultaneous duplicate submissions)
    const existingTx = await prisma.purchase.findFirst({
      where: {
        transactionId: transactionId.trim(),
        status: { in: ["APPROVED", "PENDING"] }
      }
    });

    if (existingTx) {
      return NextResponse.json({ 
        error: "This Transaction ID has already been used. Please enter a different Transaction ID." 
      }, { status: 400 });
    }

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Generate unique referral code for the new user
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode();
      const check = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
      if (!check) isUnique = true;
    }

    // 5. Create new User, new Wallet, AND the pending verification Purchase simultaneously
    const purchaseData: any = {
      itemType,
      status: "PENDING",
      paymentMethod,
      transactionId: transactionId.trim(),
      proofImageUrl,
      pricePaid: parseFloat(pricePaid || "0"),
    };

    if (itemType === "BUNDLE") {
      purchaseData.bundleId = itemId;
    } else {
      purchaseData.courseId = itemId;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        referralCode: newReferralCode,
        referredById: sponsor.id,
        wallet: {
          create: { balance: 0, totalEarnings: 0, pendingEarnings: 0 }
        },
        purchases: {
          create: purchaseData
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully",
      user: { id: user.id, email: user.email }
    });

  } catch (error: any) {
    console.error("Registration Error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
