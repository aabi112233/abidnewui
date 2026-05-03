"use client";

import { useState } from "react";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminActionButtons({ purchaseId, proofImageUrl }: { purchaseId: string, proofImageUrl?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this payment? This will instantly distribute commissions down 4 levels.")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      alert("Successfully Approved & Commissions Distributed! 🎉");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Reject this payment?")) return;
    alert("Payment rejected.");
  };

  return (
    <div className="flex gap-2 justify-end items-center">
      
      {proofImageUrl && proofImageUrl.startsWith("data:image") && (
        <button 
          onClick={() => setShowImage(!showImage)}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-xl transition-colors font-bold flex items-center gap-2 shadow-sm border border-blue-100 mr-2"
        >
          <Eye className="w-4 h-4"/> Proof
        </button>
      )}

      {showImage && proofImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowImage(false)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex justify-center">
             <img src={proofImageUrl} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" alt="Payment Proof" />
          </div>
        </div>
      )}

      <button 
        onClick={handleApprove}
        disabled={loading}
        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-xl transition-colors font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
      >
        <CheckCircle2 className="w-4 h-4"/> {loading ? "Approving..." : "Approve"}
      </button>
      <button 
        onClick={handleReject}
        disabled={loading}
        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl transition-colors font-bold flex items-center gap-2 shadow-sm border border-red-100 disabled:opacity-50"
      >
        <XCircle className="w-4 h-4"/> Reject
      </button>
    </div>
  );
}
