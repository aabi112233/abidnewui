"use client";

import { useState } from "react";
import { CheckCircle2, X, Loader2 } from "lucide-react";

export default function AdminWithdrawalButtons({ withdrawalId }: { withdrawalId: string }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);

  const handle = async (action: "APPROVE" | "REJECT") => {
    const key = action === "APPROVE" ? "approve" : "reject";
    setLoading(key);
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: withdrawalId, action }),
      });
      if (res.ok) {
        setDone(action === "APPROVE" ? "approved" : "rejected");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Failed"));
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(null);
    }
  };

  if (done === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-black text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
      </span>
    );
  }
  if (done === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
        <X className="w-3.5 h-3.5" /> Rejected
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={() => handle("APPROVE")}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 text-xs font-black text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
      >
        {loading === "approve" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        Approve
      </button>
      <button
        onClick={() => handle("REJECT")}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
      >
        {loading === "reject" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
        Reject
      </button>
    </div>
  );
}
