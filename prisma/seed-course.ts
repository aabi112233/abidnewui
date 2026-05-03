import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingCourse = await prisma.course.findFirst()
  
  if (!existingCourse) {
    await prisma.course.create({
      data: {
        title: 'Mastering AI & Web Architecture 2026',
        description: 'Learn how to build next-generation scalable learning platforms, integrate AI, and build beautiful Light Theme UI systems using Tailwind and Next.js App Router.',
        price: 5000,
        contentLinks: JSON.stringify([
          { title: 'Chapter 1: Getting Started', url: 'https://example.com/video1' },
          { title: 'Chapter 2: Backend Architecture', url: 'https://example.com/video2' }
        ])
      }
    })
    console.log('✅ Dummy Course Seeded into Storefront!')
  } else {
    console.log('Course already exists.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
