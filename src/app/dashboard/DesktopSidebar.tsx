"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, BookOpen, Wallet,
  User, ShieldAlert, Network, GraduationCap, Megaphone, Calculator,
  Calendar, MessageSquare, FileText, Award, Settings, ChevronRight, Star
} from "lucide-react";

const mainNav = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/store",        icon: ShoppingBag,     label: "My Courses" },
  { href: "/dashboard/learning",     icon: BookOpen,        label: "My Learning" },
  { href: "/dashboard/network",      icon: Network,         label: "My Network" },
  { href: "/dashboard/wallet",       icon: Wallet,          label: "Wallet" },
  { href: "/dashboard/calculator",   icon: Calculator,      label: "Calculator" },
  { href: "/dashboard/certificates", icon: GraduationCap,   label: "Certificates" },
  { href: "/dashboard/announcements", icon: Megaphone,      label: "Announcements" },
  { href: "/dashboard/profile",      icon: Settings,        label: "Settings" },
];

export default function DesktopSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="learnova-sidebar">
      {/* Logo */}
      <div className="learnova-sidebar-logo">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="learnova-logo-icon">
            <BookOpen className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-[20px] font-extrabold tracking-tight" style={{ color: '#1e293b' }}>
            Nexus<span style={{ color: 'var(--brand-600)' }}>Learn</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="learnova-sidebar-nav custom-scrollbar">
        {mainNav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href} href={href} prefetch={false}
              className={`learnova-nav-item ${active ? "learnova-nav-active" : ""}`}
            >
              {active && <div className="learnova-nav-indicator" />}
              <Icon className={`w-[20px] h-[20px] ${active ? "text-[var(--brand-600)]" : "text-slate-400"}`} />
              <span>{label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-slate-100" />
            <Link
              href="/admin" prefetch={false}
              className={`learnova-nav-item ${pathname.startsWith("/admin") ? "learnova-nav-active" : ""}`}
            >
              {pathname.startsWith("/admin") && <div className="learnova-nav-indicator" />}
              <ShieldAlert className={`w-[20px] h-[20px] ${pathname.startsWith("/admin") ? "text-red-500" : "text-slate-400"}`} />
              <span>Admin Console</span>
            </Link>
          </>
        )}
      </nav>

      {/* Continue Learning Widget */}
      <div className="learnova-sidebar-widget">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Continue Learning</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-800 leading-tight truncate">Digital Skills</p>
            <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--brand-600)] rounded-full" style={{ width: '66%' }} />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">66% complete</p>
          </div>
        </div>
      </div>

      {/* Bottom User Profile */}
      <div className="learnova-sidebar-user">
        <Link href="/dashboard/profile" className="learnova-user-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=olivia" 
                alt="User" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-800 leading-none truncate">Olivia Smith</p>
              <p className="text-[11px] text-slate-400 mt-0.5">View profile</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>
      </div>
    </aside>
  );
}
