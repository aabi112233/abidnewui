import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusLearn — Pakistan's #1 Learning & Earning Platform",
  description:
    "Master in-demand digital skills and earn through a revolutionary 4-tier referral network. Premium courses in Digital Marketing, Freelancing, AI, and more.",
  keywords: [
    "LMS Pakistan",
    "online courses",
    "digital marketing course",
    "freelancing course",
    "referral income",
    "earn online Pakistan",
    "NexusLearn",
  ],
  openGraph: {
    title: "NexusLearn — Learn, Earn & Grow",
    description:
      "Pakistan's premier e-learning platform with a powerful 4-tier affiliate network.",
    type: "website",
    locale: "en_PK",
    siteName: "NexusLearn",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusLearn — Learn, Earn & Grow",
    description:
      "Pakistan's premier e-learning platform with a powerful 4-tier affiliate network.",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <NextTopLoader
          color="var(--brand-500)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--brand-500),0 0 5px var(--brand-500)"
          zIndex={1600}
          showAtBottom={false}
        />
        {children}
      </body>
    </html>
  );
}
