import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      isMockUser: true,
      referralCode: true,
      createdAt: true,
      _count: {
        select: {
          referrals: true,
          purchases: { where: { status: "APPROVED" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name || "—",
    email: u.email || "",
    role: u.role,
    isActive: u.isActive,
    isMockUser: u.isMockUser,
    referralCode: u.referralCode || "—",
    referrals: u._count.referrals,
    purchases: u._count.purchases,
    createdAt: u.createdAt.toISOString(),
  }));

  return <AdminUsersClient users={serialized} />;
}
