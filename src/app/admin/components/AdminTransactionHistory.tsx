"use client";

import { useState, useMemo } from "react";
import { BarChart2, Search, DollarSign, Calendar, CheckCircle2 } from "lucide-react";

interface Transaction {
  id: string;
  pricePaid: number;
  paymentMethod: string;
  transactionId: string;
  itemType: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
  course: { title: string } | null;
  bundle: { title: string } | null;
}

export default function AdminTransactionHistory({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(t =>
      (t.user.name || "").toLowerCase().includes(q) ||
      (t.user.email || "").toLowerCase().includes(q) ||
      (t.transactionId || "").toLowerCase().includes(q) ||
      (t.course?.title || "").toLowerCase().includes(q) ||
      (t.bundle?.title || "").toLowerCase().includes(q)
    );
  }, [transactions, search]);

  const display = showAll ? filtered : filtered.slice(0, 8);
  const totalRevenue = filtered.reduce((s, t) => s + t.pricePaid, 0);

  return (
    <div className="elegant-card border-t-4 border-t-emerald-500 overflow-hidden animate-fade-up" style={{ animationDelay: '360ms' }}>
      <div className="px-4 sm:px-6 py-5 border-b border-[var(--border-soft)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-[var(--text-primary)]">Transaction History</h2>
            <span className="bg-emerald-50 text-emerald-600 py-0.5 px-2.5 rounded-full text-xs font-bold">{transactions.length} approved</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
              Total: Rs. {totalRevenue.toLocaleString()}
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="elegant-input text-xs h-9 w-48" style={{ paddingLeft: "2.25rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {display.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-tertiary)] font-medium">
          <DollarSign className="w-10 h-10 mx-auto mb-2 text-[var(--border-strong)]" />
          No transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b-2 border-[var(--border-soft)] text-[var(--text-secondary)] text-[10px] uppercase tracking-wider">
                <th className="pb-3 pt-4 px-6 font-bold">Student</th>
                <th className="pb-3 pt-4 font-bold">Package</th>
                <th className="pb-3 pt-4 font-bold">Amount</th>
                <th className="pb-3 pt-4 font-bold">Method</th>
                <th className="pb-3 pt-4 font-bold">TID</th>
                <th className="pb-3 pt-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {display.map(t => (
                <tr key={t.id} className="border-b border-[var(--border-soft)] hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        {(t.user.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[var(--text-primary)]">{t.user.name}</div>
                        <div className="text-[9px] text-[var(--text-tertiary)]">{t.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-xs text-[var(--text-primary)]">
                      {t.itemType === "COURSE" ? t.course?.title : t.bundle?.title}
                    </span>
                    <span className="ml-1.5 text-[8px] bg-[var(--bg-subtle)] border border-[var(--border-soft)] px-1 py-0.5 rounded text-[var(--text-tertiary)] font-bold uppercase">{t.itemType}</span>
                  </td>
                  <td className="py-3 font-black text-sm text-emerald-600">Rs. {t.pricePaid.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">{t.paymentMethod}</span>
                  </td>
                  <td className="py-3 font-mono text-[10px] text-[var(--text-tertiary)]">{t.transactionId}</td>
                  <td className="py-3 text-[10px] text-[var(--text-tertiary)] font-medium">
                    {new Date(t.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 8 && (
        <div className="px-6 py-3 border-t border-[var(--border-soft)]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
          >
            {showAll ? "Show Less" : `View All ${filtered.length} Transactions`}
          </button>
        </div>
      )}
    </div>
  );
}
