"use client";

import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Info, Star, Megaphone } from "lucide-react";

const priorityConfig: Record<string, { color: string; bg: string; icon: any }> = {
  URGENT: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertTriangle },
  HIGH: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Star },
  NORMAL: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Info },
  LOW: { color: "text-slate-600", bg: "bg-slate-50 border-slate-200", icon: Bell },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/announcements").then(r => r.json()).then(data => {
      setAnnouncements(data.announcements || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-4 pb-10">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-10">
      <header className="animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">Announcements</h1>
        </div>
        <p className="text-[var(--text-secondary)] font-medium ml-[52px] text-sm">Stay updated with the latest platform news.</p>
      </header>

      {announcements.length === 0 ? (
        <div className="elegant-card p-14 text-center border-dashed animate-fade-up">
          <Megaphone className="w-16 h-16 text-[var(--border-strong)] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-secondary)]">No Announcements</h2>
          <p className="text-[var(--text-tertiary)] mt-2 text-sm">Check back later for platform updates and news.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann: any, i: number) => {
            const config = priorityConfig[ann.priority] || priorityConfig.NORMAL;
            const Icon = config.icon;
            return (
              <div key={ann.id} className={`elegant-card p-5 sm:p-6 border-l-4 ${config.bg} animate-fade-up`}
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`font-black text-base ${config.color}`}>{ann.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color} uppercase`}>
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{ann.content}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] font-bold mt-2">
                      {new Date(ann.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
