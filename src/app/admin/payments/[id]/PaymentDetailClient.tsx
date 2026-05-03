"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, Package, CreditCard, Hash, Calendar,
  CheckCircle2, XCircle, Loader2, ImageIcon, Shield,
  Mail, Fingerprint, UserCheck, BookOpen, AlertTriangle
} from "lucide-react";

interface PaymentDetail {
  id: string;
  status: string;
  itemType: string;
  pricePaid: number;
  paymentMethod: string;
  transactionId: string;
  proofImageUrl?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    joinedAt: string;
    sponsor: { name: string; email: string; code: string } | null;
  };
  packageName: string;
  packagePrice: number;
  includedCourses: string[];
}

const statusConfig: Record<string, { label: string; cls: string; bg: string; icon: any }> = {
  PENDING: { label: "Pending Review", cls: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: AlertTriangle },
  APPROVED: { label: "Approved", cls: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", cls: "text-red-600", bg: "bg-red-50 border-red-200", icon: XCircle },
};

export default function PaymentDetailClient({ payment }: { payment: PaymentDetail }) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showProof, setShowProof] = useState(false);

  const st = statusConfig[payment.status] || statusConfig.PENDING;
  const StatusIcon = st.icon;
  const isPending = payment.status === "PENDING";
  const displayTid = payment.transactionId?.startsWith("REJECTED_")
    ? payment.transactionId.replace(/^REJECTED_/, "").replace(/_\d+$/, "")
    : payment.transactionId;

  const handleAction = async (action: "approve" | "reject") => {
    const confirmMsg = action === "approve"
      ? "Approve this payment? Commissions will be distributed to the referral chain."
      : "Reject this payment? The Transaction ID will be freed for resubmission.";
    if (!confirm(confirmMsg)) return;

    setActionLoading(action);
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId: payment.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      router.refresh();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/payments"
          className="w-10 h-10 rounded-xl bg-white border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-300)] transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">Payment Details</h1>
          <p className="text-xs text-[var(--text-tertiary)] font-medium font-mono mt-0.5">ID: {payment.id}</p>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`rounded-2xl border p-4 sm:p-5 flex items-center justify-between ${st.bg}`}>
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-6 h-6 ${st.cls}`} />
          <div>
            <p className={`text-base font-black ${st.cls}`}>{st.label}</p>
            <p className="text-xs text-[var(--text-tertiary)] font-medium">
              Submitted {new Date(payment.createdAt).toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })}
            </p>
          </div>
        </div>
        {isPending && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction("approve")}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
            >
              {actionLoading === "approve" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Approve
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
            >
              {actionLoading === "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column — User Info */}
        <div className="space-y-6">
          {/* User Card */}
          <div className="elegant-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border-soft)] flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--brand-600)]" />
              <h2 className="text-sm font-black text-[var(--text-primary)]">User Information</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-700)] text-white font-black text-xl flex items-center justify-center shadow-lg">
                  {payment.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-primary)]">{payment.user.name}</h3>
                  <p className="text-sm text-[var(--text-tertiary)] font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {payment.user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Referral Code</p>
                  <p className="text-sm font-black text-[var(--brand-600)] font-mono tracking-wider flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5" /> {payment.user.referralCode}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Joined</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(payment.user.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Sponsor */}
              {payment.user.sponsor && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Referred By (Sponsor)
                  </p>
                  <p className="text-sm font-black text-[var(--text-primary)]">{payment.user.sponsor.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)] font-medium">{payment.user.sponsor.email}</p>
                  <p className="text-xs font-bold text-blue-600 font-mono mt-1">Code: {payment.user.sponsor.code}</p>
                </div>
              )}
            </div>
          </div>

          {/* Package Card */}
          <div className="elegant-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border-soft)] flex items-center gap-2">
              <Package className="w-4 h-4 text-[var(--brand-600)]" />
              <h2 className="text-sm font-black text-[var(--text-primary)]">
                {payment.itemType === "BUNDLE" ? "Package" : "Course"} Details
              </h2>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-[var(--text-primary)]">{payment.packageName}</h3>
                <span className="text-lg font-black text-[var(--brand-600)]">
                  Rs. {payment.packagePrice.toLocaleString()}
                </span>
              </div>
              {payment.includedCourses.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Included Courses ({payment.includedCourses.length})
                  </p>
                  {payment.includedCourses.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium bg-slate-50 rounded-lg px-3 py-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Payment Info */}
        <div className="space-y-6">
          {/* Transaction Card */}
          <div className="elegant-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border-soft)] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[var(--brand-600)]" />
              <h2 className="text-sm font-black text-[var(--text-primary)]">Transaction Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Transaction ID</p>
                  <code className="text-base font-black text-[var(--brand-700)] bg-[var(--brand-50)] px-3 py-1.5 rounded-lg border border-[var(--brand-200)] block text-center font-mono tracking-wider">
                    {displayTid || "—"}
                  </code>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Amount Paid</p>
                  <p className="text-base font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 block text-center">
                    Rs. {payment.pricePaid.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-400" /> {payment.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm font-bold text-[var(--text-primary)] bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-slate-400" /> {payment.itemType}
                  </p>
                </div>
              </div>

              {/* Price comparison */}
              {payment.pricePaid !== payment.packagePrice && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700 font-medium">
                    <strong>Price mismatch:</strong> Package price is Rs. {payment.packagePrice.toLocaleString()} but user paid Rs. {payment.pricePaid.toLocaleString()}.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Proof */}
          <div className="elegant-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[var(--border-soft)] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[var(--brand-600)]" />
              <h2 className="text-sm font-black text-[var(--text-primary)]">Payment Screenshot</h2>
            </div>
            <div className="p-5">
              {payment.proofImageUrl ? (
                <div className="relative">
                  <img
                    src={payment.proofImageUrl}
                    alt="Payment Proof"
                    className="w-full rounded-xl border border-[var(--border-soft)] cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowProof(true)}
                  />
                  <button
                    onClick={() => setShowProof(true)}
                    className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-black/80 transition-colors"
                  >
                    🔍 View Full Size
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--text-tertiary)]">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No screenshot uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons (bottom sticky for mobile) */}
          {isPending && (
            <div className="elegant-card p-5 flex gap-3 lg:hidden">
              <button
                onClick={() => handleAction("approve")}
                disabled={!!actionLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {actionLoading === "approve" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve Payment
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={!!actionLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
              >
                {actionLoading === "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Reject Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-size Proof Modal */}
      {showProof && payment.proofImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setShowProof(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex justify-center">
            <img
              src={payment.proofImageUrl}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              alt="Payment Proof"
            />
            <button
              onClick={() => setShowProof(false)}
              className="absolute top-3 right-3 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
