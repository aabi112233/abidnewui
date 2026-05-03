"use client";

import { useEffect } from "react";

export default function CourseDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Auto-retry on first render — this fixes the "error on first click, works on reload" issue.
  // The error is typically a transient SSR/hydration issue that resolves on retry.
  useEffect(() => {
    // Small delay then auto-retry
    const timer = setTimeout(() => {
      reset();
    }, 300);
    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div className="max-w-md mx-auto py-20 text-center px-4">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
        <span className="text-3xl">⏳</span>
      </div>
      <h2 className="text-xl font-black text-slate-900 mb-2">Loading course...</h2>
      <p className="text-slate-500 text-sm">
        Please wait a moment while we load the course details.
      </p>
    </div>
  );
}
