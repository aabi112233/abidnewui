"use client";

import { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AnnouncementPopup() {
  const [html, setHtml]       = useState("");
  const [visible, setVisible] = useState(false);
  const pathname              = usePathname();

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/public/announcement");
        if (!res.ok) return;
        const data = await res.json();

        if (!data.active || !data.html) return;

        // ── Page targeting ──
        // data.pages is an array of path prefixes like ["/", "/dashboard", "/dashboard/store"]
        // Empty / undefined = show on all pages (backwards compat)
        if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
          const match = data.pages.some((p: string) => {
            if (p === "/") return pathname === "/";
            return pathname === p || pathname.startsWith(p + "/");
          });
          if (!match) return;
        }

        // ── Dismiss memory (per-content hash) ──
        const key       = `announcement_dismissed_${btoa(data.html.slice(0, 50))}`;
        const dismissed = localStorage.getItem(key);
        if (dismissed) return;

        setHtml(data.html);
        setVisible(true);
      } catch (e) {}
    }
    check();
    // Re-run whenever the page changes so targeting works on navigation
  }, [pathname]);

  const dismiss = () => {
    const key = `announcement_dismissed_${btoa(html.slice(0, 50))}`;
    localStorage.setItem(key, "1");
    setVisible(false);
  };

  if (!visible || !html) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl animate-fade-up relative flex flex-col"
        style={{
          width: "100%",
          maxWidth: "32rem",   /* ≈ 512px */
          maxHeight: "80vh",   /* never taller than 80% of viewport */
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <Megaphone className="w-4 h-4 text-white" />
          </div>
          <p className="font-black text-slate-800 text-base">Announcement</p>
          <button
            onClick={dismiss}
            className="ml-auto w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden rounded-b-3xl relative min-h-[300px]">
          <iframe
            srcDoc={html}
            title="Announcement"
            className="absolute inset-0 w-full h-full border-0 bg-white"
          />
        </div>

      </div>
    </div>
  );
}
