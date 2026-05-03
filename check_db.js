const { PrismaClient } = require('@prisma/client');
const { Pool } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const s = await prisma.setting.findUnique({where: {key: 'ANNOUNCEMENT_HTML'}});
  console.log("HTML IS:", s?.value);
}
main().finally(() => prisma.$disconnect());
