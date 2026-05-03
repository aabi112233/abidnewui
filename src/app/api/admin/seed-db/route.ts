import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin already exists!', 
        referralCode: existingAdmin.referralCode 
      });
    }

    const hash = await bcrypt.hash('Admin@123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@nexuslearn.com',
        passwordHash: hash,
        role: 'ADMIN',
        referralCode: 'NEXUS001',
        wallet: {
          create: {
            balance: 0,
            totalEarnings: 0,
            pendingEarnings: 0
          }
        }
      }
    });

    return NextResponse.json({ 
      message: '✅ Admin seed complete!',
      email: 'admin@nexuslearn.com',
      referralCode: 'NEXUS001'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
