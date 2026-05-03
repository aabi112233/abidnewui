import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

async function wake() {
  console.log("Waking NeonDB via Prisma Adapter (HTTP/WS)...");
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL is not defined");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const userCount = await prisma.user.count();
    console.log("✅ DB is awake and working via Prisma! User count:", userCount);
  } catch (e) {
    console.error("❌ Prisma error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

wake();
