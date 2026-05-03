import { PrismaClient } from '@prisma/client'

async function main() {
  const url = "postgresql://neondb_owner:npg_AWK0qy1QMSjp@ep-dry-rice-am0ulusi-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  console.log('Testing standard TCP connection (without Neon adapter) to:', url)
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  })

  try {
    const result = await prisma.$queryRaw`SELECT 1 as result`
    console.log('✅ Standard TCP Connection successful:', result)
  } catch (error: any) {
    console.error('❌ Standard TCP Connection failed:', error.message || error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
