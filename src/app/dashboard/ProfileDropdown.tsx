"use client";
 
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Wallet, ChevronDown, ShieldCheck,
  LayoutDashboard, ShoppingBag, BookOpen, Network, GraduationCap, Megaphone
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
 
export default function ProfileDropdown({
  userName,
  userEmail,
  align = "bottom"
}: {
  userName: string;
  userEmail: string;
  align?: "top" | "bottom";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const mobileNavItems = [
    { href: "/dashboard",              icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/store",        icon: ShoppingBag,     label: "Store" },
    { href: "/dashboard/learning",     icon: BookOpen,        label: "My Learning" },
    { href: "/dashboard/network",      icon: Network,         label: "My Network" },
    { href: "/dashboard/wallet",       icon: Wallet,          label: "Wallet" },
    { href: "/dashboard/certificates", icon: GraduationCap,   label: "Certificates" },
    { href: "/dashboard/announcements", icon: Megaphone,      label: "Announcements" },
  ];
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--brand-50)] transition-all group w-full text-left ${isOpen ? "bg-[var(--brand-50)]" : ""}`}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-blue-600 flex items-center justify-center font-black text-white text-sm shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 hidden md:block">
          <div className="text-sm font-bold text-[var(--text-primary)] truncate">{userName}</div>
          <div className="text-[10px] text-[var(--text-tertiary)] truncate font-medium">{userEmail}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform hidden md:block ${isOpen ? "rotate-180" : ""}`} />
      </button>
 
      {isOpen && (
        <div className={`absolute ${align === "top" ? "bottom-full mb-2" : "top-full mt-2"} right-0 w-56 bg-white rounded-2xl shadow-2xl border border-[var(--border-soft)] py-2 z-50 animate-in fade-in zoom-in duration-200 origin-bottom-right`}>
          <div className="px-4 py-3 border-b border-[var(--border-soft)] mb-1 md:hidden">
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{userName}</p>
            <p className="text-[10px] text-[var(--text-tertiary)] truncate font-medium">{userEmail}</p>
          </div>
 
          {/* Mobile nav links */}
          <div className="md:hidden border-b border-[var(--border-soft)] mb-1 max-h-[200px] overflow-y-auto">
            {mobileNavItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-bold transition-colors ${
                    active
                      ? "text-[var(--brand-600)] bg-[var(--brand-50)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--brand-600)] hover:bg-[var(--brand-50)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--brand-600)] hover:bg-[var(--brand-50)] transition-colors"
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </Link>
 
          <Link
            href="/dashboard/wallet"
            onClick={() => setIsOpen(false)}
            className="hidden md:flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--brand-600)] hover:bg-[var(--brand-50)] transition-colors"
          >
            <Wallet className="w-4 h-4" />
            My Wallet
          </Link>
 
          <div className="my-1 border-t border-[var(--border-soft)]"></div>
 
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
