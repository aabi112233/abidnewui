import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'

async function testConnection(url: string) {
  console.log('Testing connection to:', url)
  try {
    const sql = neon(url)
    const adapter = new PrismaNeonHTTP(sql)
    const prisma = new PrismaClient({ adapter })

    const result = await prisma.$queryRaw`SELECT 1 as result`
    console.log('✅ Connection successful:', result)
    await prisma.$disconnect()
    return true
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message || error)
    return false
  }
}

async function main() {
  const poolerUrl = "postgresql://neondb_owner:npg_AWK0qy1QMSjp@ep-dry-rice-am0ulusi-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  const standardUrl = "postgresql://neondb_owner:npg_AWK0qy1QMSjp@ep-dry-rice-am0ulusi.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"

  console.log('--- Testing Pooler URL ---')
  await testConnection(poolerUrl)

  console.log('\n--- Testing Standard URL ---')
  await testConnection(standardUrl)
}

main()
