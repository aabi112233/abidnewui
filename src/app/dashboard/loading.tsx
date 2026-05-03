import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 bg-slate-200 rounded-xl"></div>
        <div className="h-4 w-72 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[var(--border-soft)] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-100 mb-4"></div>
            <div className="h-7 w-20 bg-slate-200 rounded-lg mb-2"></div>
            <div className="h-3 w-32 bg-slate-100 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Main Content Areas Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-[var(--border-soft)] shadow-sm h-80">
            <div className="h-6 w-40 bg-slate-200 rounded-xl mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-slate-100 rounded-xl"></div>
              <div className="h-20 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-[var(--border-soft)] shadow-sm h-80">
            <div className="h-6 w-32 bg-slate-200 rounded-xl mb-6"></div>
            <div className="flex items-center justify-center h-full pb-10">
              <Loader2 className="w-10 h-10 text-[var(--brand-300)] animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
