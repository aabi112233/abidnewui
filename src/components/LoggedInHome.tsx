"use client";

import Link from "next/link";
import {
  LayoutDashboard, BookOpen, Wallet, ShoppingBag, TrendingUp,
  Users, ArrowRight, LogOut, Star, Zap, PlayCircle, Copy,
  CheckCircle2, Network, Bell
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface Course {
  id: string; title: string; price: number;
  shortDescription?: string; thumbnailUrl?: string;
  level?: string; category?: string; duration?: string;
}

interface User {
  name: string; email: string | null; referralCode: string | null;
  isMockUser: boolean;
  wallet: { balance: number; totalEarnings: number } | null;
  referralCount: number;
}

// Daily randomizer for mock user earnings display
function getDailyRandom(seed: number, min: number, max: number) {
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const hash = ((daySeed * seed * 9301 + 49297) % 233280) / 233280;
  return Math.floor(min + hash * (max - min));
}

export default function LoggedInHome({ user, courses }: { user: User; courses: Course[] }) {
  const [copied, setCopied] = useState(false);

  const copyReferral = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // For mock users, show simulated daily earnings
  const todayEarnings = user.isMockUser
    ? getDailyRandom(42, 800, 3200)
    : (user.wallet?.totalEarnings || 0);

  const quickLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-blue-500 to-indigo-600", desc: "View your stats & earnings" },
    { href: "/dashboard/store", label: "Course Store", icon: ShoppingBag, color: "from-emerald-500 to-teal-600", desc: "Browse & purchase courses" },
    { href: "/dashboard/learning", label: "My Learning", icon: BookOpen, color: "from-violet-500 to-purple-600", desc: "Access your unlocked courses" },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet, color: "from-amber-500 to-orange-500", desc: "Earnings & withdrawals" },
    { href: "/dashboard/network", label: "My Network", icon: Network, color: "from-pink-500 to-rose-500", desc: "Referral tree & team" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-slate-900">
              NexusLearn<span className="text-blue-500">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <div className="font-bold text-slate-800 leading-tight">{user.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{user.email}</div>
              </div>
            </div>
            <Link href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── Welcome Hero ── */}
          <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #0f766e 100%)" }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal-300 blur-3xl" />
            </div>
            <div className="relative z-10 p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white text-xs font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Welcome back!
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                    Hello, {user.name.split(" ")[0]}! 👋
                  </h1>
                  <p className="text-blue-100 font-medium text-base">
                    Your learning journey continues. Keep growing and earning!
                  </p>
                </div>

                {/* Stats bubble */}
                <div className="flex gap-4">
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[100px]">
                    <div className="text-2xl font-black text-white">Rs. {user.isMockUser ? getDailyRandom(7, 800, 3200).toLocaleString() : (user.wallet?.totalEarnings || 0).toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-1">Total Earned</div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[100px]">
                    <div className="text-2xl font-black text-white">{user.isMockUser ? getDailyRandom(13, 30, 70) : user.referralCount}</div>
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mt-1">Referrals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick Navigation ── */}
          <div>
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" /> Quick Access
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickLinks.map(({ href, label, icon: Icon, color, desc }) => (
                <Link key={href} href={href}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md p-5 flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1 group">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{label}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5 hidden sm:block">{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── Referral Code Card ── */}
            <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-black text-slate-800">Your Invite Code</h3>
              </div>

              {user.referralCode ? (
                <>
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-5 text-center mb-4">
                    <code className="text-2xl font-black text-blue-600 tracking-[0.3em]">{user.referralCode}</code>
                  </div>
                  <button
                    onClick={copyReferral}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      copied ? "bg-green-50 text-green-700 border border-green-100" : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Invite Link</>}
                  </button>
                  <div className="mt-4 space-y-1.5 text-xs font-bold text-slate-500">
                    {["30% (L1)", "10% (L2)", "7% (L3)", "3% (L4)"].map((r, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-1.5">
                        <span>Level {i + 1} Commission</span>
                        <span className="text-blue-600">{r.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm font-medium">Purchase a course to activate your referral code</p>
                  <Link href="/dashboard/store" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline">
                    <ShoppingBag className="w-4 h-4" /> Go to Store
                  </Link>
                </div>
              )}
            </div>

            {/* ── Recent Courses ── */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-violet-600" />
                  </div>
                  <h3 className="font-black text-slate-800">Available Courses</h3>
                </div>
                <Link href="/dashboard/store" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <PlayCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate">{course.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {course.category && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{course.category}</span>
                        )}
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" /> 4.9
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-slate-800 text-sm">Rs. {course.price.toLocaleString()}</div>
                      <Link href="/dashboard/store"
                        className="text-[10px] font-bold text-blue-600 hover:underline">
                        Buy Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link href="/dashboard/store"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors text-sm">
                  <ShoppingBag className="w-4 h-4" /> Browse All Courses
                </Link>
              </div>
            </div>
          </div>

          {/* ── Go to Dashboard CTA ── */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-white mb-1">Your full dashboard awaits</h3>
              <p className="text-slate-400 font-medium text-sm">Track earnings, manage referrals, and access all your courses.</p>
            </div>
            <Link href="/dashboard"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-8 rounded-2xl transition-colors whitespace-nowrap text-sm shadow-lg shadow-blue-900/30">
              <LayoutDashboard className="w-4 h-4" /> Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
