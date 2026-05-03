"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Settings as SettingsIcon, Bell, DollarSign, CheckCircle2, Radio } from "lucide-react";

export default function SettingsPage() {
  const [rates, setRates] = useState([30, 10, 7, 3]);
  const [activity, setActivity] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Min withdrawal
  const [minWithdrawal, setMinWithdrawal] = useState("1000");

  // Announcement
  const [announcementHtml, setAnnouncementHtml] = useState("");
  const [announcementActive, setAnnouncementActive] = useState(false);
  const [announcementPages, setAnnouncementPages] = useState<string[]>([]);

  useEffect(() => {
    async function loadSettings() {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.COMMISSION_RATES) setRates(data.COMMISSION_RATES);
        if (data.MOCK_ACTIVITY) setActivity(data.MOCK_ACTIVITY);
        if (data.MIN_WITHDRAWAL) setMinWithdrawal(String(data.MIN_WITHDRAWAL));
        if (data.ANNOUNCEMENT_HTML) setAnnouncementHtml(data.ANNOUNCEMENT_HTML);
        if (data.ANNOUNCEMENT_ACTIVE !== undefined) setAnnouncementActive(data.ANNOUNCEMENT_ACTIVE === true || data.ANNOUNCEMENT_ACTIVE === "true");
        if (data.ANNOUNCEMENT_PAGES && Array.isArray(data.ANNOUNCEMENT_PAGES)) setAnnouncementPages(data.ANNOUNCEMENT_PAGES);
      }
    }
    loadSettings();
  }, []);

  const showMsg = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const saveRates = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "COMMISSION_RATES", value: rates })
    });
    setSaving(false);
    showMsg("✅ Commission rates saved!");
  };

  const saveMinWithdrawal = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "MIN_WITHDRAWAL", value: minWithdrawal })
    });
    setSaving(false);
    showMsg("✅ Minimum withdrawal threshold saved!");
  };

  const saveActivity = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "MOCK_ACTIVITY", value: activity })
    });
    setSaving(false);
    showMsg("✅ Mock activity feed saved!");
  };

  const saveAnnouncement = async () => {
    setSaving(true);
    await Promise.all([
      fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ANNOUNCEMENT_HTML", value: announcementHtml })
      }),
      fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ANNOUNCEMENT_ACTIVE", value: String(announcementActive) })
      }),
      fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "ANNOUNCEMENT_PAGES", value: announcementPages })
      })
    ]);
    setSaving(false);
    showMsg("✅ Announcement saved!");
  };

  const PAGE_OPTIONS = [
    { label: "Home Page",       value: "/"                  },
    { label: "Dashboard",       value: "/dashboard"         },
    { label: "Courses / Store", value: "/dashboard/store"   },
    { label: "My Learning",     value: "/dashboard/learning"},
    { label: "Wallet",          value: "/dashboard/wallet"  },
    { label: "Network",         value: "/dashboard/network" },
    { label: "Profile",         value: "/dashboard/profile" },
    { label: "Login Page",      value: "/login"             },
    { label: "Register Page",   value: "/register"          },
  ];

  const togglePage = (val: string) => {
    setAnnouncementPages(prev =>
      prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]
    );
  };

  const handleRateChange = (index: number, val: string) => {
    const newRates = [...rates];
    newRates[index] = Number(val);
    setRates(newRates);
  };

  const addActivity = () => {
    setActivity([
      { user: "Name", action: "joined the network", detail: "via referral code", time: "1m ago", color: "text-blue-600", bg: "bg-blue-50" },
      ...activity
    ]);
  };

  const updateActivityRow = (index: number, field: string, val: string) => {
    const newAct = [...activity];
    newAct[index][field] = val;
    setActivity(newAct);
  };

  const deleteActivity = (index: number) => {
    setActivity(activity.filter((_, i) => i !== index));
  };

  const currentTotal = rates.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-5xl space-y-6 sm:space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-[var(--brand-600)]" /> Platform Settings
        </h1>
        {saveMsg && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 font-bold px-3 sm:px-4 py-2 rounded-xl text-sm animate-fade-up">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {saveMsg}
          </div>
        )}
      </div>

        {/* Commission settings */}
        <div className="elegant-card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[var(--brand-600)] shrink-0" /> Referral Commission Rates
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-5">Set the percentage commission for each referral level (L1–L4).</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
            {rates.map((r, i) => (
              <div key={i} className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--text-secondary)]">Level {i + 1} (%)</label>
                <input
                  type="number"
                  value={r}
                  min="0"
                  max="100"
                  onChange={(e) => handleRateChange(i, e.target.value)}
                  className="elegant-input"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-6">
            <p className={`font-bold text-sm ${currentTotal <= 100 ? 'text-green-600' : 'text-red-500'}`}>
              Total: {currentTotal}%
            </p>
            <button onClick={saveRates} disabled={saving} className="btn-primary w-full sm:w-auto">Save Commissions</button>
          </div>
        </div>

        {/* Min Withdrawal */}
        <div className="elegant-card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600 shrink-0" /> Minimum Withdrawal Threshold
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-5">Users must have at least this amount to submit a withdrawal request.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Minimum Amount (Rs.)</label>
              <input
                type="number"
                value={minWithdrawal}
                min="100"
                onChange={e => setMinWithdrawal(e.target.value)}
                className="elegant-input"
                placeholder="1000"
              />
            </div>
            <button onClick={saveMinWithdrawal} disabled={saving} className="btn-primary h-12 px-6 w-full sm:w-auto">Save Threshold</button>
          </div>
        </div>

        {/* Announcement Popup */}
        <div className="elegant-card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600 shrink-0" /> Announcement Popup
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-5">
            Paste any HTML code below. When active, it appears as a popup on selected pages.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">HTML Content</label>
              <textarea
                value={announcementHtml}
                onChange={e => setAnnouncementHtml(e.target.value)}
                rows={6}
                className="elegant-input font-mono text-sm resize-y"
                placeholder={`<div style="text-align:center; padding:20px;">\n  <h2>🎉 Special Offer!</h2>\n  <p>Get 20% off all courses this week!</p>\n</div>`}
              />
            </div>
            {/* Page Targeting */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-[var(--text-secondary)]">Show announcement on:</label>
                <button
                  type="button"
                  onClick={() => setAnnouncementPages(announcementPages.length === PAGE_OPTIONS.length ? [] : PAGE_OPTIONS.map(p => p.value))}
                  className="text-xs font-bold text-[var(--brand-600)] hover:underline"
                >
                  {announcementPages.length === PAGE_OPTIONS.length ? "Deselect All" : "Select All Pages"}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {PAGE_OPTIONS.map(opt => (
                  <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all text-sm font-semibold ${
                    announcementPages.includes(opt.value)
                      ? 'bg-[var(--brand-50)] border-[var(--brand-300)] text-[var(--brand-700)]'
                      : 'bg-white border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--brand-200)]'
                  }`}>
                    <input
                      type="checkbox"
                      checked={announcementPages.includes(opt.value)}
                      onChange={() => togglePage(opt.value)}
                      className="accent-[var(--brand-600)] w-3.5 h-3.5 shrink-0"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {announcementPages.length === 0 && (
                <p className="text-xs text-amber-600 font-medium mt-2">⚠️ No pages selected — announcement will show on ALL pages.</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setAnnouncementActive(!announcementActive)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer shrink-0 ${announcementActive ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${announcementActive ? 'right-1' : 'left-1'}`} />
                </div>
                <span className={`font-bold text-sm ${announcementActive ? 'text-green-700' : 'text-[var(--text-secondary)]'}`}>
                  {announcementActive ? '🟢 Announcement is LIVE' : '⭕ Announcement is OFF'}
                </span>
              </label>
              <button onClick={saveAnnouncement} disabled={saving} className="btn-primary w-full sm:w-auto">Save Announcement</button>
            </div>
            {announcementHtml && (
              <div className="mt-4">
                <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Preview:</p>
                <iframe
                  className="w-full border border-[var(--border-strong)] rounded-xl bg-white"
                  style={{ minHeight: "400px" }}
                  srcDoc={announcementHtml}
                  title="Announcement Preview"
                />
              </div>
            )}
          </div>
        </div>

        {/* Mock Activity settings */}
        <div className="elegant-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-600 shrink-0" /> Mock Activity Feed
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">These entries appear in the live network activity feed on dashboards.</p>
            </div>
            <button onClick={addActivity} className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center">
              <Plus className="w-4 h-4"/> Add Entry
            </button>
          </div>
          
          <div className="space-y-4">
            {activity.map((act, i) => (
              <div key={i} className="border p-3 sm:p-4 rounded-xl bg-slate-50">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 items-center">
                  <input type="text" value={act.user} onChange={(e) => updateActivityRow(i, "user", e.target.value)} className="p-2 border rounded text-xs bg-white col-span-1" placeholder="Name" />
                  <input type="text" value={act.time} onChange={(e) => updateActivityRow(i, "time", e.target.value)} className="p-2 border rounded text-xs bg-white col-span-1" placeholder="Time" />
                  <input type="text" value={act.action} onChange={(e) => updateActivityRow(i, "action", e.target.value)} className="p-2 border rounded text-xs bg-white col-span-2 sm:col-span-1 md:col-span-2" placeholder="Action" />
                  <input type="text" value={act.detail} onChange={(e) => updateActivityRow(i, "detail", e.target.value)} className="p-2 border rounded text-xs bg-white col-span-2 sm:col-span-2 md:col-span-2" placeholder="Detail" />
                  <select value={act.color} onChange={(e) => updateActivityRow(i, "color", e.target.value)} className="p-2 border rounded text-xs bg-white">
                    <option value="text-blue-600">Blue</option>
                    <option value="text-green-600">Green</option>
                    <option value="text-purple-600">Purple</option>
                    <option value="text-amber-600">Amber</option>
                    <option value="text-red-600">Red</option>
                  </select>
                  <select value={act.bg} onChange={(e) => updateActivityRow(i, "bg", e.target.value)} className="p-2 border rounded text-xs bg-white">
                    <option value="bg-blue-50">Bg Blue</option>
                    <option value="bg-green-50">Bg Green</option>
                    <option value="bg-purple-50">Bg Purple</option>
                    <option value="bg-amber-50">Bg Amber</option>
                    <option value="bg-red-50">Bg Red</option>
                  </select>
                  <button onClick={() => deleteActivity(i)} className="p-2 text-red-500 hover:bg-red-50 rounded justify-self-end sm:justify-self-auto">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="text-[var(--text-tertiary)] text-sm italic text-center py-4">No mock activity entries yet. Add some to populate the live feed.</p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={saveActivity} disabled={saving} className="btn-primary w-full sm:w-auto">Save Feed</button>
          </div>
        </div>
    </div>
  );
}
