import { PrismaClient } from '@prisma/client'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

async function testWebSocket(url: string) {
  console.log('\n--- Testing WebSocket with URL:', url)
  try {
    const pool = new Pool({ connectionString: url })
    const adapter = new PrismaNeon(pool)
    const prisma = new PrismaClient({ adapter })
    const result = await prisma.$queryRaw`SELECT 1 as result`
    console.log('✅ Success!', result)
    await prisma.$disconnect()
  } catch (err: any) {
    console.log('❌ Failed:', err.message || err)
  }
}

async function main() {
  const url = "postgresql://neondb_owner:npg_AWK0qy1QMSjp@ep-dry-rice-am0ulusi-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  await testWebSocket(url)
  
  const stdUrl = "postgresql://neondb_owner:npg_AWK0qy1QMSjp@ep-dry-rice-am0ulusi.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
  await testWebSocket(stdUrl)
}

main()
