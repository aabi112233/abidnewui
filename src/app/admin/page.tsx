import Link from "next/link";
import {
  Users, DollarSign, Clock, TrendingUp, BookOpen,
  ArrowDownLeft, ChevronRight, CreditCard, Eye
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    revenueAgg,
    pendingPayments,
    pendingWithdrawals,
    commissionsPaid,
    newUsersToday,
    recentPayments,
    recentUsers,
    // Revenue per day for last 7 days
    last7DaysPurchases,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.course.count(),
    prisma.purchase.count({ where: { status: "APPROVED" } }),
    prisma.purchase.aggregate({ where: { status: "APPROVED" }, _sum: { pricePaid: true } }),
    prisma.purchase.count({ where: { status: "PENDING" } }),
    prisma.withdrawalRequest.count({ where: { status: "PENDING" } }),
    prisma.commission.aggregate({ _sum: { amount: true } }),
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) },
      },
    }),
    // Recent payments (last 5)
    prisma.purchase.findMany({
      where: { status: "APPROVED" },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
        bundle: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Recent users (last 5)
    prisma.user.findMany({
      where: { role: "USER" },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Purchases per day for last 7 days (for revenue chart)
    prisma.purchase.findMany({
      where: { status: "APPROVED", createdAt: { gte: weekAgo } },
      select: { pricePaid: true, createdAt: true },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.pricePaid || 0;
  const totalCommissions = commissionsPaid._sum.amount || 0;

  // Build revenue chart data for last 7 days
  const chartData: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const dayRevenue = last7DaysPurchases
      .filter((p: any) => new Date(p.createdAt) >= dayStart && new Date(p.createdAt) < dayEnd)
      .reduce((sum: number, p: any) => sum + p.pricePaid, 0);
    chartData.push({ label: dayStr, value: dayRevenue });
  }
  const maxRevenue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Dashboard</h1>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: Users,
            color: "text-[var(--brand-600)]",
            bg: "bg-[var(--brand-50)]",
            iconBg: "bg-blue-100",
            sub: `+${newUsersToday} today`,
          },
          {
            label: "Total Revenue",
            value: `Rs. ${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            iconBg: "bg-amber-100",
            sub: "Confirmed payments",
          },
          {
            label: "Pending Payments",
            value: pendingPayments.toLocaleString(),
            icon: Clock,
            color: "text-red-500",
            bg: "bg-red-50",
            iconBg: "bg-red-100",
            sub: pendingPayments > 0 ? (
              <Link href="/admin/payments" className="text-[var(--brand-600)] hover:underline">
                View all →
              </Link>
            ) : "All clear",
          },
          {
            label: "Commissions Paid",
            value: `Rs. ${totalCommissions.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-purple-600",
            bg: "bg-purple-50",
            iconBg: "bg-purple-100",
            sub: `${totalEnrollments} enrollments`,
          },
        ].map(({ label, value, icon: Icon, color, bg, iconBg, sub }) => (
          <div key={label} className="elegant-card p-5 stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-[var(--text-tertiary)]">{label}</p>
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[11px] text-[var(--text-tertiary)] font-medium mt-1">
              {typeof sub === "string" ? sub : sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Revenue Chart + Quick Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue Chart (Last 7 Days) */}
        <div className="lg:col-span-3 elegant-card p-6">
          <h2 className="text-base font-black text-[var(--text-primary)] mb-6">
            Revenue (Last 7 Days)
          </h2>
          <div className="flex items-end gap-3 h-40">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--text-tertiary)]">
                  {d.value > 0 ? d.value.toLocaleString() : "0"}
                </span>
                <div className="w-full relative" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg bar-animate"
                    style={{
                      width: "70%",
                      "--bar-h": `${Math.max((d.value / maxRevenue) * 100, 4)}%`,
                      background:
                        d.value > 0
                          ? "linear-gradient(180deg, var(--brand-400), var(--brand-600))"
                          : "var(--border-soft)",
                      animationDelay: `${i * 100}ms`,
                    } as any}
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-tertiary)]">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 elegant-card p-6 space-y-0">
          <h2 className="text-base font-black text-[var(--text-primary)] mb-4">
            Quick Stats
          </h2>
          {[
            { label: "Total Courses", value: totalCourses, color: "text-[var(--text-primary)]", bg: "" },
            { label: "Enrollments", value: totalEnrollments, color: "text-[var(--text-primary)]", bg: "" },
            {
              label: "Pending Withdrawals",
              value: pendingWithdrawals,
              color: pendingWithdrawals > 0 ? "text-amber-600" : "text-[var(--text-primary)]",
              bg: pendingWithdrawals > 0 ? "bg-amber-50" : "",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`flex items-center justify-between py-4 px-4 rounded-xl ${bg} border-b border-[var(--border-soft)] last:border-b-0`}
            >
              <span className="text-sm font-semibold text-[var(--text-secondary)]">
                {label}
              </span>
              <span className={`text-lg font-black ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Payments + Recent Users ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Payments */}
        <div className="elegant-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-soft)] flex items-center justify-between">
            <h2 className="text-base font-black text-[var(--text-primary)]">
              Recent Payments
            </h2>
            <Link
              href="/admin/payments"
              className="text-xs font-bold text-[var(--brand-600)] hover:text-[var(--brand-500)] flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-tertiary)] text-sm font-medium">
              No payments yet.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-soft)]">
              {recentPayments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--bg-subtle)] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-600)] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {(p.user.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {p.user.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                        {p.itemType === "COURSE" ? p.course?.title : p.bundle?.title}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-[var(--text-primary)] whitespace-nowrap ml-3">
                    Rs. {p.pricePaid.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="elegant-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border-soft)] flex items-center justify-between">
            <h2 className="text-base font-black text-[var(--text-primary)]">
              Recent Users
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-[var(--brand-600)] hover:text-[var(--brand-500)] flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-tertiary)] text-sm font-medium">
              No users yet.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-soft)]">
              {recentUsers.map((u: any) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--bg-subtle)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-purple)] text-white font-black text-xs flex items-center justify-center shrink-0">
                    {(u.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                      {u.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-[var(--text-tertiary)] whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
