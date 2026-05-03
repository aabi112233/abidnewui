"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen, Clock, Search, Filter, ChevronDown,
  Star, Share2, MoreVertical, PlayCircle, BookMarked, Bell
} from "lucide-react";

interface CourseWithProgress {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  duration?: string | null;
  totalLessons: number;
  completedCount: number;
  progressPercent: number;
  sections: { lessons: { id: string }[] }[];
}

type FilterTab = "all" | "in-progress" | "completed" | "starred";
type SortOption = "recent" | "title" | "progress";

// A set of pastel backgrounds for course thumbnails if no image is provided
const bgColors = [
  "bg-indigo-50", "bg-orange-50", "bg-emerald-50", "bg-blue-50", 
  "bg-teal-50", "bg-cyan-50", "bg-purple-50", "bg-rose-50"
];

export default function MyLearningClient({
  courses,
}: {
  courses: CourseWithProgress[];
}) {
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Filter + search + sort
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q));
    }

    // Filter tab
    if (filterTab === "in-progress") result = result.filter(c => c.progressPercent > 0 && c.progressPercent < 100);
    if (filterTab === "completed") result = result.filter(c => c.progressPercent === 100);
    if (filterTab === "starred") {
      // Dummy logic for starred if we don't have a real property
      result = result.filter((_, i) => i % 3 === 0);
    }

    // Sort
    switch (sortBy) {
      case "progress":
        result.sort((a, b) => b.progressPercent - a.progressPercent);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
      default:
        // Keep original order
        break;
    }

    return result;
  }, [courses, search, filterTab, sortBy]);

  const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All Courses" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "starred", label: "Starred" },
  ];

  if (courses.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto w-full px-4 md:px-8 py-8">
        <header className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Courses</h1>
          <p className="text-slate-500 mt-2 font-medium">Continue learning, explore new topics, and achieve your goals.</p>
        </header>
        <div className="bg-white rounded-3xl p-14 text-center border border-slate-200">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700">No Courses Found</h2>
          <p className="text-slate-500 mt-2 mb-6">You haven&apos;t enrolled in any courses yet.</p>
          <Link href="/dashboard/store" className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-colors">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-8 min-h-screen bg-[#F8FAFC]">
      {/* ── Header ── */}
      <header className="animate-fade-up flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Courses</h1>
          <p className="text-slate-500 mt-2 font-medium text-[15px]">
            Continue learning, explore new topics, and achieve your goals.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative w-64 mr-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-full h-[42px] pl-11 pr-4 focus:outline-none focus:border-blue-500 transition-shadow"
            />
          </div>
        </div>
      </header>

      {/* ── Filters & Sort ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
        
        {/* Filter tabs */}
        <div className="flex gap-2 bg-slate-100/50 p-1 rounded-xl overflow-x-auto w-full sm:w-auto">
          {FILTER_TABS.map(tab => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-500" />
            Filter
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl h-[42px] pl-4 pr-10 hover:bg-slate-50 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="recent">Sort: Recent</option>
              <option value="progress">Sort: Progress</option>
              <option value="title">Sort: Title</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Course Grid ── */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center border border-slate-200 shadow-sm">
          <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700">No courses match your filter</h2>
          <button onClick={() => { setSearch(""); setFilterTab("all"); }} className="mt-4 px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, i) => {
            const isCompleted = course.progressPercent === 100;
            const hasStarted = course.progressPercent > 0;
            const statusLabel = isCompleted ? "Completed" : hasStarted ? "In Progress" : "Not Started";
            
            const badgeColor = isCompleted 
              ? "text-emerald-700 bg-emerald-50" 
              : hasStarted 
                ? "text-blue-700 bg-blue-50" 
                : "text-slate-600 bg-slate-100";
                
            const bgColorClass = bgColors[i % bgColors.length];

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Thumbnail Area */}
                <div className={`h-48 relative p-4 flex flex-col justify-between ${bgColorClass}`}>
                  {/* Top Bar inside image */}
                  <div className="flex items-start justify-between relative z-10">
                    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${badgeColor}`}>
                      {statusLabel}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center text-slate-500 transition-colors">
                      {isCompleted ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        i % 2 === 0 ? <Share2 className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Image/Icon Center */}
                  <Link href={`/dashboard/learning/${course.id}`} className="absolute inset-0 flex items-center justify-center pt-8">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-3/4 h-3/4 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg" />
                    ) : (
                      <div className="w-24 h-24 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition-transform duration-500 shadow-sm">
                        <BookMarked className="w-10 h-10 text-slate-700/60" />
                      </div>
                    )}
                  </Link>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/dashboard/learning/${course.id}`} className="block mb-4">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                  </Link>

                  {/* Instructor Mockup */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.id}`} alt="Instructor" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[13px] text-slate-600 font-medium">Instructor Name</span>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-auto mb-4">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex-1 mr-4">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              isCompleted ? "bg-blue-600" : "bg-blue-600"
                            }`}
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[13px] font-bold text-blue-600 leading-none">
                        {course.progressPercent}% complete
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-slate-100 my-4" />

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="text-[13px] font-medium">{course.totalLessons} Lessons</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-[13px] font-medium">{course.duration}</span>
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bottom Banner ── */}
      <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 shadow-sm animate-fade-up">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Looking for more courses?</h3>
            <p className="text-slate-500 text-sm">Explore our catalog and find the perfect course to grow your skills.</p>
          </div>
        </div>
        <Link href="/dashboard/store" className="whitespace-nowrap px-6 py-3 border-2 border-blue-100 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-sm">
          Browse Catalog
        </Link>
      </div>

    </div>
  );
}

