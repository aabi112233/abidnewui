import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const [bundles, paymentAccounts] = await Promise.all([
    prisma.bundle.findMany({
      where: { isActive: true },
      include: {
        courses: {
          include: { course: { select: { id: true, title: true } } }
        }
      },
      orderBy: { price: "asc" },
    }),
    prisma.paymentAccount.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    })
  ]);

  // Map bundles to the format RegisterClient expects
  const packages = bundles.map(b => ({
    id: b.id,
    title: b.title,
    price: b.price,
    description: b.description,
    courseCount: b.courses.length,
    courseNames: b.courses.map((bc: any) => bc.course.title),
  }));

  return (
    <main className="min-h-screen flex flex-col p-4 relative z-10">
      <div className="w-full max-w-5xl mx-auto pt-6">
        <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 font-medium transition-colors w-max bg-white/80 p-2 pr-4 rounded-full shadow-sm border border-[var(--border-strong)]">
          <ArrowLeft className="w-4 h-4 ml-2" />Back to home
        </Link>
      </div>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center font-bold text-[var(--brand-500)]">Loading...</div>}>
        <RegisterClient packages={packages} paymentAccounts={paymentAccounts} />
      </Suspense>
    </main>
  );
}
