"use client";

import Link from "next/link";
import {
  UserPlus, Fingerprint, Lock, ShieldCheck, UploadCloud,
  Building2, Smartphone, CreditCard, CheckCircle2, Copy, Check,
  Eye, EyeOff, Zap, ArrowRight, Package, BookOpen
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PackageData {
  id: string; title: string; price: number; description: string;
  courseCount: number; courseNames: string[];
}
interface PaymentAccount {
  id: string; label: string; accountTitle: string;
  accountNumber: string; type: string; logoUrl?: string;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" title="Copy account number"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-lg hover:bg-[var(--brand-100)] text-[var(--text-tertiary)] hover:text-[var(--brand-600)] transition-all flex items-center gap-1 text-xs font-bold"
    >
      {copied
        ? <><Check className="w-3.5 h-3.5 text-green-600" /><span className="text-green-600">Copied!</span></>
        : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
      }
    </button>
  );
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  BANK: <Building2 className="w-5 h-5" />,
  EASYPAISA: <Smartphone className="w-5 h-5" />,
  JAZZCASH: <Smartphone className="w-5 h-5" />,
  OTHER: <CreditCard className="w-5 h-5" />,
};
const TYPE_COLOR: Record<string, string> = {
  BANK: "from-blue-50 to-sky-50 border-blue-200",
  EASYPAISA: "from-green-50 to-emerald-50 border-green-200",
  JAZZCASH: "from-red-50 to-rose-50 border-red-200",
  OTHER: "from-slate-50 to-gray-50 border-slate-200",
};
const TYPE_ICON_BG: Record<string, string> = {
  BANK: "bg-blue-100 text-blue-600",
  EASYPAISA: "bg-green-100 text-green-600",
  JAZZCASH: "bg-red-100 text-red-600",
  OTHER: "bg-slate-100 text-slate-600",
};

export default function RegisterClient({
  packages,
  paymentAccounts,
}: {
  packages: PackageData[];
  paymentAccounts: PaymentAccount[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    searchParams.get("packageId") || packages?.[0]?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const selectedPackage = packages.find(p => p.id === selectedPackageId) || packages[0];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return setError("File too large. Max 5MB.");
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !referralCode) {
      setError("Please fill all fields."); return;
    }
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/validate-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid Referral Code.");
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (!proofImage) {
      setError("Please upload the payment screenshot.");
      setLoading(false); return;
    }
    if (!transactionId.trim()) {
      setError("Please enter the Transaction ID.");
      setLoading(false); return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, password, referralCode,
          bundleId: selectedPackageId, paymentMethod,
          transactionId: transactionId.trim(), proofImageUrl: proofImage,
          pricePaid: selectedPackage?.price || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 z-10">

      {/* ─── Progress Steps ─── */}
      <div className="flex items-center gap-0 mb-8 px-4">
        {[
          { n: 1, label: "Account Info" },
          { n: 2, label: "Package & Payment" },
        ].map(({ n, label }, idx) => (
          <div key={n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all ${step >= n ? "bg-[var(--brand-600)] text-white shadow-lg shadow-blue-200" : "bg-white border-2 border-[var(--border-strong)] text-[var(--text-tertiary)]"}`}>
                {step > n ? <CheckCircle2 className="w-5 h-5" /> : n}
              </div>
              <span className={`text-xs font-bold mt-1 whitespace-nowrap ${step >= n ? "text-[var(--brand-600)]" : "text-[var(--text-tertiary)]"}`}>{label}</span>
            </div>
            {idx < 1 && <div className={`flex-1 h-0.5 mx-2 rounded transition-colors ${step > n ? "bg-[var(--brand-500)]" : "bg-[var(--border-strong)]"}`} />}
          </div>
        ))}
      </div>

      <div className="elegant-card overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[var(--brand-600)] to-blue-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <UserPlus className="w-6 h-6" />
            <h2 className="text-2xl font-black">{step === 1 ? "Create Your Account" : "Choose Package & Pay"}</h2>
          </div>
          <p className="text-blue-100 text-sm font-medium">
            {step === 1 ? "Join the NexusLearn referral network today." : "Select a package and submit your payment proof."}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold flex items-center gap-2 rounded-r-xl">
              {error}
            </div>
          )}

          {/* ─── STEP 1: Account Info ─── */}
          {step === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Full Name *</label>
                  <input required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Muhammad Ali" className="elegant-input" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Email Address *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="elegant-input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Password *</label>
                <div className="input-icon-wrapper">
                  <Lock className="icon-left" />
                  <input required type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className="elegant-input has-icon-left pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[var(--brand-50)] to-blue-50 border-2 border-[var(--brand-200)] rounded-2xl p-5">
                <label className="block text-sm font-bold text-[var(--brand-700)] mb-1 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" />
                  Sponsor Referral Code
                  <span className="text-[10px] uppercase tracking-wider font-bold text-white px-2 py-0.5 rounded-full bg-[var(--brand-500)] ml-auto">Required</span>
                </label>
                <input required value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="REFERRAL CODE"
                  className="elegant-input text-center font-mono tracking-[0.25em] text-lg uppercase mt-2 bg-white border-[var(--brand-300)] focus:border-[var(--brand-500)]" />
                <p className="text-xs text-[var(--brand-600)] mt-2 font-medium text-center">Enter the unique code provided by your sponsor</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 h-12 text-base">
                {loading 
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying Code...</>
                  : <>Continue to Package Selection <ArrowRight className="w-4 h-4" /></>
                }
              </button>

              <p className="text-center text-[var(--text-secondary)] text-sm font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-[var(--brand-600)] font-bold hover:underline">Log in here</Link>
              </p>
            </form>
          )}

          {/* ─── STEP 2: Package & Payment ─── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Package Selection — Cards Grid */}
              <div>
                <h3 className="text-base font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--brand-500)]" /> Select Your Package
                </h3>
                <div className="grid gap-3">
                  {packages.map((pkg, idx) => {
                    const isSelected = pkg.id === selectedPackageId;
                    const isPopular = idx === Math.floor(packages.length / 2);
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                          isSelected
                            ? "border-[var(--brand-500)] bg-gradient-to-r from-[var(--brand-50)] to-blue-50 shadow-lg shadow-blue-100"
                            : "border-[var(--border-soft)] bg-white hover:border-[var(--brand-300)] hover:shadow-md"
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-2.5 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm">
                            🔥 POPULAR
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          {/* Selection indicator */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isSelected ? "border-[var(--brand-600)] bg-[var(--brand-600)]" : "border-slate-300"
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <h4 className={`font-black text-base ${isSelected ? "text-[var(--brand-700)]" : "text-[var(--text-primary)]"}`}>
                                {pkg.title}
                              </h4>
                              <span className={`text-lg font-black shrink-0 ${isSelected ? "text-[var(--brand-600)]" : "text-[var(--text-primary)]"}`}>
                                Rs. {pkg.price.toLocaleString()}
                              </span>
                            </div>

                            {pkg.description && (
                              <p className="text-xs text-[var(--text-secondary)] font-medium mb-3 leading-relaxed">
                                {pkg.description}
                              </p>
                            )}

                            {/* Included courses */}
                            {pkg.courseNames.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--brand-600)] bg-[var(--brand-50)] border border-[var(--brand-200)] px-2 py-0.5 rounded-full">
                                  <BookOpen className="w-3 h-3" /> {pkg.courseCount} {pkg.courseCount === 1 ? "Course" : "Courses"} Included
                                </span>
                                {pkg.courseNames.slice(0, 3).map((name, i) => (
                                  <span key={i} className="text-[10px] font-medium text-[var(--text-tertiary)] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                                    {name}
                                  </span>
                                ))}
                                {pkg.courseNames.length > 3 && (
                                  <span className="text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                                    +{pkg.courseNames.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Payment Accounts */}
              {paymentAccounts.length > 0 && (
                <div>
                  <h3 className="text-base font-black text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--brand-500)]" /> Send Payment To
                    <span className="ml-auto text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      Rs. {selectedPackage?.price?.toLocaleString()}
                    </span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {paymentAccounts.map(acc => (
                      <div key={acc.id}
                        className={`bg-gradient-to-br ${TYPE_COLOR[acc.type] || "from-slate-50 to-gray-50 border-slate-200"} border rounded-2xl p-4`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl overflow-hidden ${acc.logoUrl && acc.logoUrl.startsWith("http") ? "bg-white border border-[var(--border-strong)]" : TYPE_ICON_BG[acc.type] || "bg-slate-100 text-slate-600"}`}>
                            {acc.logoUrl && acc.logoUrl.startsWith("http")
                              ? <img src={acc.logoUrl} className="w-8 h-8 object-contain" alt={acc.label} />
                              : acc.logoUrl
                                ? <span>{acc.logoUrl}</span>
                                : TYPE_ICON[acc.type] || <CreditCard className="w-5 h-5" />
                            }
                          </div>
                          <div>
                            <div className="font-black text-[var(--text-primary)] text-sm">{acc.label}</div>
                            <div className="text-xs text-[var(--text-secondary)] font-medium">{acc.accountTitle}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2 border border-white">
                          <span className="font-mono text-sm text-[var(--text-primary)] font-bold tracking-wide truncate">{acc.accountNumber}</span>
                          <CopyBtn text={acc.accountNumber} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Proof */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Confirm Your Payment
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Transfer Method</label>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="elegant-input bg-white font-medium">
                      <option value="BANK">Bank Transfer</option>
                      <option value="EASYPAISA">Easypaisa</option>
                      <option value="JAZZCASH">JazzCash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Transaction ID *</label>
                    <input required value={transactionId} onChange={e => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="e.g. TID19284756" className="elegant-input font-mono text-sm uppercase" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Upload Payment Receipt *</label>
                  <label className="border-2 border-dashed border-[var(--brand-300)] bg-[var(--brand-50)] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--brand-100)] transition-colors group relative overflow-hidden h-32">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    {proofImage && <img src={proofImage} className="absolute inset-0 w-full h-full object-cover opacity-25" alt="Proof" />}
                    <UploadCloud className={`w-8 h-8 mb-2 relative z-10 ${proofImage ? "text-[var(--brand-600)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--brand-500)]"}`} />
                    <span className="text-sm font-bold text-[var(--brand-600)] relative z-10">
                      {proofImage ? "✓ Screenshot Ready — Click to change" : "Click to upload payment screenshot"}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] relative z-10 mt-0.5">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary sm:w-32">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 h-12 text-base">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                    : <><ShieldCheck className="w-5 h-5" />Complete Registration & Order</>
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
