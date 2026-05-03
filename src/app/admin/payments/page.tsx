import { prisma } from "@/lib/prisma";
import AdminPaymentsClient from "./AdminPaymentsClient";

export default async function AdminPaymentsPage() {
  const purchases = await prisma.purchase.findMany({
    select: {
      id: true,
      itemType: true,
      pricePaid: true,
      paymentMethod: true,
      transactionId: true,
      proofImageUrl: true,
      status: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
      bundle: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  const serialized = purchases.map((p: any) => ({
    id: p.id,
    userName: p.user.name || "—",
    userEmail: p.user.email || "",
    courseName: p.itemType === "COURSE" ? p.course?.title || "—" : p.bundle?.title || "—",
    itemType: p.itemType,
    pricePaid: p.pricePaid,
    paymentMethod: p.paymentMethod,
    transactionId: p.transactionId,
    proofImageUrl: p.proofImageUrl,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  }));

  return <AdminPaymentsClient payments={serialized} />;
}
