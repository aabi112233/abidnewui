"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Withdrawal {
  id: string;
  userName: string;
  userEmail: string;
  isMockUser: boolean;
  amount: number;
  paymentMethod: string;
  accountTitle: string;
  accountNumber: string;
  status: string;
  createdAt: string;
}

const FILTERS = ["All", "Pending", "Approved"] as const;
type Filter = (typeof FILTERS)[number];

const statusMap: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  APPROVED: { label: "Approved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  REJECTED: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-200" },
};

export default function AdminWithdrawalsClient({ withdrawals }: { withdrawals: Withdrawal[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return withdrawals;
    return withdrawals.filter((w) => w.status === filter.toUpperCase());
  }, [withdrawals, filter]);

  const handle = async (id: string, action: "APPROVE" | "REJECT") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.error || "Failed"));
      } else {
        router.refresh();
      }
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
      <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Withdrawals</h1>

      <div className="elegant-card overflow-hidden">
        {/* Header with filters */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-black text-[var(--text-primary)]">Withdrawal Requests</h2>
          <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-xl">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f
                    ? "bg-[var(--brand-600)] text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-tertiary)] font-medium text-sm">
            No withdrawal requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-[var(--border-soft)] text-[var(--text-secondary)] text-[10px] uppercase tracking-wider">
                  <th className="pb-3 pt-4 px-6 font-bold">User</th>
                  <th className="pb-3 pt-4 font-bold">Amount</th>
                  <th className="pb-3 pt-4 font-bold">Method</th>
                  <th className="pb-3 pt-4 font-bold">Account</th>
                  <th className="pb-3 pt-4 font-bold">Status</th>
                  <th className="pb-3 pt-4 font-bold">Date</th>
                  <th className="pb-3 pt-4 font-bold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => {
                  const st = statusMap[w.status] || statusMap.PENDING;
                  return (
                    <tr
                      key={w.id}
                      className="border-b border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {w.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1">
                              {w.userName}
                              {w.isMockUser && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black">MOCK</span>}
                            </div>
                            <div className="text-[10px] text-[var(--text-tertiary)]">{w.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-black text-sm">Rs. {w.amount.toLocaleString()}</td>
                      <td className="py-3.5 text-sm text-[var(--text-secondary)]">{w.paymentMethod}</td>
                      <td className="py-3.5">
                        <div className="text-sm">
                          <div className="font-bold text-[var(--text-primary)]">{w.accountTitle}</div>
                          <div className="font-mono text-[10px] text-[var(--text-tertiary)]">{w.accountNumber}</div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-[var(--text-tertiary)] font-medium">
                        {new Date(w.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 pr-6">
                        {w.status === "PENDING" ? (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handle(w.id, "APPROVE")}
                              disabled={actionLoading === w.id}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
                            >
                              {actionLoading === w.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                              Approve
                            </button>
                            <button
                              onClick={() => handle(w.id, "REJECT")}
                              disabled={actionLoading === w.id}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
                            >
                              <X className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-tertiary)]">—</span>
                        )}
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
