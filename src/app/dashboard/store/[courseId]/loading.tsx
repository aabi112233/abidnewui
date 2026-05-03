export default function CourseDetailLoading() {
  return (
    <div className="w-full -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 lg:py-10">
          <div className="h-3 w-48 bg-slate-200 rounded mb-6" />
          <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
          <div className="h-8 w-3/4 bg-slate-200 rounded mb-4" />
          <div className="h-4 w-1/2 bg-slate-200 rounded mb-5" />
          <div className="flex gap-6">
            <div className="h-9 w-9 bg-slate-200 rounded-full" />
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-10 w-full bg-slate-100 rounded-lg" />
            <div className="h-64 w-full bg-slate-100 rounded-lg" />
          </div>
          <div className="w-full lg:w-[380px]">
            <div className="h-96 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
