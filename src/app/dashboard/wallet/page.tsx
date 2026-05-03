"use client";

import { useState, useEffect, useRef } from "react";
import { Wallet, TrendingUp, ArrowDownLeft, Clock, CheckCircle2, Calendar, BarChart2, Sun, Activity, XCircle, AlertTriangle, Users, DollarSign } from "lucide-react";

function useCountUp(target: number, duration = 1600, enabled = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled || target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, enabled]);
  return enabled ? value : target;
}

function AnimatedStat({ value, enabled }: { value: number; enabled: boolean }) {
  const count = useCountUp(value, 1400, enabled);
  return <>{count.toLocaleString()}</>;
}

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  PENDING: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  APPROVED: { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  COMPLETED: { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  REJECTED: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function WalletPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [activeTab, setActiveTab] = useState<"withdraw" | "history" | "commissions">("withdraw");

  // Withdrawal form 
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("EASYPAISA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [saveAccount, setSaveAccount] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [minWithdrawal, setMinWithdrawal] = useState(1000);

  // History data
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [tierBreakdown, setTierBreakdown] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const [userRes, settingRes, historyRes, commissionRes] = await Promise.all([
        fetch("/api/user/me"),
        fetch("/api/admin/settings"),
        fetch("/api/user/withdrawal-history"),
        fetch("/api/user/commissions"),
      ]);
      if (userRes.ok) {
        const data = await userRes.json();
        setUserData(data);
        if (data.savedPaymentMethod) {
          try {
            const saved = JSON.parse(data.savedPaymentMethod);
            setPaymentMethod(saved.paymentMethod || "EASYPAISA");
            setAccountNumber(saved.accountNumber || "");
            setAccountTitle(saved.accountTitle || "");
          } catch {}
        }
        setTimeout(() => setAnimateStats(true), 100);
      }
      if (settingRes.ok) {
        const settings = await settingRes.json();
        if (settings.MIN_WITHDRAWAL) setMinWithdrawal(parseFloat(settings.MIN_WITHDRAWAL));
      }
      if (historyRes.ok) {
        const data = await historyRes.json();
        setWithdrawals(data.withdrawals || []);
      }
      if (commissionRes.ok) {
        const data = await commissionRes.json();
        setCommissions(data.commissions || []);
        setTierBreakdown(data.tierBreakdown || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const wallet = userData?.wallet;
  const earnings = userData?.earningsBreakdown || { today: 0, last7days: 0, thisMonth: 0, lifetime: 0 };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!amount || parseFloat(amount) < minWithdrawal) { setSubmitError(`Minimum withdrawal is Rs. ${minWithdrawal.toLocaleString()}`); return; }
    if (parseFloat(amount) > (wallet?.balance || 0)) { setSubmitError("Amount exceeds your available balance"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/withdraw", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), paymentMethod, accountNumber, accountTitle, saveAccount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitSuccess(true);
      setAmount("");
      const updated = await fetch("/api/user/me");
      if (updated.ok) setUserData(await updated.json());
      const hRes = await fetch("/api/user/withdrawal-history");
      if (hRes.ok) { const h = await hRes.json(); setWithdrawals(h.withdrawals || []); }
    } catch (err: any) { setSubmitError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-10">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 sm:space-y-8 pb-10">
      <header className="animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Wallet & Earnings</h1>
        <p className="text-[var(--text-secondary)] font-medium mt-1 text-sm">Track your commissions and withdraw your earnings.</p>
      </header>

      {/* Balance Card */}
      <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="elegant-card p-5 sm:p-7 bg-gradient-to-br from-[var(--brand-900)] to-[var(--brand-600)] text-white relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-1000 ease-out" style={{ width: animateStats ? '100%' : '0%' }} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-3 sm:mb-4">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-wider mb-1">Available to Withdraw</p>
              <p className="text-3xl sm:text-4xl font-black">Rs. <AnimatedStat value={wallet?.balance || 0} enabled={animateStats} /></p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center min-w-[90px]">
                <p className="text-lg sm:text-xl font-black">Rs. <AnimatedStat value={wallet?.totalEarnings || 0} enabled={animateStats} /></p>
                <p className="text-[9px] sm:text-[10px] font-bold text-blue-200 uppercase tracking-wider">Total Earned</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 sm:p-4 text-center min-w-[90px]">
                <p className="text-lg sm:text-xl font-black">Rs. <AnimatedStat value={wallet?.pendingEarnings || 0} enabled={animateStats} /></p>
                <p className="text-[9px] sm:text-[10px] font-bold text-blue-200 uppercase tracking-wider">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="elegant-card p-5 sm:p-7 animate-fade-up" style={{ animationDelay: '150ms' }}>
        <h2 className="text-lg font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[var(--brand-600)]" /> Earnings Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Today", value: earnings.today, icon: Sun, color: "text-amber-600", bg: "bg-amber-50", fill: "bg-amber-500" },
            { label: "Last 7 Days", value: earnings.last7days, icon: Activity, color: "text-blue-600", bg: "bg-blue-50", fill: "bg-blue-500" },
            { label: "This Month", value: earnings.thisMonth, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50", fill: "bg-purple-500" },
            { label: "Lifetime", value: earnings.lifetime, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", fill: "bg-green-500" },
          ].map(({ label, value, icon: Icon, color, bg, fill }, idx) => (
            <div key={label} className={`p-3 sm:p-4 rounded-2xl ${bg} relative overflow-hidden group`}>
              <div className={`absolute bottom-0 left-0 h-1 ${fill} transition-all duration-1000 ease-out`} style={{ width: animateStats ? '100%' : '0%', transitionDelay: `${idx * 150}ms` }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
                </div>
                <p className={`text-lg sm:text-xl font-black ${color}`}>Rs. <AnimatedStat value={value || 0} enabled={animateStats} /></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Breakdown */}
      {tierBreakdown.length > 0 && (
        <div className="elegant-card p-5 sm:p-7 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Earnings by Tier
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tierBreakdown.map((tier: any) => {
              const colors = ["text-blue-600 bg-blue-50", "text-teal-600 bg-teal-50", "text-purple-600 bg-purple-50", "text-orange-600 bg-orange-50"];
              const [textColor, bgColor] = colors[tier.level - 1]?.split(" ") || ["text-slate-600", "bg-slate-50"];
              return (
                <div key={tier.level} className={`${bgColor} rounded-2xl p-4 text-center`}>
                  <p className="text-2xl font-black" style={{ color: textColor.replace("text-", "").replace("-600", "") }}>
                    <span className={textColor}>Rs. {tier.totalAmount.toLocaleString()}</span>
                  </p>
                  <p className="text-xs font-bold text-[var(--text-secondary)] mt-1">Level {tier.level}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)]">{tier.count} commission{tier.count !== 1 ? "s" : ""}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-50 p-1 rounded-2xl border border-[var(--border-soft)] animate-fade-up" style={{ animationDelay: '250ms' }}>
        {[
          { key: "withdraw", label: "Withdraw", icon: ArrowDownLeft },
          { key: "history", label: "History", icon: Clock },
          { key: "commissions", label: "Commissions", icon: DollarSign },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === key ? "bg-white shadow-sm text-[var(--brand-600)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "withdraw" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up">
          <div className="lg:col-span-2 elegant-card p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-[var(--brand-600)]" /> Request Withdrawal
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium mb-6">
              Minimum: <span className="font-black text-[var(--text-primary)]">Rs. {minWithdrawal.toLocaleString()}</span>. Processed within 24-48 hours.
            </p>

            {submitSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">Request Submitted!</h3>
                <p className="text-[var(--text-secondary)] text-sm">Admin will process it within 24-48 hours.</p>
                <button onClick={() => setSubmitSuccess(false)} className="btn-secondary mt-4 text-sm">Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Amount (Rs.)</label>
                    <input type="number" min={minWithdrawal} value={amount} onChange={e => setAmount(e.target.value)} required placeholder="Amount" className="elegant-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Method</label>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="elegant-input bg-white cursor-pointer">
                      <option value="EASYPAISA">Easypaisa</option>
                      <option value="JAZZCASH">JazzCash</option>
                      <option value="BANK">Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Account / IBAN</label>
                    <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required placeholder="Number" className="elegant-input font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Account Title</label>
                    <input type="text" value={accountTitle} onChange={e => setAccountTitle(e.target.value)} required placeholder="Name" className="elegant-input" />
                  </div>
                </div>
                <label className="flex items-center gap-3 p-3 bg-[var(--brand-50)] rounded-xl cursor-pointer hover:bg-[var(--brand-100)] transition-colors">
                  <input type="checkbox" checked={saveAccount} onChange={e => setSaveAccount(e.target.checked)} className="w-4 h-4 rounded border-[var(--brand-300)] text-[var(--brand-600)]" />
                  <span className="text-xs sm:text-sm font-bold text-[var(--brand-900)]">Save this withdrawal account for future use</span>
                </label>
                {submitError && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600">{submitError}</div>}
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 h-12 text-sm">
                  {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> : <><ArrowDownLeft className="w-4 h-4" /> Withdraw Funds</>}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="elegant-card p-5 sm:p-6 border-2 border-amber-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center mb-4"><Clock className="w-5 h-5 text-amber-600" /></div>
              <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Pending Clearance</p>
              <p className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">Rs. <AnimatedStat value={wallet?.pendingEarnings || 0} enabled={animateStats} /></p>
            </div>
            <div className="elegant-card p-5 sm:p-6 bg-[var(--brand-50)] border-none">
              <h3 className="font-bold text-[var(--brand-900)] mb-3 text-sm">Withdrawal Policy:</h3>
              <ul className="space-y-2">
                {[`Minimum: Rs. ${minWithdrawal.toLocaleString()}`, "Processing: 24–48 Business Hours", "Fees: Zero processing fees"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-800)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600)]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="elegant-card overflow-hidden animate-fade-up">
          <div className="p-5 border-b border-[var(--border-soft)]">
            <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" /> Withdrawal History
            </h2>
          </div>
          {withdrawals.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-tertiary)]">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-soft)]">
              {withdrawals.map((w: any) => {
                const config = statusConfig[w.status] || statusConfig.PENDING;
                const Icon = config.icon;
                return (
                  <div key={w.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-black text-[var(--text-primary)]">Rs. {w.amount.toLocaleString()}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                            {w.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                          {w.paymentMethod} • {new Date(w.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      {w.adminNote && (
                        <div className="text-xs text-[var(--text-secondary)] bg-slate-50 px-3 py-1 rounded-lg max-w-[150px] truncate hidden sm:block">
                          {w.adminNote}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "commissions" && (
        <div className="elegant-card overflow-hidden animate-fade-up">
          <div className="p-5 border-b border-[var(--border-soft)]">
            <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" /> Commission History
            </h2>
          </div>
          {commissions.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-tertiary)]">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">No commissions earned yet</p>
              <p className="text-xs mt-1">Share your referral link to start earning</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-soft)]">
              {commissions.map((c: any) => {
                const levelColors = ["text-blue-600 bg-blue-50", "text-teal-600 bg-teal-50", "text-purple-600 bg-purple-50", "text-orange-600 bg-orange-50"];
                const [tc, bc] = (levelColors[c.level - 1] || "text-slate-600 bg-slate-50").split(" ");
                return (
                  <div key={c.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bc}`}>
                        <span className={`text-xs font-black ${tc}`}>L{c.level}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[var(--text-primary)] text-sm">
                          <span className="text-green-600">+Rs. {c.amount.toLocaleString()}</span> from {c.fromUser}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                          {c.courseName} • {new Date(c.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${bc} ${tc}`}>Level {c.level}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
