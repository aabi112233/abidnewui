"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface Payment {
  id: string;
  userName: string;
  userEmail: string;
  courseName: string;
  itemType: string;
  pricePaid: number;
  paymentMethod: string;
  transactionId: string;
  proofImageUrl?: string;
  status: string;
  createdAt: string;
}

const FILTERS = ["All", "Pending", "Confirmed", "Rejected"] as const;
type Filter = (typeof FILTERS)[number];

const statusMap: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  APPROVED: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-200" },
};

export default function AdminPaymentsClient({ payments }: { payments: Payment[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = payments;
    if (filter !== "All") {
      const statusKey =
        filter === "Confirmed" ? "APPROVED" : filter === "Rejected" ? "REJECTED" : "PENDING";
      result = result.filter((p) => p.status === statusKey);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.userName.toLowerCase().includes(q) ||
          p.userEmail.toLowerCase().includes(q) ||
          p.transactionId.toLowerCase().includes(q)
      );
    }
    return result;
  }, [payments, filter, search]);

  const counts = useMemo(() => ({
    all: payments.length,
    pending: payments.filter(p => p.status === "PENDING").length,
    confirmed: payments.filter(p => p.status === "APPROVED").length,
    rejected: payments.filter(p => p.status === "REJECTED").length,
  }), [payments]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Payments</h1>
          <p className="text-sm text-[var(--text-tertiary)] font-medium mt-1">
            {counts.pending} pending · {counts.confirmed} confirmed · {counts.rejected} rejected
          </p>
        </div>
        <input
          type="text"
          placeholder="Search name, email, or TID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="elegant-input max-w-xs text-sm"
        />
      </div>

      {/* Main Card */}
      <div className="elegant-card overflow-hidden">
        {/* Filters */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--border-soft)] flex items-center gap-1 bg-[var(--bg-subtle)] overflow-x-auto">
          {FILTERS.map((f) => {
            const count = f === "All" ? counts.all : f === "Pending" ? counts.pending : f === "Confirmed" ? counts.confirmed : counts.rejected;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filter === f
                    ? "bg-[var(--brand-600)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white"
                }`}
              >
                {f}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  filter === f ? "bg-white/20" : "bg-slate-200/60"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-tertiary)] font-medium text-sm">
            No {filter.toLowerCase()} payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-[var(--border-soft)] text-[var(--text-secondary)] text-[10px] uppercase tracking-wider">
                  <th className="pb-3 pt-4 px-6 font-bold">User</th>
                  <th className="pb-3 pt-4 font-bold">Package</th>
                  <th className="pb-3 pt-4 font-bold">Amount</th>
                  <th className="pb-3 pt-4 font-bold">TID</th>
                  <th className="pb-3 pt-4 font-bold">Method</th>
                  <th className="pb-3 pt-4 font-bold">Status</th>
                  <th className="pb-3 pt-4 font-bold">Date</th>
                  <th className="pb-3 pt-4 font-bold text-right pr-6"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const st = statusMap[p.status] || statusMap.PENDING;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/admin/payments/${p.id}`)}
                      className="border-b border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-600)] text-white font-black text-xs flex items-center justify-center shrink-0">
                            {p.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[var(--text-primary)]">
                              {p.userName}
                            </div>
                            <div className="text-[10px] text-[var(--text-tertiary)]">
                              {p.userEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-sm font-semibold text-[var(--text-primary)] max-w-[160px] truncate">
                        {p.courseName}
                      </td>
                      <td className="py-3.5 font-black text-sm">
                        Rs. {p.pricePaid.toLocaleString()}
                      </td>
                      <td className="py-3.5">
                        <code className="text-xs font-bold text-[var(--brand-600)] bg-[var(--brand-50)] px-2 py-0.5 rounded-md border border-[var(--brand-200)]">
                          {p.transactionId?.startsWith("REJECTED_") ? "—" : p.transactionId || "—"}
                        </code>
                      </td>
                      <td className="py-3.5 text-xs font-bold text-[var(--text-secondary)]">
                        {p.paymentMethod}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${st.cls}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-[var(--text-tertiary)] font-medium">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 pr-6 text-right">
                        <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--brand-600)] transition-colors inline-block" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
