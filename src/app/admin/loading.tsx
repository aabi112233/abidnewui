import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 p-6 lg:p-10 space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-slate-200 rounded-xl"></div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>

      {/* Main Table/Content Skeleton */}
      <div className="bg-white rounded-2xl border border-[var(--border-soft)] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[var(--border-soft)] flex items-center justify-between">
           <div className="h-6 w-40 bg-slate-200 rounded-lg"></div>
           <div className="h-8 w-48 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-slate-200 rounded-md"></div>
                <div className="h-3 w-1/4 bg-slate-100 rounded-md"></div>
              </div>
              <div className="h-8 w-24 bg-slate-100 rounded-lg shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
