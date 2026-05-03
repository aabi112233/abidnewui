"use client";

import { useState, useMemo } from "react";
import { Users, Search, ChevronDown, UserPlus, Calendar, ShoppingBag, Network, Mail } from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  isMockUser: boolean;
  referralCode: string | null;
  _count: { purchases: number; referrals: number };
}

export default function AdminUsersSection({ users }: { users: UserData[] }) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "purchases" | "referrals">("newest");

  const filtered = useMemo(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.referralCode || "").toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "purchases": result.sort((a, b) => b._count.purchases - a._count.purchases); break;
      case "referrals": result.sort((a, b) => b._count.referrals - a._count.referrals); break;
      case "newest": default: break;
    }
    return result;
  }, [users, search, sortBy]);

  const display = showAll ? filtered : filtered.slice(0, 10);

  return (
    <div className="elegant-card border-t-4 border-t-[var(--brand-500)] overflow-hidden animate-fade-up" style={{ animationDelay: '300ms' }}>
      <div className="px-4 sm:px-6 py-5 border-b border-[var(--border-soft)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[var(--brand-600)]" />
            <h2 className="text-lg font-black text-[var(--text-primary)]">All Users</h2>
            <span className="bg-[var(--brand-50)] text-[var(--brand-600)] py-0.5 px-2.5 rounded-full text-xs font-bold">{users.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="elegant-input text-xs h-9 w-48" style={{ paddingLeft: "2.25rem" }}
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="elegant-input text-xs h-9 w-32 appearance-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="purchases">Most Purchases</option>
              <option value="referrals">Most Referrals</option>
            </select>
          </div>
        </div>
      </div>

      {display.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-tertiary)] font-medium">
          <Users className="w-10 h-10 mx-auto mb-2 text-[var(--border-strong)]" />
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-[var(--border-soft)] text-[var(--text-secondary)] text-[10px] uppercase tracking-wider">
                <th className="pb-3 pt-4 px-6 font-bold">User</th>
                <th className="pb-3 pt-4 font-bold">Referral Code</th>
                <th className="pb-3 pt-4 font-bold text-center">Purchases</th>
                <th className="pb-3 pt-4 font-bold text-center">Referrals</th>
                <th className="pb-3 pt-4 font-bold">Joined</th>
                <th className="pb-3 pt-4 font-bold">Type</th>
              </tr>
            </thead>
            <tbody>
              {display.map(user => (
                <tr key={user.id} className="border-b border-[var(--border-soft)] hover:bg-[var(--brand-50)] transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-600)] text-white font-black text-xs flex items-center justify-center shrink-0">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)]">{user.name || "—"}</div>
                        <div className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    {user.referralCode ? (
                      <span className="font-mono text-xs bg-[var(--bg-subtle)] px-2 py-1 rounded text-[var(--text-secondary)]">{user.referralCode}</span>
                    ) : <span className="text-[var(--text-tertiary)] text-xs">—</span>}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${user._count.purchases > 0 ? "text-emerald-600" : "text-[var(--text-tertiary)]"}`}>
                      <ShoppingBag className="w-3 h-3" /> {user._count.purchases}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${user._count.referrals > 0 ? "text-[var(--brand-600)]" : "text-[var(--text-tertiary)]"}`}>
                      <Network className="w-3 h-3" /> {user._count.referrals}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-[var(--text-tertiary)] font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "2-digit" })}
                  </td>
                  <td className="py-3">
                    {user.isMockUser ? (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black">MOCK</span>
                    ) : (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black">REAL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 10 && (
        <div className="px-6 py-3 border-t border-[var(--border-soft)]">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-bold text-[var(--brand-600)] hover:text-[var(--brand-500)] transition-colors"
          >
            {showAll ? "Show Less" : `View All ${filtered.length} Users`}
          </button>
        </div>
      )}
    </div>
  );
}
