import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      wallet: true,
      referredBy: { select: { name: true, email: true } },
      referrals: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          referralCode: true,
          _count: { select: { referrals: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      purchases: {
        where: { status: "APPROVED" },
        include: {
          course: { select: { title: true } },
          bundle: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      commissionsReceived: {
        select: { level: true, amount: true },
      },
    },
  });

  if (!user) return notFound();

  // Calculate referral network stats per level
  const levelStats = [1, 2, 3, 4].map((level) => {
    const commissions = user.commissionsReceived.filter((c) => c.level === level);
    return {
      level,
      count: level === 1 ? user.referrals.length : commissions.length,
      earnings: commissions.reduce((s, c) => s + c.amount, 0),
    };
  });

  // Get the referral depth/level of this user
  let referralLevel = 1;
  let current = user;
  // Simple approach: count how many parents up
  let parentId = user.referredById;
  let depth = 0;
  while (parentId && depth < 10) {
    const parent = await prisma.user.findUnique({
      where: { id: parentId },
      select: { referredById: true },
    });
    depth++;
    parentId = parent?.referredById || null;
  }
  referralLevel = depth + 1;

  const walletBalance = user.wallet?.balance || 0;
  const totalEarned = user.wallet?.totalEarnings || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="w-9 h-9 rounded-xl bg-white border border-[var(--border-soft)] flex items-center justify-center hover:bg-[var(--bg-subtle)] transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--text-secondary)]" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
          {user.name || "User"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Profile Card ── */}
        <div className="lg:col-span-1">
          <div className="elegant-card p-6 text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[var(--accent-purple)] text-white font-black text-3xl flex items-center justify-center mx-auto mb-4 ring-4 ring-[var(--brand-100)]">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-[var(--text-primary)]">{user.name}</h2>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{user.email}</p>
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                  user.isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {user.isActive ? "Active" : "Banned"}
              </span>
            </div>

            {/* Details table */}
            <div className="mt-6 space-y-0 text-left">
              {[
                { label: "Role", value: user.role === "USER" ? "Student" : "Admin" },
                { label: "Referral Code", value: user.referralCode || "—", mono: true },
                { label: "Parent", value: user.referredBy?.name || "None" },
                { label: "Level", value: referralLevel.toString() },
                {
                  label: "Wallet",
                  value: `Rs. ${walletBalance.toLocaleString()}`,
                  color: walletBalance > 0 ? "text-emerald-600" : "text-red-500",
                },
                {
                  label: "Total Earned",
                  value: `Rs. ${totalEarned.toLocaleString()}`,
                  color: "text-[var(--text-primary)]",
                },
                {
                  label: "Joined",
                  value: new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
              ].map(({ label, value, mono, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 border-b border-[var(--border-soft)] last:border-b-0"
                >
                  <span className="text-sm text-[var(--text-tertiary)]">{label}</span>
                  <span
                    className={`text-sm font-bold ${color || "text-[var(--text-primary)]"} ${
                      mono ? "font-mono" : ""
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Referral Network + Referrals + Courses ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Network Grid */}
          <div className="elegant-card p-6">
            <h3 className="text-base font-black text-[var(--text-primary)] mb-4">
              Referral Network
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {levelStats.map(({ level, count, earnings }) => (
                <div
                  key={level}
                  className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center border border-[var(--border-soft)]"
                >
                  <p className="text-2xl font-black text-[var(--brand-600)]">{count}</p>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium mt-1">
                    Level {level}
                  </p>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">
                    Rs. {earnings.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Referrals (Level 1) */}
          <div className="elegant-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-soft)]">
              <h3 className="text-base font-black text-[var(--text-primary)]">
                Direct Referrals (Level 1)
              </h3>
            </div>
            {user.referrals.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-tertiary)] text-sm font-medium">
                No direct referrals
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-soft)]">
                {user.referrals.map((ref: any) => (
                  <div
                    key={ref.id}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-600)] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {(ref.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {ref.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                        {ref.email}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      {ref.referralCode}
                    </span>
                    <Link
                      href={`/admin/users/${ref.id}`}
                      className="text-xs font-bold text-[var(--brand-600)] hover:text-[var(--brand-500)]"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrolled Courses */}
          <div className="elegant-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-soft)]">
              <h3 className="text-base font-black text-[var(--text-primary)]">
                Enrolled Courses
              </h3>
            </div>
            {user.purchases.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-tertiary)] text-sm font-medium">
                No enrollments
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-soft)]">
                {user.purchases.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {p.itemType === "COURSE" ? p.course?.title : p.bundle?.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">
                        {p.itemType} · {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className="font-black text-sm text-[var(--text-primary)]">
                      Rs. {p.pricePaid.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
