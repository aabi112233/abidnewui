"use client";

import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminMobileTopBar() {
  const [open, setOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* Top Bar - visible only on mobile */}
      <div className="md:hidden flex items-center justify-between px-4 h-[56px] bg-white border-b border-[var(--border-soft)] shrink-0 sticky top-0 z-30">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <Menu className="w-5 h-5 text-[var(--text-primary)]" />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
            }}
          >
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-black text-[var(--text-primary)]">
            Admin Panel
          </span>
        </div>

        <span className="text-[11px] font-bold text-[var(--text-tertiary)]">
          {today}
        </span>
      </div>

      {/* Mobile Sidebar Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full animate-slide-in-left" style={{ animationDuration: "0.25s" }}>
            <AdminSidebar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
