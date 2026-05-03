"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, DollarSign, UserPlus, CreditCard, Zap } from "lucide-react";

type Notif = {
  id: string;
  type: "earning" | "referral" | "withdrawal" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

// ── Mock user simulated notifications ──
const MOCK_INITIAL_NOTIFS: Notif[] = [
  { id: "n1", type: "earning",    title: "Commission Received",      body: "You earned Rs. 1,250 from Level 1 commission", time: "2m ago",  read: false },
  { id: "n2", type: "referral",   title: "New Referral Joined! 🎉",  body: "Hamza Sheikh joined via your referral code",   time: "15m ago", read: false },
  { id: "n3", type: "earning",    title: "Commission Received",      body: "You earned Rs. 480 from Level 2 commission",  time: "1h ago",  read: false },
  { id: "n4", type: "referral",   title: "New Referral Joined! 🎉",  body: "Sara Malik joined via your referral code",     time: "3h ago",  read: true  },
  { id: "n5", type: "withdrawal", title: "Withdrawal Approved ✅",   body: "Rs. 12,000 paid to your Easypaisa wallet",    time: "1d ago",  read: true  },
  { id: "n6", type: "system",     title: "Badge Unlocked 🥇",        body: "You earned the Gold badge — 50 referrals!",   time: "2d ago",  read: true  },
  { id: "n7", type: "earning",    title: "Commission Received",      body: "You earned Rs. 700 from Level 3 commission",  time: "2d ago",  read: true  },
];

const MOCK_LIVE_NOTIFS: Omit<Notif, "id" | "time" | "read">[] = [
  { type: "earning",  title: "Commission Received",     body: "You earned Rs. 950 from Level 1 commission"  },
  { type: "referral", title: "New Referral Joined! 🎉", body: "Ali Raza joined via your referral code"       },
  { type: "earning",  title: "Commission Received",     body: "You earned Rs. 350 from Level 2 commission"  },
  { type: "referral", title: "New Referral Joined! 🎉", body: "Fatima Zahra joined via your referral code"  },
  { type: "earning",  title: "Commission Received",     body: "You earned Rs. 1,100 from Level 1 commission"},
];

const iconMap = {
  earning:    { Icon: DollarSign, bg: "bg-green-100",  color: "text-green-600"  },
  referral:   { Icon: UserPlus,   bg: "bg-blue-100",   color: "text-blue-600"   },
  withdrawal: { Icon: CreditCard, bg: "bg-amber-100",  color: "text-amber-600"  },
  system:     { Icon: Zap,        bg: "bg-purple-100", color: "text-purple-600" },
};

export default function NotificationBell({ isMockUser = false }: { isMockUser?: boolean }) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    if (isMockUser) {
      // Mock user: start with simulated notifications
      setNotifs(MOCK_INITIAL_NOTIFS);

      // Simulate incoming live notifications every 18s
      const interval = setInterval(() => {
        const template = MOCK_LIVE_NOTIFS[Math.floor(Math.random() * MOCK_LIVE_NOTIFS.length)];
        const newNotif: Notif = {
          ...template,
          id: `n_${Date.now()}`,
          time: "Just now",
          read: false,
        };
        setNotifs(prev => [newNotif, ...prev.slice(0, 14)]);
      }, 18000);
      return () => clearInterval(interval);
    } else {
      // Real user: fetch actual notifications from commissions + referrals
      fetchRealNotifications();

      // Refresh every 2 minutes
      const interval = setInterval(fetchRealNotifications, 120000);
      return () => clearInterval(interval);
    }
  }, [isMockUser]);

  async function fetchRealNotifications() {
    try {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifs(data);
      }
    } catch (e) {}
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-[var(--brand-50)] flex items-center justify-center transition-colors group"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--brand-600)] transition-colors" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 pulse-ring">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-up"
          style={{ animationDuration: "0.25s" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-[var(--brand-50)] to-white">
            <Bell className="w-4 h-4 text-[var(--brand-600)]" />
            <p className="font-black text-[var(--text-primary)] text-sm">Notifications</p>
            {unread > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{unread} new</span>
            )}
            {!isMockUser && (
              <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 ml-auto mr-1">
                Real-time
              </span>
            )}
            <button
              onClick={markAllRead}
              className={`flex items-center gap-1 text-[10px] font-bold text-[var(--brand-600)] hover:underline ${!isMockUser ? "" : "ml-auto"}`}
              title="Mark all as read"
            >
              <CheckCheck className="w-3 h-3" /> Mark all read
            </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-[var(--text-tertiary)]">
                <Bell className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm font-bold">No notifications yet</p>
                <p className="text-xs mt-1">Earnings and referral events will appear here</p>
              </div>
            ) : notifs.map((n) => {
              const { Icon, bg, color } = iconMap[n.type];
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors relative ${n.read ? "opacity-75" : ""}`}
                >
                  {!n.read && <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-[var(--brand-600)]" />}
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold text-[var(--text-primary)] ${!n.read ? "" : "font-semibold"}`}>{n.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] font-bold text-[var(--text-tertiary)] mt-1">{n.time}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    className="w-6 h-6 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 shrink-0"
                    aria-label="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] text-center text-[var(--text-tertiary)] font-medium">
              {isMockUser ? "🎭 Simulated activity feed" : "🔔 Real-time notifications enabled"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
