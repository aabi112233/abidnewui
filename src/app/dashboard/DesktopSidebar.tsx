"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, BookOpen, Wallet,
  User, ShieldAlert, Network, GraduationCap, Megaphone, TrendingUp, Calculator
} from "lucide-react";

const mainNav = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/store",        icon: ShoppingBag,     label: "Store" },
  { href: "/dashboard/learning",     icon: BookOpen,        label: "My Learning" },
  { href: "/dashboard/network",      icon: Network,         label: "My Network" },
  { href: "/dashboard/wallet",       icon: Wallet,          label: "Wallet" },
  { href: "/dashboard/calculator",   icon: Calculator,      label: "Earnings Calculator" },
  { href: "/dashboard/certificates", icon: GraduationCap,   label: "Certificates" },
  { href: "/dashboard/announcements",icon: Megaphone,       label: "Announcements" },
  { href: "/dashboard/profile",      icon: User,            label: "Profile" },
];

export default function DesktopSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[256px] bg-white border-r border-[var(--border-soft)] sticky top-0 h-screen overflow-y-auto custom-scrollbar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[68px] shrink-0 mb-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <BookOpen className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">NexusLearn</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.15em] px-3 mb-3">Main</p>
        {mainNav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href} href={href} prefetch={false}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-200 group relative ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"}`} />
              <span className={active ? "font-bold" : "font-medium"}>{label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-[var(--border-soft)]" />
            <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.15em] px-3 mb-3">Admin</p>
            <Link
              href="/admin" prefetch={false}
              className={`flex items-center gap-3 px-3 py-[9px] rounded-xl text-[13px] font-semibold transition-all duration-200 group relative ${
                pathname.startsWith("/admin")
                  ? "bg-red-50 text-red-700"
                  : "text-[var(--text-secondary)] hover:text-red-700 hover:bg-red-50"
              }`}
            >
              {pathname.startsWith("/admin") && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-red-500 rounded-r-full" />
              )}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-red-50 text-red-400 group-hover:bg-red-100"
              }`}>
                <ShieldAlert className="w-[16px] h-[16px]" />
              </div>
              <span className={pathname.startsWith("/admin") ? "font-bold" : ""}>Admin Console</span>
            </Link>
          </>
        )}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-4 shrink-0 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=olivia" alt="Olivia Smith" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">Olivia Smith</p>
              <p className="text-[11px] text-slate-500 mt-1">View profile</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      </div>
    </aside>
  );
}
