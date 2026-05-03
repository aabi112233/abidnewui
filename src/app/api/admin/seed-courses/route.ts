import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.email !== "admin@nexuslearn.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ── 1. Add 5 Courses ──
    const coursesData = [
      {
        title: "Graphics Design With AI",
        slug: "graphics-design-with-ai",
        description: "Master the art of graphic design enhanced by Artificial Intelligence. This comprehensive course covers Adobe Photoshop, Illustrator, Canva Pro, and AI-powered tools like Adobe Firefly, MidJourney, and DALL-E. You will learn to create stunning logos, social media graphics, brand identities, and professional marketing materials at 10x speed using AI automation. Perfect for freelancers looking to offer premium design services and earn on platforms like Fiverr and 99designs.",
        shortDescription: "Create stunning designs 10x faster using AI tools — MidJourney, Adobe Firefly, Canva AI & more.",
        price: 4999,
        originalPrice: 9999,
        level: "BEGINNER",
        duration: "14 hours",
        language: "Urdu",
        category: "Design & Creativity",
        tags: JSON.stringify(["Photoshop", "Canva", "MidJourney", "DALL-E", "Adobe Firefly", "Logo Design", "Branding"]),
        whatYoullLearn: JSON.stringify([
          "Master Canva Pro and Adobe tools for professional design",
          "Use AI image generators (MidJourney, DALL-E, Firefly)",
          "Create complete brand identities from scratch",
          "Design social media graphics, thumbnails & banners",
          "Build a design portfolio to attract high-paying clients",
          "Set up and optimize your Fiverr graphic design gig",
          "Automate repetitive design tasks using AI workflows",
        ]),
        requirements: JSON.stringify([
          "Basic computer skills",
          "A laptop or desktop (Windows/Mac)",
          "Free Canva account (we will guide you through setup)",
          "No prior design experience needed",
        ]),
      },
      {
        title: "Facebook Ads Mastery",
        slug: "facebook-ads-mastery",
        description: "Become a certified Facebook & Instagram Ads expert and run profitable ad campaigns for any business. This course covers the entire Meta advertising ecosystem — from setting up your Business Manager and Pixel to advanced audience targeting, retargeting, lookalike audiences, and A/B testing. You will learn to create compelling ad creatives, write persuasive copy, and optimize campaigns for maximum ROI. Ideal for business owners, marketers, and freelancers who want to earn Rs. 50,000+ per month managing ads.",
        shortDescription: "Run profitable Facebook & Instagram ad campaigns. Go from zero to Rs. 50,000+/month as an ads manager.",
        price: 5999,
        originalPrice: 11999,
        level: "INTERMEDIATE",
        duration: "16 hours",
        language: "Urdu",
        category: "Digital Marketing",
        tags: JSON.stringify(["Facebook Ads", "Instagram Ads", "Meta Business Suite", "Pixel", "Retargeting", "ROAS", "Copywriting"]),
        whatYoullLearn: JSON.stringify([
          "Set up Facebook Business Manager and Ad Account correctly",
          "Install and configure the Meta Pixel for tracking",
          "Create high-converting ad campaigns from scratch",
          "Master audience targeting: cold, warm, and retargeting",
          "Design scroll-stopping ad creatives and video ads",
          "Write compelling ad copy that drives action",
          "Analyze and optimize campaigns for maximum ROAS",
          "Manage client accounts professionally and scale results",
        ]),
        requirements: JSON.stringify([
          "A Facebook personal account",
          "Basic understanding of social media",
          "Willingness to run small test campaigns (Rs. 500+)",
          "A product or service to advertise (or use a mock campaign)",
        ]),
      },
      {
        title: "YouTube Automation",
        slug: "youtube-automation",
        description: "Build a thriving YouTube channel without ever appearing on camera using the proven YouTube Automation model. This course teaches you how to identify profitable niches, create faceless video content using AI tools (ElevenLabs, Pictory, InVideo), outsource video production, grow to 1000+ subscribers, and monetize through AdSense, sponsorships, and affiliate marketing. Multiple successful students have built channels earning $500-$3000/month passively using this exact system.",
        shortDescription: "Build a monetized YouTube channel without showing your face — earn $500–$3000/month passively.",
        price: 6999,
        originalPrice: 13999,
        level: "BEGINNER",
        duration: "20 hours",
        language: "Urdu",
        category: "YouTube & Content Creation",
        tags: JSON.stringify(["YouTube", "Faceless Channel", "AI Voiceover", "ElevenLabs", "Pictory", "InVideo", "AdSense", "Passive Income"]),
        whatYoullLearn: JSON.stringify([
          "Choose a profitable niche for YouTube Automation",
          "Create high-quality faceless videos using AI tools",
          "Use ElevenLabs for realistic AI voiceovers",
          "Edit videos with Pictory and InVideo automatically",
          "Optimize titles, thumbnails, and descriptions for SEO",
          "Grow from 0 to 1000 subscribers fast with proven strategies",
          "Apply for and get approved for YouTube Partner Program",
          "Monetize through AdSense, affiliate links, and sponsorships",
        ]),
        requirements: JSON.stringify([
          "A Google account for YouTube",
          "A laptop with internet connection",
          "Rs. 2,000-5,000 budget for AI tools (free options also available)",
          "Consistency and patience to grow the channel",
        ]),
      },
      {
        title: "Crypto Trading Masterclass",
        slug: "crypto-trading-masterclass",
        description: "Learn professional cryptocurrency trading and analysis in Pakistan's most comprehensive crypto course. This course covers blockchain fundamentals, technical analysis (candlestick patterns, RSI, MACD, Fibonacci), fundamental analysis, spot trading, futures trading with risk management, DeFi protocols, and portfolio management. You will learn to trade on major exchanges like Binance, OKX, and Bybit. Emphasis on risk management ensures you protect your capital while maximizing gains. Taught by a professional trader with 5+ years experience.",
        shortDescription: "Professional crypto trading using technical analysis, futures, DeFi & risk management strategies.",
        price: 7999,
        originalPrice: 15999,
        level: "INTERMEDIATE",
        duration: "24 hours",
        language: "Urdu",
        category: "Finance & Trading",
        tags: JSON.stringify(["Crypto", "Bitcoin", "Binance", "Technical Analysis", "Futures Trading", "DeFi", "Risk Management", "Blockchain"]),
        whatYoullLearn: JSON.stringify([
          "Understand blockchain technology and how crypto works",
          "Read and analyze candlestick charts like a pro",
          "Master key indicators: RSI, MACD, Bollinger Bands, Fibonacci",
          "Execute profitable spot and futures trades on Binance",
          "Implement strict risk management to protect your capital",
          "Understand and use DeFi protocols for passive income",
          "Build and manage a diversified crypto portfolio",
          "Identify high-potential altcoins before they pump",
        ]),
        requirements: JSON.stringify([
          "Basic math skills",
          "A Binance or similar exchange account",
          "Starting capital of $50+ to practice (demo trading available)",
          "Patience — trading is a skill that takes time to master",
        ]),
      },
      {
        title: "Learn AI — Complete A to Z",
        slug: "learn-ai-complete",
        description: "The most comprehensive Artificial Intelligence course in Urdu — covering everything from basic concepts to advanced applications. Learn ChatGPT prompting like an expert, explore 50+ AI tools for productivity, writing, image generation, video creation, and coding. Discover how to use AI to build micro-SaaS products, automate your business workflows, and provide high-value AI consulting services. This course future-proofs your career and opens up multiple income streams in the AI economy.",
        shortDescription: "Master 50+ AI tools, ChatGPT prompting, automation & build income streams in the AI economy.",
        price: 5499,
        originalPrice: 10999,
        level: "BEGINNER",
        duration: "18 hours",
        language: "Urdu",
        category: "Artificial Intelligence",
        tags: JSON.stringify(["AI", "ChatGPT", "MidJourney", "Automation", "Prompt Engineering", "AI Tools", "Micro-SaaS", "Productivity"]),
        whatYoullLearn: JSON.stringify([
          "Master ChatGPT prompt engineering for any use case",
          "Explore 50+ top AI tools: writing, image, video & code",
          "Use AI to automate your freelance workflow completely",
          "Create and sell AI-generated digital products",
          "Build no-code AI-powered applications and micro-SaaS",
          "Use AI for research, content creation, and marketing",
          "Provide AI consulting and automation services to businesses",
          "Stay ahead of AI trends and continuously upgrade skills",
        ]),
        requirements: JSON.stringify([
          "Basic computer and internet usage",
          "Curiosity and enthusiasm for technology",
          "A ChatGPT account (free tier works)",
          "No programming experience needed",
        ]),
      },
    ];

    let added = 0;
    for (const course of coursesData) {
      const existing = await prisma.course.findUnique({ where: { slug: course.slug } });
      if (!existing) {
        await prisma.course.create({ data: { ...course, isActive: true } });
        added++;
      }
    }

    // ── 2. Create Mock User ──
    const mockEmail = "engrammeryt@gmail.com";
    let mockUser = await prisma.user.findUnique({ where: { email: mockEmail } });

    if (!mockUser) {
      const pw = await bcrypt.hash("College1122", 10);
      const mockEarnings = {
        today: 1250,
        last7days: 8750,
        thisMonth: 31200,
        lifetime: 187500,
        balance: 42300,
        pendingEarnings: 5200,
        referralCount: 47,
      };

      mockUser = await prisma.user.create({
        data: {
          name: "Engr. Ammar Yousuf",
          email: mockEmail,
          passwordHash: pw,
          referralCode: "AMMAR2026",
          isMockUser: true,
          role: "USER",
          isActive: true,
          mockEarnings: JSON.stringify(mockEarnings),
          image: null,
        },
      });

      await prisma.wallet.create({
        data: {
          userId: mockUser.id,
          balance: mockEarnings.balance,
          totalEarnings: mockEarnings.lifetime,
          pendingEarnings: mockEarnings.pendingEarnings,
        },
      });
    }

    return NextResponse.json({
      success: true,
      coursesAdded: added,
      mockUserStatus: mockUser ? "exists" : "created",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
