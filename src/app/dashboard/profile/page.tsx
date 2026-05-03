"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Save, CheckCircle2, Eye, EyeOff, Settings, Copy, QrCode, CreditCard, Shield, Smartphone } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [userData, setUserData] = useState<any>(null);

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);

  const [profileMsg, setProfileMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetch("/api/user/me").then(r => r.json()).then(d => {
      setUserData(d);
      setName(d.name || "");
    });
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true); setProfileMsg("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Update failed");
      setProfileMsg("Profile updated successfully!");
      await update({ name });
    } catch { setProfileMsg("Failed to update profile."); }
    finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPassMsg("New passwords do not match."); return; }
    if (newPassword.length < 8) { setPassMsg("Password must be at least 8 characters."); return; }
    setPassLoading(true); setPassMsg("");
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPassMsg("Password changed successfully!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) { setPassMsg(err.message || "Failed to change password."); }
    finally { setPassLoading(false); }
  };

  const copyReferralCode = () => {
    if (userData?.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${userData.referralCode}`);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 sm:space-y-8 pb-10">
      <header className="animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-[var(--brand-50)] flex items-center justify-center">
            <Settings className="w-5 h-5 text-[var(--brand-600)]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">Profile & Settings</h1>
        </div>
        <p className="text-[var(--text-secondary)] font-medium ml-[52px] text-sm">Manage your personal information and account security.</p>
      </header>

      {/* Profile Header */}
      <div className="elegant-card overflow-hidden animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-600)] flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-3xl sm:text-4xl font-black text-white shrink-0">
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-white text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black">{name || "Your Name"}</h2>
            <p className="text-white/70 font-medium text-sm">{session?.user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold font-mono tracking-widest">{userData?.referralCode}</span>
              <span className="text-xs bg-amber-400/30 text-amber-200 px-2 py-0.5 rounded-full font-bold">Member</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-soft)]">
          {[
            { key: "profile", label: "Profile", icon: User },
            { key: "security", label: "Security", icon: Lock },
            { key: "referral", label: "Referral", icon: QrCode },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === key ? "border-[var(--brand-600)] text-[var(--brand-600)]" : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSave} className="p-5 sm:p-6 space-y-5">
            <h3 className="font-black text-[var(--text-primary)] flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Information
            </h3>
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="elegant-input" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Email Address</label>
              <input type="email" value={session?.user?.email || ""} disabled className="elegant-input opacity-60 cursor-not-allowed bg-slate-50" />
              <p className="text-xs text-[var(--text-tertiary)] mt-1 font-medium">Email cannot be changed for security reasons.</p>
            </div>

            {profileMsg && (
              <div className={`p-3 rounded-xl text-sm font-bold ${profileMsg.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {profileMsg.includes("success") && <CheckCircle2 className="inline w-4 h-4 mr-1" />} {profileMsg}
              </div>
            )}
            <button type="submit" disabled={profileLoading} className="btn-primary flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="p-5 sm:p-6 space-y-5">
            <h3 className="font-black text-[var(--text-primary)] flex items-center gap-2">
              <Shield className="w-4 h-4" /> Account Security
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="elegant-input" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">New Password</label>
                <div className="relative">
                  <input type={showNewPass ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="elegant-input pr-10" placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="elegant-input" placeholder="Repeat new password" />
              </div>

              {passMsg && (
                <div className={`p-3 rounded-xl text-sm font-bold ${passMsg.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {passMsg.includes("success") && <CheckCircle2 className="inline w-4 h-4 mr-1" />} {passMsg}
                </div>
              )}
              <button type="submit" disabled={passLoading} className="btn-secondary flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4" /> {passLoading ? "Updating..." : "Update Password"}
              </button>
            </form>

            {/* Security info */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl space-y-3">
              <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500" /> Login Information
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Last Login</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5">Today</p>
                </div>
                <div>
                  <p className="font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Account Status</p>
                  <p className="font-bold text-green-600 mt-0.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Referral Tab */}
        {activeTab === "referral" && (
          <div className="p-5 sm:p-6 space-y-5">
            <h3 className="font-black text-[var(--text-primary)] flex items-center gap-2">
              <QrCode className="w-4 h-4" /> Your Referral Code
            </h3>

            {userData?.referralCode ? (
              <>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center">
                  <code className="text-3xl sm:text-4xl font-black text-blue-600 tracking-[0.3em]">{userData.referralCode}</code>
                </div>

                <button onClick={copyReferralCode}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    copiedCode ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                  {copiedCode ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Invite Link</>}
                </button>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">Commission Rates</h4>
                  {["Level 1 — 30%", "Level 2 — 10%", "Level 3 — 7%", "Level 4 — 3%"].map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2 text-sm">
                      <span className="font-bold text-[var(--text-secondary)]">{r.split(" — ")[0]}</span>
                      <span className="font-black text-blue-600">{r.split(" — ")[1]}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-[var(--text-tertiary)] text-sm font-medium">Purchase a course to activate your referral code.</p>
              </div>
            )}

            {/* Saved payment method */}
            {userData?.savedPaymentMethod && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-slate-500" /> Saved Payment Account
                </h4>
                {(() => {
                  try {
                    const saved = JSON.parse(userData.savedPaymentMethod);
                    return (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><p className="font-bold text-[var(--text-tertiary)]">Method</p><p className="font-bold text-[var(--text-primary)]">{saved.paymentMethod}</p></div>
                        <div><p className="font-bold text-[var(--text-tertiary)]">Account</p><p className="font-mono font-bold text-[var(--text-primary)]">{saved.accountNumber}</p></div>
                        <div className="col-span-2"><p className="font-bold text-[var(--text-tertiary)]">Title</p><p className="font-bold text-[var(--text-primary)]">{saved.accountTitle}</p></div>
                      </div>
                    );
                  } catch { return <p className="text-xs text-[var(--text-tertiary)]">No saved account</p>; }
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
