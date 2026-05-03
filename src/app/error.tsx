"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center border border-red-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-50 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-sm border border-red-200">
            <AlertCircle className="w-10 h-10" />
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm font-medium text-slate-500 mb-8">
            {error.message || "An unexpected error occurred. Our technical team has been notified."}
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
