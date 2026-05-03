export default function LearningPlayerLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 animate-pulse">
        {/* Video skeleton */}
        <div className="aspect-video w-full bg-slate-200 rounded-2xl" />
        
        {/* Title skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-200 rounded-lg" />
        </div>

        {/* Content list skeleton */}
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="h-10 w-10 bg-slate-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-3 w-1/4 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="w-5 h-5 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-400">Loading your course content...</p>
      </div>
    </div>
  );
}
