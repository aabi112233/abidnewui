"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, CreditCard, Wallet,
  Users, UserPlus, Settings, ArrowDownLeft,
  TrendingUp, ExternalLink, X
} from "lucide-react";

const mainNav = [
  { href: "/admin",             icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/courses",     icon: BookOpen,        label: "Courses" },
  { href: "/admin/payments",    icon: CreditCard,      label: "Payments" },
  { href: "/admin/payment-methods", icon: Wallet,      label: "Payment Methods" },
  { href: "/admin/withdrawals", icon: ArrowDownLeft,   label: "Withdrawals" },
];

const managementNav = [
  { href: "/admin/users",       icon: Users,           label: "Users" },
  { href: "/admin/mock-users",  icon: UserPlus,        label: "Mock Users" },
  { href: "/admin/settings",    icon: Settings,        label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const renderLink = ({ href, icon: Icon, label }: typeof mainNav[0]) => {
    const active = isActive(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-[10px] rounded-xl text-[13px] font-semibold transition-all duration-200 group relative ${
          active
            ? "bg-[var(--brand-50)] text-[var(--brand-700)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
        }`}
      >
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--brand-500)]" />
        )}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            active
              ? "text-white shadow-md"
              : "bg-[var(--bg-subtle)] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
          }`}
          style={active ? { background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" } : {}}
        >
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <span className={active ? "font-bold" : "font-medium"}>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="flex flex-col w-[260px] min-w-[260px] shrink-0 bg-white border-r border-[var(--border-soft)] h-full overflow-y-auto custom-scrollbar">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-[68px] border-b border-[var(--border-soft)] shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0 group" onClick={onClose}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))" }}
          >
            <TrendingUp className="w-[18px] h-[18px] text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black text-[var(--text-primary)] leading-none truncate">
              NexusLearn<span className="text-[var(--brand-500)]">.</span>
            </h2>
            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mt-1 whitespace-nowrap">Admin Panel</p>
          </div>
        </Link>
        {/* Close button for mobile */}
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1.5 hover:bg-red-50 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-3 mb-3">
          Main
        </p>
        {mainNav.map(renderLink)}

        <div className="my-4 border-t border-[var(--border-soft)]" />
        <p className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-3 mb-3">
          Management
        </p>
        {managementNav.map(renderLink)}
      </nav>

      {/* View Site Button */}
      <div className="p-3 shrink-0 border-t border-[var(--border-soft)]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)] border border-[var(--border-soft)]"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </a>
      </div>
    </aside>
  );
}
