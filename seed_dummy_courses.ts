import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding dummy courses...");

  // 1. Meta Ads Course
  const metaAds = await prisma.course.create({
    data: {
      title: "Meta Ads Mastery 2026",
      slug: "meta-ads-mastery",
      description: "Learn how to create profitable Facebook and Instagram ad campaigns from scratch. This complete course takes you from beginner to advanced media buyer.",
      shortDescription: "Master Facebook & Instagram Ads to grow any business.",
      price: 5000,
      originalPrice: 15000,
      thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
      level: "INTERMEDIATE",
      duration: "5h 30m",
      language: "Urdu",
      category: "Marketing",
      tags: JSON.stringify(["Meta Ads", "Facebook Ads", "Digital Marketing", "Social Media"]),
      whatYoullLearn: JSON.stringify([
        "Set up Business Manager correctly",
        "Create high-converting ad campaigns",
        "Understand tracking and the Meta Pixel",
        "Scale winning ads profitably"
      ]),
      requirements: JSON.stringify([
        "A laptop or computer with internet",
        "A Facebook profile",
        "Basic understanding of marketing"
      ]),
      isActive: true,
      instructorName: "Muhammad Ali",
      instructorBio: "Senior Media Buyer spending over $1M/year on Meta Ads.",
      sections: {
        create: [
          {
            title: "Module 1: Foundations",
            order: 0,
            lessons: {
              create: [
                {
                  title: "What are Meta Ads?",
                  duration: "10m",
                  type: "VIDEO",
                  isFree: true,
                  order: 0,
                  description: "Introduction to the Meta ecosystem and why it's powerful."
                },
                {
                  title: "Setting up Business Manager",
                  duration: "15m",
                  type: "VIDEO",
                  isFree: false,
                  order: 1,
                  description: "Step by step guide to creating your ad account."
                }
              ]
            }
          },
          {
            title: "Module 2: Campaign Creation",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Campaign Structure Explained",
                  duration: "20m",
                  type: "VIDEO",
                  isFree: false,
                  order: 0,
                  description: "Understanding Campaigns, Ad Sets, and Ads."
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Created Course:", metaAds.title);

  // 2. Learn AI Course
  const learnAi = await prisma.course.create({
    data: {
      title: "Learn Generative AI & Prompt Engineering",
      slug: "learn-generative-ai",
      description: "Discover how to leverage AI tools like ChatGPT, Midjourney, and Claude to 10x your productivity and creativity. The ultimate guide for the modern professional.",
      shortDescription: "10x your productivity with Generative AI tools.",
      price: 3500,
      originalPrice: 10000,
      thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      level: "BEGINNER",
      duration: "3h 45m",
      language: "Urdu",
      category: "Technology",
      tags: JSON.stringify(["Artificial Intelligence", "ChatGPT", "Prompt Engineering", "Productivity"]),
      whatYoullLearn: JSON.stringify([
        "Master ChatGPT prompt engineering",
        "Generate stunning images with Midjourney",
        "Automate tasks using AI workflows",
        "Stay ahead of the technology curve"
      ]),
      requirements: JSON.stringify([
        "No coding experience required",
        "Curiosity to learn new tools"
      ]),
      isActive: true,
      instructorName: "Zainab Khan",
      instructorBio: "AI Researcher and Prompt Engineer.",
      sections: {
        create: [
          {
            title: "Section 1: Introduction to AI",
            order: 0,
            lessons: {
              create: [
                {
                  title: "How Large Language Models Work",
                  duration: "12m",
                  type: "VIDEO",
                  isFree: true,
                  order: 0,
                  description: "A simple explanation of the tech behind ChatGPT."
                },
                {
                  title: "Creating your first Prompts",
                  duration: "18m",
                  type: "VIDEO",
                  isFree: false,
                  order: 1,
                  description: "The anatomy of a perfect prompt."
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("Created Course:", learnAi.title);

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
