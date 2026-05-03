"use client";

import { useState, useMemo } from "react";
import { Calculator, Users, TrendingUp, DollarSign, Sparkles, ArrowRight, Info } from "lucide-react";

const COMMISSION_RATES = [
  { level: 1, rate: 0.30, label: "Level 1", color: "from-blue-600 to-blue-500", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { level: 2, rate: 0.10, label: "Level 2", color: "from-violet-600 to-violet-500", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  { level: 3, rate: 0.07, label: "Level 3", color: "from-amber-600 to-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { level: 4, rate: 0.03, label: "Level 4", color: "from-emerald-600 to-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
];

export default function EarningsCalculatorPage() {
  const [avgCoursePrice, setAvgCoursePrice] = useState(18000);
  const [referrals, setReferrals] = useState([5, 3, 3, 3]);

  const updateReferral = (level: number, value: number) => {
    setReferrals((prev) => {
      const next = [...prev];
      next[level] = Math.max(0, Math.min(999, value));
      return next;
    });
  };

  const calculations = useMemo(() => {
    // Level 1: your direct referrals
    // Level 2: each of your level 1 referrals brings X people
    // Level 3: each level 2 person brings X people
    // Level 4: each level 3 person brings X people
    const totalPeoplePerLevel = [
      referrals[0],
      referrals[0] * referrals[1],
      referrals[0] * referrals[1] * referrals[2],
      referrals[0] * referrals[1] * referrals[2] * referrals[3],
    ];

    const earningsPerLevel = totalPeoplePerLevel.map(
      (people, i) => people * avgCoursePrice * COMMISSION_RATES[i].rate
    );

    const totalEarnings = earningsPerLevel.reduce((s, e) => s + e, 0);
    const totalPeople = totalPeoplePerLevel.reduce((s, p) => s + p, 0);

    return { totalPeoplePerLevel, earningsPerLevel, totalEarnings, totalPeople };
  }, [referrals, avgCoursePrice]);

  return (
    <div className="max-w-4xl mx-auto w-full pb-24 lg:pb-10">
      {/* Header */}
      <header className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Earnings Calculator
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] font-medium ml-[52px] text-sm">
          Estimate your potential income from referral commissions across all 4 levels.
        </p>
      </header>

      {/* Average Course Price */}
      <div className="elegant-card p-5 sm:p-6 mb-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          Average Course Price (Rs.)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1000}
            max={100000}
            step={500}
            value={avgCoursePrice}
            onChange={(e) => setAvgCoursePrice(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[var(--brand-600)]"
          />
          <div className="bg-[var(--brand-50)] border border-[var(--brand-200)] rounded-xl px-4 py-2 min-w-[130px] text-center">
            <span className="text-lg font-black text-[var(--brand-700)]">
              Rs. {avgCoursePrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Level Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {COMMISSION_RATES.map((tier, i) => (
          <div
            key={tier.level}
            className={`elegant-card p-5 sm:p-6 border-l-4 ${tier.border} animate-fade-up`}
            style={{ animationDelay: `${(i + 2) * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-sm font-black ${tier.text}`}>{tier.label}</h3>
                <p className="text-[10px] text-[var(--text-tertiary)] font-bold uppercase tracking-wider mt-0.5">
                  {i === 0
                    ? "Your direct referrals"
                    : `Referrals per Level ${i} person`}
                </p>
              </div>
              <div
                className={`text-lg font-black ${tier.text} ${tier.bg} w-14 h-14 rounded-2xl flex items-center justify-center`}
              >
                {(tier.rate * 100).toFixed(0)}%
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateReferral(i, referrals[i] - 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-lg flex items-center justify-center transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={0}
                max={999}
                value={referrals[i]}
                onChange={(e) => updateReferral(i, Number(e.target.value))}
                className="flex-1 text-center text-2xl font-black text-[var(--text-primary)] elegant-input h-12"
              />
              <button
                onClick={() => updateReferral(i, referrals[i] + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-lg flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>

            {/* Calculated stats */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Total People
                </p>
                <p className="text-base font-black text-[var(--text-primary)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {calculations.totalPeoplePerLevel[i].toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Earnings
                </p>
                <p className={`text-base font-black ${tier.text} flex items-center gap-1.5`}>
                  <DollarSign className="w-3.5 h-3.5" />
                  Rs. {calculations.earningsPerLevel[i].toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div
        className="rounded-2xl overflow-hidden shadow-xl animate-fade-up"
        style={{ animationDelay: "500ms" }}
      >
        <div className="bg-gradient-to-br from-[var(--brand-800)] via-[var(--brand-600)] to-[var(--accent-purple)] p-6 sm:p-8 text-white relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-lg font-black">Your Estimated Earnings</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {COMMISSION_RATES.map((tier, i) => (
                <div key={tier.level} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">
                    {tier.label}
                  </p>
                  <p className="text-lg sm:text-xl font-black">
                    Rs. {calculations.earningsPerLevel[i].toLocaleString()}
                  </p>
                  <p className="text-[10px] text-white/50 font-medium mt-1">
                    {calculations.totalPeoplePerLevel[i]} people × {(tier.rate * 100)}%
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-white/20">
              <div>
                <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">
                  Total Network Size
                </p>
                <p className="text-2xl font-black flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/60" />
                  {calculations.totalPeople.toLocaleString()} people
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">
                  Total Estimated Earnings
                </p>
                <p className="text-3xl sm:text-4xl font-black text-amber-300">
                  Rs. {calculations.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-white px-6 py-4 flex items-start gap-3 border-t border-slate-200">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            This calculator shows <strong>estimated</strong> earnings assuming each person purchases one course at the average price. 
            Actual earnings depend on course prices, number of purchases, and network activity. 
            Commission rates: Level 1 (30%), Level 2 (10%), Level 3 (7%), Level 4 (3%).
          </p>
        </div>
      </div>
    </div>
  );
}
