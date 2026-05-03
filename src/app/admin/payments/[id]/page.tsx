import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentDetailClient from "./PaymentDetailClient";

export const dynamic = "force-dynamic";

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const purchase = await prisma.purchase.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true, name: true, email: true, referralCode: true,
          referredBy: { select: { name: true, email: true, referralCode: true } },
          createdAt: true,
        }
      },
      course: { select: { id: true, title: true, price: true } },
      bundle: {
        select: {
          id: true, title: true, price: true,
          courses: { include: { course: { select: { title: true } } } }
        }
      },
    },
  });

  if (!purchase) notFound();

  const data = {
    id: purchase.id,
    status: purchase.status,
    itemType: purchase.itemType,
    pricePaid: purchase.pricePaid,
    paymentMethod: purchase.paymentMethod,
    transactionId: purchase.transactionId,
    proofImageUrl: purchase.proofImageUrl,
    createdAt: purchase.createdAt.toISOString(),
    user: {
      id: purchase.user.id,
      name: purchase.user.name || "—",
      email: purchase.user.email || "—",
      referralCode: purchase.user.referralCode || "—",
      joinedAt: purchase.user.createdAt.toISOString(),
      sponsor: purchase.user.referredBy
        ? { name: purchase.user.referredBy.name || "—", email: purchase.user.referredBy.email || "", code: purchase.user.referredBy.referralCode || "" }
        : null,
    },
    packageName: purchase.itemType === "BUNDLE"
      ? purchase.bundle?.title || "—"
      : purchase.course?.title || "—",
    packagePrice: purchase.itemType === "BUNDLE"
      ? purchase.bundle?.price || 0
      : purchase.course?.price || 0,
    includedCourses: purchase.itemType === "BUNDLE"
      ? (purchase.bundle?.courses || []).map((bc: any) => bc.course.title)
      : purchase.course ? [purchase.course.title] : [],
  };

  return <PaymentDetailClient payment={data} />;
}
