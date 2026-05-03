"use client";

import { useState, useEffect } from "react";
import { Network as NetworkIcon, Users, TrendingUp, Trophy, Search, Copy, CheckCircle2, Share2, ChevronDown, ChevronRight, Crown, Star, Zap } from "lucide-react";

interface Member {
  id: string; name: string; email: string | null;
  referralCode: string | null; createdAt: string;
  isMockUser: boolean;
  _count?: { referrals: number };
  referrals?: Member[];
}

function ShareButtons({ referralCode }: { referralCode: string | null }) {
  const [copied, setCopied] = useState(false);
  if (!referralCode) return null;

  const link = typeof window !== "undefined" ? `${window.location.origin}/register?ref=${referralCode}` : "";
  const msg = encodeURIComponent(`Join NexusLearn and start earning! Use my code: ${referralCode}\n${link}`);

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={copy} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${copied ? "bg-green-50 text-green-700" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
        {copied ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
      </button>
      <a href={`https://wa.me/?text=${msg}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-500 hover:bg-green-600 text-white transition-colors">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        WhatsApp
      </a>
      <a href={`sms:?body=${msg}`}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white transition-colors">
        <Share2 className="w-3.5 h-3.5" /> SMS
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-800 hover:bg-blue-900 text-white transition-colors">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
        Facebook
      </a>
    </div>
  );
}

function NetworkMember({ member, level, searchTerm }: { member: Member; level: number; searchTerm: string }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = member.referrals && member.referrals.length > 0;
  const childCount = member._count?.referrals || member.referrals?.length || 0;

  const nameMatch = !searchTerm || member.name?.toLowerCase().includes(searchTerm.toLowerCase()) || member.email?.toLowerCase().includes(searchTerm.toLowerCase());
  const levelColors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-teal-500"];

  return (
    <div className={`${!nameMatch && level > 0 ? "opacity-40" : ""}`}>
      <div className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group ${level === 0 ? 'bg-blue-50/50' : ''}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
        ) : (
          <div className="w-4 h-4 shrink-0" />
        )}

        <div className={`w-8 h-8 rounded-full ${levelColors[level] || 'bg-slate-400'} text-white flex items-center justify-center text-xs font-black shrink-0`}>
          {member.name?.charAt(0)?.toUpperCase() || "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-[var(--text-primary)] text-sm truncate">{member.name || "Unknown"}</p>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${levelColors[level] || 'bg-slate-400'} text-white`}>L{level + 1}</span>
            {member.isMockUser && <span className="text-[8px] font-black px-1 py-0.5 rounded bg-amber-100 text-amber-700">BOT</span>}
          </div>
          <p className="text-[10px] text-[var(--text-tertiary)] truncate">{member.email}</p>
        </div>

        <div className="text-right shrink-0 hidden sm:block">
          <p className="text-xs font-bold text-[var(--text-secondary)]">{childCount} referral{childCount !== 1 ? "s" : ""}</p>
          <p className="text-[10px] text-[var(--text-tertiary)]">{new Date(member.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}</p>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="border-l-2 border-slate-100" style={{ marginLeft: `${level * 20 + 28}px` }}>
          {member.referrals!.map(child => (
            <NetworkMember key={child.id} member={child} level={level + 1} searchTerm={searchTerm} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NetworkPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierBreakdown, setTierBreakdown] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/me").then(r => r.json()),
      fetch("/api/user/commissions").then(r => r.json()).catch(() => ({ tierBreakdown: [] })),
    ]).then(([userData, commData]) => {
      setData(userData);
      setTierBreakdown(commData.tierBreakdown || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-10">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    );
  }

  const referrals: Member[] = data?.referrals || [];
  const totalNetwork = countNetwork(referrals);

  function countNetwork(members: Member[]): number {
    return members.reduce((s, m) => s + 1 + countNetwork(m.referrals || []), 0);
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 sm:space-y-8 pb-10">
      <header className="animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
            <NetworkIcon className="w-5 h-5 text-purple-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">My Network</h1>
        </div>
        <p className="text-[var(--text-secondary)] font-medium ml-[52px] text-sm">Manage your referral team and share your link.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {[
          { label: "Direct Referrals", value: referrals.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Network", value: totalNetwork, icon: NetworkIcon, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Earned", value: `Rs. ${tierBreakdown.reduce((s: number, t: any) => s + t.totalAmount, 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active Tiers", value: tierBreakdown.filter((t: any) => t.count > 0).length + "/4", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="elegant-card p-4 sm:p-5 stat-card">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-xl sm:text-2xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Share Section */}
      <div className="elegant-card p-5 sm:p-7 animate-fade-up" style={{ animationDelay: '150ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[var(--brand-600)]" /> Share Your Link
            </h2>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Invite friends to earn commissions on 4 levels!</p>
          </div>
          {data?.referralCode && (
            <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl px-4 py-2 text-center">
              <code className="text-lg sm:text-xl font-black text-blue-600 tracking-[0.2em]">{data.referralCode}</code>
            </div>
          )}
        </div>
        <ShareButtons referralCode={data?.referralCode} />
      </div>

      {/* Tier Earnings */}
      {tierBreakdown.length > 0 && (
        <div className="elegant-card p-5 sm:p-7 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> Tier Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tierBreakdown.map((tier: any) => {
              const styles = [
                { bg: "bg-gradient-to-br from-blue-500 to-indigo-600", icon: Crown },
                { bg: "bg-gradient-to-br from-purple-500 to-violet-600", icon: Star },
                { bg: "bg-gradient-to-br from-pink-500 to-rose-600", icon: Users },
                { bg: "bg-gradient-to-br from-orange-500 to-amber-600", icon: TrendingUp },
              ][tier.level - 1] || { bg: "bg-slate-500", icon: Users };
              return (
                <div key={tier.level} className={`${styles.bg} rounded-2xl p-4 text-white text-center`}>
                  <styles.icon className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <p className="text-xl font-black">Rs. {tier.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] font-bold opacity-70 mt-1">Level {tier.level} • {tier.count} sales</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search + Network Tree */}
      <div className="elegant-card overflow-hidden animate-fade-up" style={{ animationDelay: '250ms' }}>
        <div className="p-5 border-b border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2 flex-1">
            <Users className="w-5 h-5 text-blue-600" /> Referral Tree
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text" placeholder="Search by name or email..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="elegant-input pl-9 text-xs py-2"
            />
          </div>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-12 px-4 text-[var(--text-tertiary)]">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-bold text-base mb-1">No Referrals Yet</p>
            <p className="text-xs">Share your invite link above to start building your network!</p>
          </div>
        ) : (
          <div className="p-2 divide-y divide-[var(--border-soft)]">
            {referrals.map(member => (
              <NetworkMember key={member.id} member={member} level={0} searchTerm={searchTerm} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
