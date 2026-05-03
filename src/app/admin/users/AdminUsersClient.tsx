"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Download, Eye, ShieldBan } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isMockUser: boolean;
  referralCode: string;
  referrals: number;
  purchases: number;
  createdAt: string;
}

const ROLE_FILTERS = ["All Roles", "Student", "Admin"] as const;

export default function AdminUsersClient({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All Roles");

  const filtered = useMemo(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.referralCode.toLowerCase().includes(q)
      );
    }
    if (roleFilter === "Student") result = result.filter((u) => u.role === "USER");
    if (roleFilter === "Admin") result = result.filter((u) => u.role === "ADMIN" || u.email === "admin@nexuslearn.com");
    return result;
  }, [users, search, roleFilter]);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Role", "Referral Code", "Referrals", "Purchases", "Status", "Joined"];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.role === "USER" ? "Student" : "Admin",
      u.referralCode,
      u.referrals,
      u.purchases,
      u.isActive ? "Active" : "Banned",
      new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBan = async (userId: string, currentlyActive: boolean) => {
    const action = currentlyActive ? "ban" : "unban";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const res = await fetch("/api/admin/users/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentlyActive }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update user status");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Users</h1>
        <button
          onClick={exportCSV}
          className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5 w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="elegant-card overflow-hidden">
        {/* Header with search & filter */}
        <div className="px-5 sm:px-6 py-4 border-b border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-black text-[var(--text-primary)]">
            All Users
            <span className="ml-2 text-xs font-bold text-[var(--text-tertiary)]">({users.length})</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="elegant-input text-xs h-9 w-full sm:w-48 pl-9"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="elegant-input text-xs h-9 w-full sm:w-28 bg-white cursor-pointer"
            >
              {ROLE_FILTERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-tertiary)] font-medium text-sm">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b-2 border-[var(--border-soft)] text-[var(--text-secondary)] text-[10px] uppercase tracking-wider">
                  <th className="pb-3 pt-4 px-6 font-bold">User</th>
                  <th className="pb-3 pt-4 font-bold">Role</th>
                  <th className="pb-3 pt-4 font-bold">Referral Code</th>
                  <th className="pb-3 pt-4 font-bold">Referrals</th>
                  <th className="pb-3 pt-4 font-bold">Status</th>
                  <th className="pb-3 pt-4 font-bold">Joined</th>
                  <th className="pb-3 pt-4 font-bold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--accent-purple)] text-white font-black text-sm flex items-center justify-center shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[var(--text-primary)]">{u.name}</div>
                          <div className="text-[10px] text-[var(--text-tertiary)]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.role === "USER"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {u.role === "USER" ? "Student" : "Admin"}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-mono text-xs font-bold text-[var(--brand-600)]">
                        {u.referralCode}
                      </span>
                    </td>
                    <td className="py-3.5 text-sm font-bold text-[var(--text-primary)] text-center">
                      {u.referrals}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {u.isActive ? "Active" : "Banned"}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs text-[var(--text-tertiary)] font-medium">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 pr-6">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="text-xs font-bold text-[var(--brand-600)] hover:text-[var(--brand-500)] transition-colors"
                        >
                          View
                        </Link>
                        {u.role === "USER" && (
                          <button
                            onClick={() => handleBan(u.id, u.isActive)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                          >
                            {u.isActive ? "Ban" : "Unban"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
