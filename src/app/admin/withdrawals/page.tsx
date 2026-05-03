import { prisma } from "@/lib/prisma";
import AdminWithdrawalsClient from "./AdminWithdrawalsClient";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.withdrawalRequest.findMany({
    include: {
      user: { select: { name: true, email: true, isMockUser: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = withdrawals.map((w: any) => {
    let bankDetails: any = {};
    try { bankDetails = JSON.parse(w.bankDetails); } catch {}
    return {
      id: w.id,
      userName: w.user.name || "—",
      userEmail: w.user.email || "",
      isMockUser: w.user.isMockUser,
      amount: w.amount,
      paymentMethod: w.paymentMethod,
      accountTitle: bankDetails.accountTitle || bankDetails.accountName || "—",
      accountNumber: bankDetails.accountNumber || "—",
      status: w.status,
      createdAt: w.createdAt.toISOString(),
    };
  });

  return <AdminWithdrawalsClient withdrawals={serialized} />;
}
