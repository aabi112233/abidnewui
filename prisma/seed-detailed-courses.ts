import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding detailed dummy courses...')

  // Clean up existing data if needed (optional, but keep it clean for preview)
  // await prisma.course.deleteMany() 

  const courses = [
    {
      title: 'The Ultimate Next.js 16 Mastery',
      slug: 'nextjs-16-mastery',
      description: 'Master the latest features of Next.js 16 including Turbopack, Server Actions, and Advanced Middleware.',
      shortDescription: 'Build high-performance, scalable web applications with Next.js 16.',
      price: 12000,
      originalPrice: 25000,
      thumbnailUrl: '/thumbnails/nextjs.png',
      level: 'ADVANCED',
      duration: '15 Hours',
      instructorName: 'Sarah Jenkins',
      instructorBio: 'Senior Full-Stack Architect with 10+ years of experience in React ecosystems.',
      category: 'Web Development',
      whatYoullLearn: JSON.stringify(['Server Components', 'Turbopack Optimization', 'Complex Data Fetching']),
      sections: {
        create: [
          {
            title: 'Introduction to Next.js 16',
            order: 1,
            lessons: {
              create: [
                { title: 'Welcome to the Course', duration: '5:00', order: 1, isFree: true },
                { title: 'Setting up Turbopack', duration: '12:30', order: 2 }
              ]
            }
          },
          {
            title: 'Advanced Data Patterns',
            order: 2,
            lessons: {
              create: [
                { title: 'Server Actions Deep Dive', duration: '20:15', order: 1 },
                { title: 'Optimistic Updates', duration: '15:45', order: 2 }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'AI-Driven SaaS Development',
      slug: 'ai-saas-dev',
      description: 'Learn how to integrate OpenAI, Anthropic, and Gemini models into your SaaS products.',
      shortDescription: 'Build intelligent applications that leverage the power of Large Language Models.',
      price: 15000,
      originalPrice: 30000,
      thumbnailUrl: '/thumbnails/ai-saas.png',
      level: 'INTERMEDIATE',
      duration: '22 Hours',
      instructorName: 'Alex Thorne',
      instructorBio: 'AI Researcher and SaaS Founder specializing in Agentic Workflows.',
      category: 'Artificial Intelligence',
      whatYoullLearn: JSON.stringify(['Prompt Engineering', 'Vector Databases', 'Function Calling']),
      sections: {
        create: [
          {
            title: 'Foundations of AI SaaS',
            order: 1,
            lessons: {
              create: [
                { title: 'Understanding LLM APIs', duration: '10:00', order: 1, isFree: true },
                { title: 'Designing AI Workflows', duration: '25:00', order: 2 }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'UI/UX: Light Theme Excellence',
      slug: 'ui-ux-light-theme',
      description: 'The definitive guide to designing premium, high-contrast light theme interfaces.',
      shortDescription: 'Master the art of clean, minimalist, and professional UI design.',
      price: 8000,
      originalPrice: 15000,
      thumbnailUrl: '/thumbnails/ui-ux.png',
      level: 'BEGINNER',
      duration: '10 Hours',
      instructorName: 'Elena Ray',
      instructorBio: 'Award-winning UI Designer featured in Smashing Magazine and Awwwards.',
      category: 'Design',
      whatYoullLearn: JSON.stringify(['Color Theory for Light Mode', 'Typography Hierarchy', 'Shadow & Depth']),
      sections: {
        create: [
          {
            title: 'Design Principles',
            order: 1,
            lessons: {
              create: [
                { title: 'The Psychology of Light Themes', duration: '08:45', order: 1, isFree: true },
                { title: 'Mastering Whitespace', duration: '14:20', order: 2 }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Digital Marketing for Creators',
      slug: 'marketing-for-creators',
      description: 'Scale your personal brand and monetize your audience with proven marketing strategies.',
      shortDescription: 'Turn your content into a high-revenue business.',
      price: 5000,
      originalPrice: 12000,
      thumbnailUrl: '/thumbnails/marketing.png',
      level: 'BEGINNER',
      duration: '8 Hours',
      instructorName: 'Marco Polo',
      instructorBio: 'Growth Hacker who helped 50+ creators reach 1M+ followers.',
      category: 'Marketing',
      whatYoullLearn: JSON.stringify(['Content Funnels', 'Email Marketing Mastery', 'Sponsorship Deals']),
      sections: {
        create: [
          {
            title: 'Branding for Success',
            order: 1,
            lessons: {
              create: [
                { title: 'Find Your Niche', duration: '12:00', order: 1, isFree: true },
                { title: 'Viral Hooks Strategy', duration: '18:00', order: 2 }
              ]
            }
          }
        ]
      }
    },
    {
      title: 'Full-Stack Freelancing Blueprint',
      slug: 'freelancing-blueprint',
      description: 'The step-by-step roadmap to building a $10k/month freelancing business as a developer.',
      shortDescription: 'Master the business side of coding and land high-ticket clients.',
      price: 18000,
      originalPrice: 40000,
      thumbnailUrl: '/thumbnails/freelancing.png',
      level: 'ADVANCED',
      duration: '30 Hours',
      instructorName: 'David Han',
      instructorBio: 'Ex-Google engineer turned Freelancer earning mid-six figures.',
      category: 'Business',
      whatYoullLearn: JSON.stringify(['High-Ticket Sales', 'Project Management', 'Client Acquisition']),
      sections: {
        create: [
          {
            title: 'Starting Your Journey',
            order: 1,
            lessons: {
              create: [
                { title: 'Setting Up Your Portfolio', duration: '20:00', order: 1, isFree: true },
                { title: 'Pricing Your Services', duration: '35:00', order: 2 }
              ]
            }
          }
        ]
      }
    }
  ]

  for (const courseData of courses) {
    const existing = await prisma.course.findUnique({ where: { slug: courseData.slug } })
    if (!existing) {
      await prisma.course.create({ data: courseData })
      console.log(`✅ Seeded: ${courseData.title}`)
    } else {
      console.log(`ℹ️ Already exists: ${courseData.title}`)
    }
  }

  console.log('✨ All detailed courses seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
