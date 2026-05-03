import { PrismaClient } from '@prisma/client'
import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'
// No dotenv for test


async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  console.log('Testing connection to:', connectionString)

  try {
    const sql = neon(connectionString)
    const adapter = new PrismaNeonHTTP(sql)
    const prisma = new PrismaClient({ adapter })

    const result = await prisma.$queryRaw`SELECT 1 as result`
    console.log('Connection successful:', result)
    await prisma.$disconnect()
  } catch (error) {
    console.error('Connection failed:', error)
    process.exit(1)
  }
}

main()
