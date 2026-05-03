"use client";

import { useState } from "react";
import { PlayCircle, Zap, CheckCircle2, X, UploadCloud, Loader2, BookOpen, Clock, Award, Globe, Shield, Star, Users, Monitor, FileText } from "lucide-react";
import Link from "next/link";

interface PopularCourse {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  rating: number;
  instructorName?: string | null;
}

interface Props {
  courseId: string;
  courseTitle: string;
  price: number;
  originalPrice?: number;
  discount: number;
  isOwned: boolean;
  totalLessons: number;
  duration?: string;
  level: string;
  language: string;
  thumbnailUrl?: string;
  enrolledCount: number;
}

export default function CourseDetailClient({
  courseId, courseTitle, price, originalPrice, discount,
  isOwned, totalLessons, duration, level, language, thumbnailUrl,
  enrolledCount,
}: Props) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("File too large. Max 5MB.");
    const reader = new FileReader();
    reader.onloadend = () => setProofImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImage) return alert("Please upload a payment proof screenshot.");
    setLoading(true);
    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, itemType: "COURSE", paymentMethod, transactionId, pricePaid: price, proofImageUrl: proofImage }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
      setSuccess(true);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const levelLabel = level === "BEGINNER" ? "Beginner" : level === "INTERMEDIATE" ? "Intermediate" : "Advanced";

  return (
    <>
      {/* ── Main Sidebar Card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">

        {/* Thumbnail preview */}
        {thumbnailUrl && (
          <div className="relative h-48 overflow-hidden">
            <img src={thumbnailUrl} alt={courseTitle} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* CTA Section */}
        <div className="p-5 sm:p-6">
          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            {price === 0 ? (
              <span className="text-2xl font-black text-emerald-600">FREE</span>
            ) : (
              <span className="text-3xl font-black text-slate-900">
                Rs. {price.toLocaleString()}
              </span>
            )}
            {originalPrice && originalPrice > price && (
              <span className="text-base text-slate-400 line-through font-medium">
                Rs. {originalPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* CTA Button */}
          {isOwned ? (
            <a
              href={`/dashboard/learning/${courseId}`}
              className="w-full flex items-center justify-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white font-bold py-3.5 rounded-lg transition-all text-sm shadow-sm uppercase tracking-wide"
            >
              <PlayCircle className="w-5 h-5" /> START COURSE
            </a>
          ) : (
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full flex items-center justify-center gap-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white font-bold py-3.5 rounded-lg transition-all text-sm shadow-sm uppercase tracking-wide"
            >
              <Zap className="w-5 h-5" /> ENROLL NOW
            </button>
          )}

          {!isOwned && (
            <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
              30-day money-back guarantee
            </p>
          )}
        </div>

        {/* Course Details List (MasterStudy style) */}
        <div className="border-t border-slate-100 px-5 sm:px-6 py-6">
          <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
             <Monitor className="w-4 h-4 text-[var(--brand-600)]" /> Course details
          </h3>
          <div className="space-y-4">
            {[
              { icon: Clock, label: "Duration", value: duration || "Self-paced access" },
              { icon: BookOpen, label: "Lectures", value: `${totalLessons} Lessons` },
              { icon: Award, label: "Level", value: `${levelLabel} Level` },
              { icon: Globe, label: "Language", value: language },
              { icon: Shield, label: "Certificate", value: "Certificate of Completion" },
              { icon: Monitor, label: "Access", value: "Multi-device Access" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-500">{label}</span>
                </div>
                <span className="text-xs text-slate-800 font-extrabold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Attributes */}
        <div className="border-t border-slate-100 px-5 sm:px-6 py-6 bg-slate-50/50">
          <h3 className="text-sm font-black text-slate-800 mb-4">Specifications</h3>
          <div className="space-y-3">
            {[
              { label: "Course ID", value: courseId.slice(0, 8).toUpperCase() },
              { label: "Format", value: "Online Video" },
              { label: "Status", value: isOwned ? "Enrolled" : "Available" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold uppercase tracking-wider">{label}</span>
                <span className="text-slate-600 font-black">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Enrollment modal ── */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl animate-fade-up">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-lg font-black text-slate-900">Complete Purchase</h2>
              <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 pb-24 sm:pb-6">
              {success ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Request Submitted! 🎉</h3>
                  <p className="text-slate-500 text-sm">Admin will verify and unlock your course within 24 hours.</p>
                  <button onClick={() => { setShowCheckout(false); setSuccess(false); }} className="mt-6 btn-secondary">Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Order</h4>
                    <p className="font-black text-[var(--brand-600)]">{courseTitle}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Total: <span className="font-black text-slate-900">Rs. {price.toLocaleString()}</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Transfer Method</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="elegant-input bg-white">
                      <option value="BANK">Bank Transfer</option>
                      <option value="EASYPAISA">Easypaisa</option>
                      <option value="JAZZCASH">JazzCash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Transaction ID</label>
                    <input type="text" required value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. 1928475630" className="elegant-input font-mono uppercase" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Upload Receipt *</label>
                    <label className="border-2 border-dashed border-blue-200 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-blue-50 transition-colors h-28 relative overflow-hidden">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      {proofImage && <img src={proofImage} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />}
                      <UploadCloud className={`w-7 h-7 mb-1 relative z-10 ${proofImage ? "text-[var(--brand-600)]" : "text-slate-400"}`} />
                      <span className="text-sm font-bold text-[var(--brand-600)] relative z-10">
                        {proofImage ? "Screenshot Added ✓" : "Click to upload"}
                      </span>
                      <span className="text-xs text-slate-400 relative z-10">PNG, JPG up to 5MB</span>
                    </label>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 h-12">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                      : "Submit for Verification"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Sticky Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[var(--border-strong)] p-3 px-4 flex items-center justify-between lg:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)] animate-fade-up">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-xs font-bold text-[var(--text-secondary)] truncate">{courseTitle}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {price === 0 ? (
              <span className="text-sm font-black text-emerald-600">FREE</span>
            ) : (
              <span className="text-base font-black text-[var(--brand-600)]">Rs. {price.toLocaleString()}</span>
            )}
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-[var(--text-tertiary)] line-through">Rs. {originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
        
        {isOwned ? (
          <a
            href={`/dashboard/learning/${courseId}`}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md flex-shrink-0"
          >
            <PlayCircle className="w-4 h-4" /> Start Course
          </a>
        ) : (
          <button
            onClick={() => setShowCheckout(true)}
            className="flex items-center gap-1.5 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-100 flex-shrink-0"
          >
            <Zap className="w-4 h-4" /> Enroll Now
          </button>
        )}
      </div>
    </>
  );
}
