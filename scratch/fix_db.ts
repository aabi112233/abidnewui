import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'

async function tryConnect(hostname: string) {
  const url = `postgresql://neondb_owner:npg_AWK0qy1QMSjp@${hostname}/neondb`
  console.log(`\n--- Testing ${hostname} ---`)
  try {
    const sql = neon(url)
    const adapter = new PrismaNeonHTTP(sql)
    const prisma = new PrismaClient({ adapter })
    const result = await prisma.$queryRaw`SELECT 1 as result`
    console.log('✅ Success!', result)
    await prisma.$disconnect()
  } catch (err: any) {
    console.log('❌ Failed:', err.message || err)
  }
}

async function main() {
  await tryConnect('ep-dry-rice-am0ulusi.c-5.us-east-1.aws.neon.tech')
  await tryConnect('ep-dry-rice-am0ulusi.us-east-1.aws.neon.tech') // without c-5?
  await tryConnect('ep-dry-rice-am0ulusi-pooler.c-5.us-east-1.aws.neon.tech')
}

main()
