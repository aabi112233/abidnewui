import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  
  if (existingAdmin) {
    console.log('Admin already exists! Referral Code:', existingAdmin.referralCode)
    return
  }

  const hash = await bcrypt.hash('Admin@123', 10)
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@nexuslearn.com',
      passwordHash: hash,
      role: 'ADMIN',
      referralCode: 'NEXUS001', // The first ever referral code
      wallet: {
        create: {
          balance: 0,
          totalEarnings: 0,
          pendingEarnings: 0
        }
      }
    }
  })

  console.log('✅ Admin seed complete!')
  console.log('Login: admin@nexuslearn.com')
  console.log('Pass: Admin@123')
  console.log('✨ First Referral Code created: NEXUS001')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
