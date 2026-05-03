"use client";
 
import { useSession } from "next-auth/react";
import {
  Wallet, TrendingUp, Users, Copy, CheckCircle2, Trophy, Zap,
  Star, ArrowUpRight, Activity, Crown, Sun, Calendar, BarChart2,
  Medal, Award, ChevronUp, Flame, Target
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
 
// ──────────────────────────────────────────
// Count-Up Hook
// ──────────────────────────────────────────
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
 
// ──────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────
const PAKISTANI_NAMES = [
  "Ali Raza", "Sana Malik", "Hamza Sheikh", "Ayesha Siddiqui", "Bilal Khan",
  "Fatima Zahra", "Usman Gani", "Zainab Ali", "Tariq Mahmood", "Hira Shah",
  "Omer Farooq", "Nida Ahmed", "Saad Bin Zafar", "Madiha Tahir", "Zeeshan Haider"
];
 
const ACTIONS_BASE = [
  { action: "joined the network", detail: "via referral code",      color: "text-blue-600",   bg: "bg-blue-50",   isEarning: false },
  { action: "",                   detail: "Level 1 Commission",      color: "text-green-600",  bg: "bg-green-50",  isEarning: true  },
  { action: "",                   detail: "Level 2 Commission",      color: "text-green-600",  bg: "bg-green-50",  isEarning: true  },
  { action: "unlocked a course",  detail: "Mastering AI & Web",      color: "text-purple-600", bg: "bg-purple-50", isEarning: false },
  { action: "withdrew earnings",  detail: "to Easypaisa wallet",     color: "text-amber-600",  bg: "bg-amber-50",  isEarning: false },
];
 
function makeAction() {
  const base = ACTIONS_BASE[Math.floor(Math.random() * ACTIONS_BASE.length)];
  const earning = Math.floor(Math.random() * (20000 - 200 + 1)) + 200;
  const action = base.isEarning ? `earned Rs. ${earning.toLocaleString()}` : base.action;
  return { ...base, action };
}
 
// ──────────────────────────────────────────
// Weekly Earnings Chart Data
// ──────────────────────────────────────────
function generateChartData(days: number) {
  const labels: string[] = [];
  const values: number[] = [];
  const referrals: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(days === 7
      ? d.toLocaleDateString("en-US", { weekday: "short" })
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
    values.push(Math.floor(Math.random() * 3000) + 200);
    referrals.push(Math.floor(Math.random() * 3));
  }
  return { labels, values, referrals };
}
 
const CHART_7  = generateChartData(7);
const CHART_30 = generateChartData(30);
 
// ──────────────────────────────────────────
// Badge System
// ──────────────────────────────────────────
const BADGES = [
  { id: "bronze", label: "Bronze",  emoji: "🥉", icon: Medal,  color: "text-amber-700",  bg: "from-amber-50 to-orange-50",   border: "border-amber-200",  glow: "shadow-amber-200",  threshold: 5  },
  { id: "silver", label: "Silver",  emoji: "🥈", icon: Award,  color: "text-slate-600",  bg: "from-slate-50 to-blue-50",     border: "border-slate-200",  glow: "shadow-slate-200",  threshold: 20 },
  { id: "gold",   label: "Gold",    emoji: "🥇", icon: Crown,  color: "text-amber-500",  bg: "from-yellow-50 to-amber-50",   border: "border-yellow-300", glow: "shadow-yellow-200", threshold: 50 },
];
 
// ──────────────────────────────────────────
// Leaderboard (weekly)
// ──────────────────────────────────────────
const LEADERBOARD_WEEKLY = [
  { rank: 1, name: "Hamza Sheikh",   earned: 28500, referrals: 12, delta: "+4" },
  { rank: 2, name: "Sara Malik",     earned: 19800, referrals: 8,  delta: "+2" },
  { rank: 3, name: "Bilal Khan",     earned: 15200, referrals: 6,  delta: "+1" },
  { rank: 4, name: "Zainab Ali",     earned: 11400, referrals: 5,  delta: "—"  },
  { rank: 5, name: "Usman Rao",      earned: 8300,  referrals: 3,  delta: "-1" },
  { rank: 6, name: "Madiha Tahir",   earned: 6100,  referrals: 2,  delta: "+3" },
];
 
export default function DashboardPage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [animateStats, setAnimateStats] = useState(false);
  const [activity, setActivity] = useState<any[]>([]);
  const [chartRange, setChartRange] = useState<7 | 30>(7);
  const [chartAnimated, setChartAnimated] = useState(false);
 
  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setTimeout(() => setAnimateStats(true), 100);
        setTimeout(() => setChartAnimated(true), 500);
      }
    }
    loadData();
 
    const initial = Array.from({ length: 6 }).map((_, i) => ({
      ...makeAction(),
      user: PAKISTANI_NAMES[Math.floor(Math.random() * PAKISTANI_NAMES.length)],
      time: `${(i + 1) * 2}m ago`
    }));
    setActivity(initial);
 
    const interval = setInterval(() => {
      const newEntry = {
        ...makeAction(),
        user: PAKISTANI_NAMES[Math.floor(Math.random() * PAKISTANI_NAMES.length)],
        time: "Just now"
      };
      setActivity(prev => [newEntry, ...prev.slice(0, 9)]);
    }, 7000);
 
    return () => clearInterval(interval);
  }, []);
 
  const copyCode = () => {
    if (userData?.referralCode) {
      navigator.clipboard.writeText(userData.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
 
  const copyLink = () => {
    if (userData?.referralCode) {
      const link = `${window.location.origin}/register?ref=${userData.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
 
  const networkCount   = userData?._count?.referrals || 0;
  const milestone      = 100000;
  const totalEarnings  = userData?.wallet?.totalEarnings || 0;
  const progress       = Math.min((totalEarnings / milestone) * 100, 100);
  const breakdown      = userData?.earningsBreakdown || { today: 0, last7days: 0, thisMonth: 0, lifetime: 0 };
 
  // Badge computation
  const currentBadge = networkCount >= 50 ? "gold" : networkCount >= 20 ? "silver" : networkCount >= 5 ? "bronze" : null;
  const nextBadge = currentBadge === "gold" ? null : currentBadge === "silver" ? BADGES[2] : currentBadge === "bronze" ? BADGES[1] : BADGES[0];
  const badgeProgress = nextBadge
    ? Math.min((networkCount / nextBadge.threshold) * 100, 100)
    : 100;
 
  // Chart data
  const chart = chartRange === 7 ? CHART_7 : CHART_30;
  const chartMax = Math.max(...chart.values, 1);
  const thisWeekEarnings = CHART_7.values.reduce((a, b) => a + b, 0);
  const newReferrals = CHART_7.referrals.reduce((a, b) => a + b, 0);
 
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 pb-10">
 
      {/* ── Welcome ── */}
      <header className="animate-fade-up">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Welcome back, {session?.user?.name?.split(' ')[0] || "Champion"}! 👋
            </h1>
            <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">
              Your network is growing — keep sharing your invite to unlock more earnings.
            </p>
          </div>
        </div>
      </header>
 
      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <button onClick={copyLink} className={`elegant-card p-4 flex items-center gap-3 group cursor-pointer ${copied ? 'border-green-200 bg-green-50' : 'hover:border-blue-200'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-blue-50 text-blue-600 group-hover:scale-110'} transition-all`}>
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-[var(--text-primary)]">{copied ? 'Copied!' : 'Copy Link'}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Share your invite</p>
          </div>
        </button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`Join NexusLearn! Use my code: ${userData?.referralCode}\n${typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${userData?.referralCode}` : ''}`)}`} target="_blank" rel="noopener noreferrer"
          className="elegant-card p-4 flex items-center gap-3 group hover:border-green-200 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-[var(--text-primary)]">WhatsApp</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Share via chat</p>
          </div>
        </a>
        <Link href="/dashboard/network" className="elegant-card p-4 flex items-center gap-3 group hover:border-purple-200 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-[var(--text-primary)]">My Network</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">{networkCount} referrals</p>
          </div>
        </Link>
        <Link href="/dashboard/wallet" className="elegant-card p-4 flex items-center gap-3 group hover:border-amber-200 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-[var(--text-primary)]">Withdraw</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Rs. {(userData?.wallet?.balance || 0).toLocaleString()}</p>
          </div>
        </Link>
      </div>

      {/* ── Earnings Breakdown ── */}
      <div className="elegant-card p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-lg font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[var(--brand-600)]" /> Earnings Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Today",      value: breakdown.today,      icon: Sun,       color: "text-amber-600",  bg: "bg-amber-50",  fill: "bg-amber-500"  },
            { label: "Last 7 Days",value: breakdown.last7days,  icon: Activity,  color: "text-blue-600",   bg: "bg-blue-50",   fill: "bg-blue-500"   },
            { label: "This Month", value: breakdown.thisMonth,  icon: Calendar,  color: "text-purple-600", bg: "bg-purple-50", fill: "bg-purple-500" },
            { label: "Lifetime",   value: breakdown.lifetime,   icon: TrendingUp,color: "text-green-600",  bg: "bg-green-50",  fill: "bg-green-500"  },
          ].map(({ label, value, icon: Icon, color, bg, fill }, idx) => (
            <div key={label} className={`p-4 rounded-xl ${bg} relative overflow-hidden group`}>
              <div
                className={`absolute bottom-0 left-0 h-1 ${fill} transition-all duration-1000 ease-out`}
                style={{ width: animateStats ? '100%' : '0%', transitionDelay: `${idx * 150}ms` }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
                </div>
                <p className={`text-xl font-black ${color}`}>
                  Rs. <AnimatedStat value={value || 0} enabled={animateStats} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── Earnings Graph ── */}
      <div className="elegant-card p-6 animate-fade-up" style={{ animationDelay: '180ms' }}>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--brand-600)]" /> Earnings Graph
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
              Daily earnings & referral growth trend
            </p>
          </div>
          {/* Toggle */}
          <div className="inline-flex rounded-xl border border-[var(--border-strong)] overflow-hidden text-xs font-bold">
            {([7, 30] as const).map(n => (
              <button
                key={n}
                onClick={() => setChartRange(n)}
                className={`px-4 py-2 transition-all ${
                  chartRange === n
                    ? "bg-[var(--brand-600)] text-white"
                    : "bg-white text-[var(--text-secondary)] hover:bg-[var(--brand-50)]"
                }`}
              >
                {n === 7 ? "Last 7 Days" : "Last 30 Days"}
              </button>
            ))}
          </div>
        </div>
 
        {/* Summary pills */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
            <Flame className="w-4 h-4 text-green-600" />
            <span className="text-sm font-black text-green-700">This Week Earnings: <span className="text-green-600">+Rs. {thisWeekEarnings.toLocaleString()}</span></span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-black text-blue-700">New Referrals: <span className="text-blue-600">{newReferrals}</span></span>
          </div>
        </div>
 
        {/* Bar Chart */}
        <div className="relative">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ paddingBottom: "28px" }}>
            {[1, 0.75, 0.5, 0.25, 0].map((frac) => (
              <div key={frac} className="border-t border-slate-100 w-full relative">
                <span className="absolute -top-2.5 -left-1 text-[9px] font-bold text-[var(--text-tertiary)]">
                  {frac === 0 ? "0" : `${Math.round((chartMax * frac) / 1000)}k`}
                </span>
              </div>
            ))}
          </div>
 
          {/* Bars */}
          <div
            className="flex items-end gap-1 pl-7 overflow-x-auto"
            style={{ height: "180px", paddingBottom: "28px" }}
          >
            {chart.labels.map((label, i) => {
              const pct = (chart.values[i] / chartMax) * 100;
              const refs = chart.referrals[i];
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[20px] group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    Rs. {chart.values[i].toLocaleString()}
                    {refs > 0 && <><br />{refs} referral{refs > 1 ? "s" : ""}</>}
                  </div>
                  {/* Bar */}
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-[var(--brand-600)] to-blue-400 hover:from-[var(--brand-500)] hover:to-blue-300 transition-all duration-300 relative overflow-hidden"
                    style={{
                      height: chartAnimated ? `${pct}%` : "0%",
                      transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                      transitionDelay: `${i * 40}ms`,
                      minHeight: "4px",
                    }}>
                    {refs > 0 && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/80" />
                    )}
                  </div>
                  {/* Label */}
                  <span className="text-[8px] sm:text-[9px] font-bold text-[var(--text-tertiary)] truncate w-full text-center absolute bottom-0">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] text-[var(--text-tertiary)] mt-1 pl-7">
            ● White dot = referral joined that day
          </p>
        </div>
      </div>
 
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`elegant-card p-6 group hover:-translate-y-1 transition-all duration-300 ${animateStats ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">My Network</p>
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
              <Users className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
            </div>
          </div>
          <p className="text-4xl font-black text-[var(--text-primary)]">
            <AnimatedStat value={networkCount} enabled={animateStats} />
          </p>
          <p className="text-xs font-bold text-purple-600 mt-3 flex items-center gap-1">
            <Star className="w-3 h-3" /> Direct Students / Team Members
          </p>
        </div>
 
        <div className={`elegant-card p-6 group hover:-translate-y-1 transition-all duration-300 ${animateStats ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Rank Milestone</p>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <Trophy className="w-4 h-4 text-amber-600 group-hover:text-white transition-colors" />
            </div>
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">Rs. {milestone.toLocaleString()} Unlock</p>
          <div className="mt-4">
            <div className="flex justify-between text-[10px] font-bold text-[var(--text-tertiary)] mb-1.5">
              <span>{Math.round(progress)}% reached</span>
              <span>🏆 Gold Badge</span>
            </div>
            <div className="h-2 bg-[var(--border-strong)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000"
                style={{ width: `${animateStats ? progress : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
 
      {/* ── Badge System ── */}
      <div className="elegant-card p-6 animate-fade-up" style={{ animationDelay: '350ms' }}>
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-[var(--brand-600)]" />
          <h3 className="text-lg font-black text-[var(--text-primary)]">Achievement Badges</h3>
          {currentBadge && (
            <span className="ml-auto text-xs font-bold bg-gradient-to-r from-[var(--brand-600)] to-blue-600 text-white px-3 py-1 rounded-full shadow-sm">
              {currentBadge.charAt(0).toUpperCase() + currentBadge.slice(1)} Member
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const unlocked = networkCount >= badge.threshold;
            const isCurrent = currentBadge === badge.id;
            return (
              <div
                key={badge.id}
                className={`rounded-xl border-2 p-5 text-center transition-all duration-300 bg-gradient-to-br ${badge.bg} ${
                  unlocked
                    ? `${badge.border} shadow-lg ${badge.glow}`
                    : "border-slate-100 opacity-60 grayscale"
                } ${isCurrent ? "ring-2 ring-[var(--brand-500)] ring-offset-2" : ""}`}
              >
                <div className="text-4xl mb-2">{badge.emoji}</div>
                <p className={`font-black text-base ${unlocked ? badge.color : "text-slate-400"}`}>
                  {badge.label}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] font-medium mt-1 mb-3">
                  {badge.threshold} referrals required
                </p>
                {unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--brand-500)] to-blue-400 rounded-full transition-all duration-1000"
                        style={{ width: animateStats ? `${Math.min((networkCount / badge.threshold) * 100, 100)}%` : "0%" }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)]">
                      {networkCount}/{badge.threshold} referrals
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {nextBadge && (
          <div className="mt-4 bg-gradient-to-r from-[var(--brand-50)] to-blue-50 border border-[var(--brand-100)] rounded-xl p-4 flex items-center gap-3">
            <div className="text-2xl">{nextBadge.emoji}</div>
            <div className="flex-1">
              <p className="text-sm font-black text-[var(--text-primary)]">
                Next: {nextBadge.label} Badge — {nextBadge.threshold - networkCount} more referrals to go!
              </p>
              <div className="h-1.5 bg-white rounded-full overflow-hidden mt-2 border border-[var(--border-strong)]">
                <div
                  className="h-full bg-gradient-to-r from-[var(--brand-500)] to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: animateStats ? `${badgeProgress}%` : "0%" }}
                />
              </div>
            </div>
            <span className="text-sm font-black text-[var(--brand-600)]">{Math.round(badgeProgress)}%</span>
          </div>
        )}
      </div>
 
      {/* ── Referral Widget + Live Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Referral Code Widget */}
        <div className="lg:col-span-3 elegant-card p-7 bg-gradient-to-br from-white via-[var(--brand-50)] to-white border-[var(--brand-100)] animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-600)] to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--brand-900)]">Your Invite Code</h3>
              <p className="text-xs font-semibold text-[var(--text-tertiary)]">Share this to earn passive income</p>
            </div>
          </div>
 
          <div onClick={copyCode} className="my-5 bg-white border-2 border-dashed border-[var(--brand-300)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--brand-600)] hover:bg-[var(--brand-50)] transition-all group">
            <code className="text-3xl sm:text-4xl font-black text-[var(--brand-600)] tracking-[0.3em] group-hover:scale-105 transition-transform inline-block">
              {userData?.referralCode || "LOADING..."}
            </code>
            <p className="text-xs font-bold text-[var(--text-tertiary)] mt-2">Click to copy code</p>
          </div>
 
          <div className="grid grid-cols-2 gap-3">
            <button onClick={copyCode} className="btn-secondary flex items-center justify-center gap-2">
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <button onClick={copyLink} className="btn-primary flex items-center justify-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Share Link
            </button>
          </div>
 
          <div className="mt-5 grid grid-cols-4 gap-2">
            {["L1", "L2", "L3", "L4"].map((level, i) => {
              const colors = ["var(--brand-600)", "#0f766e", "#b45309", "#7c3aed"];
              const rates  = ["30%", "10%", "7%", "3%"];
              return (
                <div key={level} className="text-center bg-white border border-[var(--border-soft)] rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-lg font-black" style={{ color: colors[i] }}>{rates[i]}</div>
                  <div className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wide">{level}</div>
                </div>
              );
            })}
          </div>
        </div>
 
        {/* Live Activity Feed */}
        <div className="lg:col-span-2 elegant-card overflow-hidden animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="p-5 border-b border-[var(--border-soft)] flex items-center gap-2 bg-gradient-to-r from-white to-slate-50">
            <Activity className="w-4 h-4 text-[var(--brand-600)]" />
            <h3 className="font-black text-[var(--text-primary)] text-sm">Live Network Activity</h3>
            <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
            </span>
          </div>
          <div className="divide-y divide-[var(--border-soft)] overflow-y-auto" style={{ maxHeight: "380px" }}>
            {activity.map((item, i) => (
              <div key={i} className="px-4 py-3.5 hover:bg-[var(--brand-50)] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center text-xs font-black shrink-0 ${item.color}`}>
                    {item.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                      <span className={item.color}>{item.user}</span>{" "}
                      <span className="font-medium text-[var(--text-secondary)]">{item.action}</span>
                    </p>
                    <p className="text-[11px] text-[var(--text-tertiary)] font-medium truncate mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-tertiary)] shrink-0">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Weekly Leaderboard ── */}
      <div className="elegant-card overflow-hidden animate-fade-up" style={{ animationDelay: '500ms' }}>
        <div className="p-6 border-b border-[var(--border-soft)] bg-gradient-to-r from-amber-50 via-white to-white flex items-center gap-3 flex-wrap">
          <Crown className="w-6 h-6 text-amber-500" />
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)]">Top Earners This Week</h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Leaderboard resets every Monday — rise to the top!</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Weekly Challenge
          </span>
        </div>

        <div className="divide-y divide-[var(--border-soft)]">
          {LEADERBOARD_WEEKLY.map((member) => (
            <div
              key={member.rank}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-[var(--brand-50)] transition-colors ${
                member.rank === 1 ? "bg-amber-50/60" : ""
              }`}
            >
              {/* Rank */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                member.rank === 1 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200" :
                member.rank === 2 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm" :
                member.rank === 3 ? "bg-gradient-to-br from-orange-300 to-amber-400 text-white shadow-sm" :
                "bg-slate-100 text-slate-500"
              }`}>
                {member.rank === 1 ? "👑" : member.rank === 2 ? "🥈" : member.rank === 3 ? "🥉" : `#${member.rank}`}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-black text-[var(--text-primary)] text-sm">{member.name}</p>
                <p className="text-[11px] font-bold text-[var(--text-tertiary)]">
                  {member.referrals} new referrals this week
                </p>
              </div>

              {/* Delta */}
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
                member.delta.startsWith("+") ? "text-green-600 bg-green-50" :
                member.delta === "—" ? "text-slate-500 bg-slate-100" :
                "text-red-500 bg-red-50"
              }`}>
                {member.delta.startsWith("+") && <ChevronUp className="w-3 h-3" />}
                {member.delta}
              </div>

              {/* Earnings */}
              <div className="text-right shrink-0">
                <p className="font-black text-[var(--brand-600)]">Rs. {member.earned.toLocaleString()}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] font-medium">this week</p>
              </div>
            </div>
          ))}
        </div>

        {/* You are at rank notice */}
        <div className="px-6 py-4 bg-gradient-to-r from-[var(--brand-50)] to-white border-t border-[var(--border-soft)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-100)] flex items-center justify-center text-xs font-black text-[var(--brand-600)]">
            {session?.user?.name?.charAt(0) || "Y"}
          </div>
          <div>
            <p className="text-sm font-black text-[var(--text-primary)]">
              You are currently <span className="text-[var(--brand-600)]">#12</span> on the leaderboard
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium">Refer more to climb higher and earn bigger!</p>
          </div>
          <Link href="/dashboard/network" className="ml-auto btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> Grow Network
          </Link>
        </div>
      </div>

    </div>
  );
}
