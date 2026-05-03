"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, BookOpen, Wallet,
  User, ShieldAlert, Network, MoreHorizontal, X,
  GraduationCap, Megaphone, Award, Settings, Calculator
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const mainNavItems = [
  { href: "/dashboard",          icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/network",  icon: Network,         label: "Team" },
  { href: "/dashboard/learning", icon: BookOpen,         label: "Learn" },
  { href: "/dashboard/store",    icon: ShoppingBag,      label: "Store" },
];

const moreNavItems = [
  { href: "/dashboard/wallet",        icon: Wallet,        label: "Wallet" },
  { href: "/dashboard/calculator",    icon: Calculator,    label: "Calculator" },
  { href: "/dashboard/certificates",  icon: GraduationCap, label: "Certificates" },
  { href: "/dashboard/announcements", icon: Megaphone,     label: "Announcements" },
  { href: "/dashboard/profile",       icon: User,          label: "Profile" },
];

export default function MobileSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Hide on course player pages — they handle their own navigation
  const isCoursePlayer = /^\/dashboard\/learning\/[^/]+$/.test(pathname);
  if (isCoursePlayer) return null;

  // Close "More" when navigating
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const allMoreItems = isAdmin
    ? [...moreNavItems, { href: "/admin", icon: ShieldAlert, label: "Admin Console" }]
    : moreNavItems;

  // Check if "More" should show as active (when user is on a page inside the more menu)
  const isMoreActive = allMoreItems.some(
    item => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      {/* More Panel - Slide up bottom sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMoreOpen(false)} />
          
          {/* Panel */}
          <div
            ref={panelRef}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-slide-up safe-area-bottom pb-safe z-50"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-soft)]">
              <h3 className="text-sm font-black text-[var(--text-primary)]">More Options</h3>
              <button
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[var(--text-tertiary)] hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Grid */}
            <div className="grid grid-cols-4 gap-1 p-4">
              {allMoreItems.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                      active
                        ? "bg-[var(--brand-50)] text-[var(--brand-700)]"
                        : "text-[var(--text-secondary)] hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        active
                          ? "text-white shadow-md"
                          : "bg-slate-100 text-[var(--text-tertiary)]"
                      }`}
                      style={
                        active
                          ? { background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }
                          : {}
                      }
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wide text-center leading-tight ${
                      active ? "text-[var(--brand-700)] font-bold" : ""
                    }`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Extra bottom space for safe area */}
            <div className="h-4" />
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[var(--border-soft)] md:hidden pb-safe">
        <div className="flex items-center justify-around px-1 py-1.5">
          {mainNavItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href} href={href}
                className={`flex flex-col items-center gap-[3px] px-2 py-1 rounded-2xl min-w-[54px] transition-all relative ${
                  active ? "text-[var(--brand-700)]" : "text-[var(--text-tertiary)]"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  active
                    ? "text-white shadow-md -translate-y-0.5"
                    : "bg-transparent"
                }`}
                  style={active ? { background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" } : {}}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <span className={`text-[9px] font-semibold tracking-wide ${
                  active ? "text-[var(--brand-700)] font-bold" : ""
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-[3px] px-2 py-1 rounded-2xl min-w-[54px] transition-all relative ${
              isMoreActive || moreOpen ? "text-[var(--brand-700)]" : "text-[var(--text-tertiary)]"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isMoreActive || moreOpen
                ? "text-white shadow-md -translate-y-0.5"
                : "bg-transparent"
            }`}
              style={(isMoreActive || moreOpen) ? { background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" } : {}}
            >
              <MoreHorizontal className="w-[18px] h-[18px]" />
            </div>
            <span className={`text-[9px] font-semibold tracking-wide ${
              isMoreActive || moreOpen ? "text-[var(--brand-700)] font-bold" : ""
            }`}>
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
