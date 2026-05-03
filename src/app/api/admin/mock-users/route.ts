import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function isAdmin(email: string | null | undefined) {
  return email === "admin@nexuslearn.com";
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const mockUsers = await prisma.user.findMany({
      where: { isMockUser: true },
      select: {
        id: true, name: true, email: true, referralCode: true,
        isMockUser: true, mockEarnings: true, createdAt: true,
        wallet: { select: { balance: true, totalEarnings: true } }
      }
    });

    return NextResponse.json(mockUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // ── SHUFFLE action ──
    if (body.action === "shuffle") {
      const { id } = body;
      if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
      const NAMES = [
        "Ali Hassan", "Sana Malik", "Usman Tariq", "Hira Ahmed", "Bilal Akhtar",
        "Fatima Noor", "Zubair Shah", "Ayesha Siddiqui", "Omar Farooq", "Nadia Rehman",
        "Hamza Yousuf", "Mariam Chaudhry", "Saad Qureshi", "Nimra Baig", "Asad Raza",
      ];
      const newName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const newEarnings = {
        today: rand(500, 5000), last7days: rand(3000, 25000),
        thisMonth: rand(15000, 80000), lifetime: rand(80000, 350000),
        balance: rand(10000, 60000), pendingEarnings: rand(2000, 15000),
        referralCount: rand(10, 80),
      };
      await prisma.user.update({ where: { id }, data: { name: newName, mockEarnings: JSON.stringify(newEarnings) } });
      await prisma.wallet.upsert({
        where: { userId: id },
        update: { balance: newEarnings.balance, totalEarnings: newEarnings.lifetime, pendingEarnings: newEarnings.pendingEarnings },
        create: { userId: id, balance: newEarnings.balance, totalEarnings: newEarnings.lifetime, pendingEarnings: newEarnings.pendingEarnings },
      });
      return NextResponse.json({ success: true, name: newName, earnings: newEarnings });
    }

    // ── CREATE action ──
    const { name, email, referralCode, mockEarnings, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name, email, passwordHash,
        referralCode: referralCode || `MOCK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        isMockUser: true, role: "USER", isActive: true,
        mockEarnings: JSON.stringify(mockEarnings || { today: 0, last7days: 0, thisMonth: 0, lifetime: 0, balance: 0, pendingEarnings: 0, referralCount: 0 }),
      },
    });
    const earnings = mockEarnings || {};
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: parseFloat(earnings.balance) || 0,
        totalEarnings: parseFloat(earnings.lifetime) || 0,
        pendingEarnings: parseFloat(earnings.pendingEarnings) || 0,
      },
    });
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, name, email, mockEarnings, password } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
 
    let passwordHash = undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(passwordHash && { passwordHash }),
        ...(mockEarnings && { mockEarnings: JSON.stringify(mockEarnings) })
      }
    });

    // Update wallet too
    if (mockEarnings) {
      await prisma.wallet.upsert({
        where: { userId: id },
        update: {
          balance: parseFloat(mockEarnings.balance) || 0,
          totalEarnings: parseFloat(mockEarnings.lifetime) || 0,
          pendingEarnings: parseFloat(mockEarnings.pendingEarnings) || 0
        },
        create: {
          userId: id,
          balance: parseFloat(mockEarnings.balance) || 0,
          totalEarnings: parseFloat(mockEarnings.lifetime) || 0,
          pendingEarnings: parseFloat(mockEarnings.pendingEarnings) || 0
        }
      });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // Make sure it's a mock user
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user?.isMockUser) return NextResponse.json({ error: "Not a mock user" }, { status: 400 });

    await prisma.wallet.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
