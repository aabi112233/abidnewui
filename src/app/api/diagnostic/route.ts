import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Starting diagnostic check...");
    
    // 1. Check if DATABASE_URL is set
    const hasDbUrl = !!process.env.DATABASE_URL;
    const dbUrlStart = process.env.DATABASE_URL?.substring(0, 15) + "...";
    
    // 2. Try a simple query
    console.log("Attempting simple query: prisma.user.count()");
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "success",
      message: "Connected to database successfully!",
      data: {
        userCount,
        hasDbUrl,
        dbUrlStart,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error: any) {
    console.error("Diagnostic failed:", error);
    
    return NextResponse.json({
      status: "error",
      message: error.message || "Unknown error",
      detail: error.stack,
      code: error.code,
      meta: error.meta,
      dbUrlAvailable: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 });
  }
}
