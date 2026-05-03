"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Users, Plus, Trash2, Edit, Loader2,
  Shuffle, Eye, EyeOff, RefreshCw, CheckCircle2, Sparkles
} from "lucide-react";

type MockUser = {
  id: string; name: string; email: string; referralCode: string;
  isMockUser: boolean; isActive: boolean;
  wallet?: { balance: number; totalEarnings: number; pendingEarnings: number };
  mockEarnings?: { today: number; last7days: number; thisMonth: number; lifetime: number; referralCount: number };
  createdAt: string;
};

export default function MockUsersPage() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [shuffling, setShuffling] = useState<string | null>(null);
  const [shufflingAll, setShufflingAll] = useState(false);
  const [showPw, setShowPw] = useState<Record<string, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    today: "1200", last7days: "8500", thisMonth: "32000",
    lifetime: "180000", balance: "45000", pendingEarnings: "5000", referralCount: "45",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/mock-users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  async function shuffle(id: string) {
    setShuffling(id);
    const res = await fetch("/api/admin/mock-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "shuffle", id }),
    });
    if (res.ok) {
      setSuccess("Data shuffled!");
      setTimeout(() => setSuccess(""), 2500);
      load();
    }
    setShuffling(null);
  }

  async function shuffleAll() {
    setShufflingAll(true);
    for (const u of users) {
      await fetch("/api/admin/mock-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "shuffle", id: u.id }),
      });
    }
    setSuccess("All mock users shuffled!");
    setTimeout(() => setSuccess(""), 3000);
    load();
    setShufflingAll(false);
  }

  async function deleteUser(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/admin/mock-users?id=${id}`, { method: "DELETE" });
    if (res.ok) { load(); setDeleteConfirm(null); }
    setDeleting(null);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setFormError(""); setFormLoading(true);
    const res = await fetch("/api/admin/mock-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, email: form.email, password: form.password,
        mockEarnings: {
          today: Number(form.today), last7days: Number(form.last7days),
          thisMonth: Number(form.thisMonth), lifetime: Number(form.lifetime),
          balance: Number(form.balance), pendingEarnings: Number(form.pendingEarnings),
          referralCount: Number(form.referralCount),
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) { setFormError(data.error || "Failed"); setFormLoading(false); return; }
    setShowForm(false);
    setForm({ name: "", email: "", password: "", today: "1200", last7days: "8500", thisMonth: "32000", lifetime: "180000", balance: "45000", pendingEarnings: "5000", referralCount: "45" });
    load();
    setSuccess("Mock user created!");
    setTimeout(() => setSuccess(""), 3000);
    setFormLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-[var(--text-secondary)] hover:text-[var(--brand-600)] flex items-center gap-2 mb-3 transition-colors w-max font-bold text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] flex items-center gap-3">
              <Users className="w-7 h-7 text-teal-600" /> Mock Users
            </h1>
            <p className="text-[var(--text-secondary)] mt-1 font-medium text-sm">
              Manage simulated users for leaderboards and social proof. Real users never see "MOCK" labels.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {users.length > 0 && (
              <button
                onClick={shuffleAll}
                disabled={shufflingAll}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-200 text-sm disabled:opacity-70"
              >
                {shufflingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Shuffle All Data
              </button>
            )}
            <button
              onClick={() => setShowForm(s => !s)}
              className="flex items-center gap-2 btn-primary px-4 py-2.5 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Mock User
            </button>
          </div>
        </div>

        {/* Success toast */}
        {success && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-3 rounded-2xl shadow-xl animate-fade-up">
            <CheckCircle2 className="w-4 h-4" /> {success}
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="elegant-card p-6 border-2 border-[var(--brand-100)] animate-fade-up">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-[var(--brand-600)]" />
              <h2 className="text-lg font-black text-[var(--text-primary)]">Create New Mock User</h2>
            </div>
            <form onSubmit={createUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Full Name</label>
                  <input required className="elegant-input" placeholder="Ahmad Khan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Email (Login)</label>
                  <input required type="email" className="elegant-input" placeholder="user@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Password</label>
                  <input required className="elegant-input" placeholder="Password123" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                </div>
              </div>
              <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider pt-2">Earnings Data (Rs.)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: "today", label: "Today" }, { key: "last7days", label: "Last 7 Days" },
                  { key: "thisMonth", label: "This Month" }, { key: "lifetime", label: "Lifetime" },
                  { key: "balance", label: "Wallet Balance" }, { key: "pendingEarnings", label: "Pending" },
                  { key: "referralCount", label: "Referrals" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">{label}</label>
                    <input type="number" className="elegant-input text-sm" value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              {formError && <p className="text-red-500 text-sm font-bold">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={formLoading} className="btn-primary flex items-center gap-2">
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create User
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="elegant-card p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-600)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-medium">Loading mock users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="elegant-card p-12 text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">No mock users yet</h3>
            <p className="text-[var(--text-secondary)] font-medium mb-5">Create mock users to populate leaderboards and social proof sections.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add First Mock User
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(u => {
              const earnings = u.mockEarnings;
              return (
                <div key={u.id} className="elegant-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[var(--text-primary)]">{u.name}</span>
                        <span className="text-[9px] bg-teal-100 text-teal-700 border border-teal-200 font-black px-1.5 py-0.5 rounded uppercase">MOCK</span>
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)] font-mono">{u.email}</div>
                      <div className="text-[10px] font-bold text-[var(--brand-600)] mt-0.5">Code: {u.referralCode}</div>
                    </div>
                  </div>

                  {/* Earnings badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {earnings && [
                      { label: "Today", val: earnings.today, color: "bg-amber-50 text-amber-700" },
                      { label: "Lifetime", val: earnings.lifetime, color: "bg-green-50 text-green-700" },
                      { label: "Balance", val: u.wallet?.balance || 0, color: "bg-blue-50 text-blue-700" },
                      { label: "Referrals", val: earnings.referralCount, color: "bg-purple-50 text-purple-700", noRs: true },
                    ].map(({ label, val, color, noRs }) => (
                      <div key={label} className={`${color} px-2.5 py-1.5 rounded-lg text-center`}>
                        <div className="font-black">{noRs ? val : `Rs. ${val?.toLocaleString()}`}</div>
                        <div className="text-[9px] font-bold opacity-70 uppercase">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => shuffle(u.id)}
                      disabled={shuffling === u.id}
                      title="Shuffle name & earnings"
                      className="flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
                    >
                      {shuffling === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shuffle className="w-3.5 h-3.5" />}
                      Shuffle
                    </button>
                    {deleteConfirm === u.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deleteUser(u.id)} disabled={deleting === u.id}
                          className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                          {deleting === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Confirm
                        </button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-lg transition-colors">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(u.id)}
                        className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 px-2.5 py-2 rounded-xl transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="elegant-card p-5 bg-[var(--brand-50)] border-none">
          <h3 className="font-bold text-[var(--brand-900)] mb-2 text-sm">ℹ️ How Mock Users Work</h3>
          <ul className="space-y-1 text-xs font-medium text-[var(--brand-700)]">
            <li>• Mock users can log in with their credentials but are completely separate from real users</li>
            <li>• Their earnings display in leaderboards and social-proof sections make the platform feel active</li>
            <li>• <strong>Shuffle</strong> randomizes their name and earnings data to keep the content fresh</li>
            <li>• Real users never see the "MOCK" badge — only admins can distinguish them</li>
          </ul>
        </div>

    </div>
  );
}
