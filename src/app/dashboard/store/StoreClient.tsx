"use client";

import { useState, useMemo } from "react";
import {
  BookOpen, Sparkles, X, UploadCloud, Building2, Smartphone,
  CheckCircle2, Package, Tag, Zap, Copy, PlayCircle, Lock,
  Star, Users, Clock, Filter, ChevronDown, Search, Award,
  TrendingUp, SlidersHorizontal, Globe, BarChart2, Heart, Eye
} from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  thumbnailUrl?: string;
  level: string;
  duration?: string;
  language?: string;
  category?: string;
  rating: number;
  enrolledCount: number;
  instructorName?: string;
  instructorImage?: string;
  sections?: { lessons: { id: string }[] }[];
  createdAt: string;
  progressPercent?: number;
}

interface BundleCourse { course: { id: string; title: string }; }
interface Bundle { id: string; title: string; description: string; price: number; courses: BundleCourse[]; }
interface PaymentAccount { id: string; label: string; accountTitle: string; accountNumber: string; type: string; logoUrl?: string | null; }

type ActiveTab = "courses" | "bundles";
type SelectedItem = { type: "course" | "bundle"; id: string; title: string; price: number; };
type SortOption = "newest" | "popular" | "rating" | "price_asc" | "price_desc";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

function LevelBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    BEGINNER: "bg-emerald-100 text-emerald-700",
    INTERMEDIATE: "bg-amber-100 text-amber-700",
    ADVANCED: "bg-red-100 text-red-700",
  };
  const label = level === "BEGINNER" ? "Beginner" : level === "INTERMEDIATE" ? "Intermediate" : "Advanced";
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${map[level] || "bg-slate-100 text-slate-600"}`}>
      {label}
    </span>
  );
}

const THUMB_COLORS = ["learnova-thumb-blue", "learnova-thumb-purple", "learnova-thumb-green", "learnova-thumb-orange", "learnova-thumb-pink", "learnova-thumb-teal"];
const COURSE_ICONS = [
  <div key="1" className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><span className="text-2xl">💻</span></div>,
  <div key="2" className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center"><span className="text-2xl">🎨</span></div>,
  <div key="3" className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center"><span className="text-2xl">📊</span></div>,
  <div key="4" className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center"><span className="text-2xl">📱</span></div>,
  <div key="5" className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center"><span className="text-2xl">🔒</span></div>,
  <div key="6" className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center"><span className="text-2xl">📢</span></div>,
];

function CourseCard({
  course,
  owned,
  onBuy,
  progressPercent,
}: {
  course: Course;
  owned: boolean;
  onBuy: () => void;
  progressPercent: number;
}) {
  const totalLessons = course.sections?.reduce((s, sec) => s + sec.lessons.length, 0) ?? 0;
  
  // Extract number from id to use as index for mock colors/icons
  const idNum = course.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const isCompleted = owned && progressPercent >= 100;

  return (
    <div className="learnova-course-card cursor-pointer" onClick={() => { if(!owned) onBuy(); else window.location.href = `/dashboard/store/${course.id}`; }}>
      {/* Thumbnail */}
      {course.thumbnailUrl ? (
        <div className="relative h-48 overflow-hidden rounded-t-[20px] flex-shrink-0">
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className={`learnova-card-thumb ${THUMB_COLORS[idNum % THUMB_COLORS.length]}`}>
          <div className="flex items-center gap-1">
            {COURSE_ICONS[idNum % COURSE_ICONS.length]}
          </div>
          {owned && (
            <div className={`learnova-card-badge ${isCompleted ? 'learnova-badge-completed' : 'learnova-badge-progress'}`}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </div>
          )}
          {!owned && (
            <div className="learnova-card-badge learnova-badge-progress bg-white text-[var(--brand-600)] shadow-sm">
              Rs. {course.price.toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="learnova-card-body relative z-10 bg-white">
        {course.category && (
          <p className="text-[11px] font-bold text-[var(--brand-600)] uppercase tracking-wider mb-1.5">
            {course.category}
          </p>
        )}
        <h3 className="learnova-card-title">{course.title}</h3>
        
        {course.instructorName && (
          <div className="learnova-card-instructor">
            <img src={course.instructorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName.toLowerCase().replace(' ', '')}`} alt={course.instructorName} />
            <span>{course.instructorName}</span>
          </div>
        )}

        {/* Progress or Price Action */}
        <div className="mt-4">
          {owned ? (
            <div className="learnova-card-progress">
              <div className="learnova-progress-bar">
                <div
                  className={`learnova-progress-fill ${isCompleted ? 'completed' : ''}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={`learnova-progress-text ${isCompleted ? 'completed' : ''}`}>
                {progressPercent}% complete
              </span>
            </div>
          ) : (
             <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-slate-700">{course.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 ml-1">({course.enrolledCount})</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onBuy(); }} className="text-sm font-bold text-white bg-[var(--brand-600)] px-4 py-1.5 rounded-full hover:bg-[var(--brand-700)] transition-colors shadow-md shadow-blue-100">
                Enroll Now
              </button>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="learnova-card-meta mt-4 pt-4 border-t border-slate-100">
          <span><BookOpen className="w-3.5 h-3.5" /> {totalLessons > 0 ? totalLessons : "10"} Lessons</span>
          <span><Clock className="w-3.5 h-3.5" /> {course.duration || "Self-paced"}</span>
        </div>
      </div>
    </div>
  );
}

export default function StoreClient({
  courses,
  bundles,
  paymentAccounts = [],
  purchasedCourseIds = [],
  purchasedBundleIds = [],
  courseProgressMap = {},
}: {
  courses: Course[];
  bundles: Bundle[];
  paymentAccounts?: PaymentAccount[];
  purchasedCourseIds?: string[];
  purchasedBundleIds?: string[];
  courseProgressMap?: Record<string, number>;
}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("courses");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [transactionId, setTransactionId] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const isCourseOwned = (id: string) => purchasedCourseIds.includes(id);
  const isBundleOwned = (id: string) => purchasedBundleIds.includes(id);

  const categories = useMemo(() => {
    const cats = new Set(courses.map((c) => c.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructorName?.toLowerCase().includes(q)
      );
    }

    // Category
    if (filterCategory !== "all") {
      result = result.filter((c) => c.category === filterCategory);
    }

    // Price
    if (filterPrice === "free") result = result.filter((c) => c.price === 0);
    if (filterPrice === "paid") result = result.filter((c) => c.price > 0);

    // Level
    if (filterLevel !== "all") result = result.filter((c) => c.level === filterLevel);

    // Rating
    if (filterRating !== "all") {
      const minRating = parseFloat(filterRating);
      result = result.filter((c) => c.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.enrolledCount - a.enrolledCount);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [courses, search, filterCategory, filterPrice, filterLevel, filterRating, sortBy]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("File too large. Max 5MB.");
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofImage) return alert("Please upload a payment proof screenshot.");
    if (!selectedItem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedItem.type === "course" ? selectedItem.id : undefined,
          bundleId: selectedItem.type === "bundle" ? selectedItem.id : undefined,
          itemType: selectedItem.type.toUpperCase(),
          paymentMethod,
          transactionId,
          pricePaid: selectedItem.price,
          proofImageUrl: proofImage,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedItem(null);
        setProofImage(null);
        setTransactionId("");
      }, 3000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const activeFiltersCount = [
    filterCategory !== "all",
    filterPrice !== "all",
    filterLevel !== "all",
    filterRating !== "all",
  ].filter(Boolean).length;

  return (
    <div>
      {/* ── Tab Pills ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex gap-2 bg-white border border-[var(--border-strong)] rounded-xl p-1.5 sm:p-2 w-full sm:w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-[13px] sm:text-sm transition-all ${
              activeTab === "courses"
                ? "bg-[var(--brand-600)] text-white shadow-md font-black"
                : "text-[var(--text-secondary)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Courses
            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === "courses" ? "bg-white/20" : "bg-[var(--brand-100)] text-[var(--brand-700)]"}`}>
              {courses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("bundles")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-[13px] sm:text-sm transition-all ${
              activeTab === "bundles"
                ? "bg-purple-600 text-white shadow-md font-black"
                : "text-[var(--text-secondary)] hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Bundles
            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === "bundles" ? "bg-white/20" : "bg-purple-100 text-purple-700"}`}>
              {bundles.length}
            </span>
          </button>
        </div>

        {/* Stats row - simplified on mobile */}
        {activeTab === "courses" && (
          <div className="flex items-center justify-center sm:justify-end gap-5 text-[11px] sm:text-sm text-[var(--text-tertiary)] font-bold sm:font-medium sm:ml-auto border-t border-slate-50 sm:border-0 pt-3 sm:pt-0">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[var(--brand-500)]" />
              {courses.reduce((s, c) => s + c.enrolledCount, 0).toLocaleString()} <span className="hidden xs:inline">students</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {courses.length > 0 ? (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1) : "—"} <span className="hidden xs:inline">avg rating</span>
            </span>
          </div>
        )}
      </div>

      {/* ── Search + Filter bar (Courses tab only) ── */}
      {activeTab === "courses" && (
        <div className="mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search courses, instructors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="elegant-input has-icon-left text-sm h-12"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>

            <div className="flex gap-2">
              {/* Sort */}
              <div className="relative flex-1 md:flex-none">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="elegant-input text-xs sm:text-sm font-semibold appearance-none cursor-pointer h-12 w-full"
                  style={{ paddingLeft: "2.25rem", paddingRight: "2rem", minWidth: "140px" }}
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low</option>
                  <option value="price_desc">Price: High</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 font-bold text-xs sm:text-sm px-4 h-12 rounded-xl border transition-all flex-1 md:flex-none ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)] shadow-md shadow-blue-200"
                    : "bg-white text-[var(--text-secondary)] border-[var(--border-strong)] hover:border-[var(--brand-400)]"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden xs:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white/20 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="bg-white border border-[var(--border-strong)] rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-sm animate-fade-up">
              {/* Category */}
              <div>
                <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="elegant-input text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">Price</label>
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="elegant-input text-sm"
                >
                  <option value="all">Free & Paid</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">Level</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="elegant-input text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-2">Min Rating</label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="elegant-input text-sm"
                >
                  <option value="all">Any Rating</option>
                  <option value="4.5">4.5+ ★</option>
                  <option value="4">4.0+ ★</option>
                  <option value="3">3.0+ ★</option>
                </select>
              </div>

              {/* Reset */}
              {activeFiltersCount > 0 && (
                <div className="col-span-2 md:col-span-4 flex justify-end">
                  <button
                    onClick={() => {
                      setFilterCategory("all");
                      setFilterPrice("all");
                      setFilterLevel("all");
                      setFilterRating("all");
                    }}
                    className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count */}
          {(search || activeFiltersCount > 0) && (
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found
              {search && <> for &quot;<span className="font-bold text-[var(--text-primary)]">{search}</span>&quot;</>}
            </p>
          )}
        </div>
      )}

      {/* ── COURSES GRID ── */}
      {activeTab === "courses" && (
        <>
          {filteredCourses.length === 0 ? (
            <div className="elegant-card p-14 text-center border-dashed">
              <BookOpen className="w-16 h-16 text-[var(--border-strong)] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[var(--text-secondary)]">No Courses Found</h2>
              <p className="text-[var(--text-tertiary)] mt-2">Try adjusting your search or filters.</p>
              {(search || activeFiltersCount > 0) && (
                <button
                  onClick={() => { setSearch(""); setFilterCategory("all"); setFilterPrice("all"); setFilterLevel("all"); setFilterRating("all"); }}
                  className="mt-4 btn-primary inline-flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredCourses.map((course, i) => (
                <div key={course.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <CourseCard
                    course={course}
                    owned={isCourseOwned(course.id)}
                    onBuy={() => setSelectedItem({ type: "course", id: course.id, title: course.title, price: course.price })}
                    progressPercent={courseProgressMap[course.id] ?? 0}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── BUNDLES GRID ── */}
      {activeTab === "bundles" && (
        <>
          {bundles.length === 0 ? (
            <div className="elegant-card p-12 text-center border-dashed">
              <Package className="w-16 h-16 text-[var(--border-strong)] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[var(--text-secondary)]">No Bundle Packages Yet</h2>
              <p className="text-[var(--text-tertiary)] mt-2">Check back later or contact the admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bundles.map((bundle, i) => {
                const owned = isBundleOwned(bundle.id);
                return (
                  <div key={bundle.id} className="bg-white rounded-xl border-2 border-transparent hover:border-purple-300 overflow-hidden group flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="h-36 bg-gradient-to-tr from-purple-600 via-violet-600 to-pink-500 relative flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                      <Package className="w-16 h-16 text-white/40 group-hover:scale-110 transition-transform duration-300" />
                      <span className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Bundle
                      </span>
                      {owned && (
                        <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" /> PURCHASED
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-black text-[var(--text-primary)] mb-1 group-hover:text-purple-600 transition-colors">{bundle.title}</h3>
                      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">{bundle.description}</p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {bundle.courses.map(({ course }) => (
                          <span key={course.id} className="inline-flex items-center gap-1 text-xs bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-lg font-bold">
                            <BookOpen className="w-3 h-3" />{course.title}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <div className="text-2xl font-black text-purple-600">Rs. {bundle.price.toLocaleString()}</div>
                          <div className="text-xs text-[var(--text-tertiary)] font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" /> {bundle.courses.length} courses included
                          </div>
                        </div>
                        {owned ? (
                          <Link href="/dashboard/learning" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-green-100">
                            <PlayCircle className="w-4 h-4" /> View Courses
                          </Link>
                        ) : (
                          <button
                            onClick={() => setSelectedItem({ type: "bundle", id: bundle.id, title: bundle.title, price: bundle.price })}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-purple-100"
                          >
                            Buy Bundle
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── CHECKOUT MODAL ─── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-fade-up rounded-t-3xl sm:rounded-3xl shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[var(--border-strong)] px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                {selectedItem.type === "bundle"
                  ? <Package className="w-5 h-5 text-purple-600" />
                  : <BookOpen className="w-5 h-5 text-[var(--brand-600)]" />}
                <h2 className="text-lg font-black text-[var(--text-primary)]">Checkout Verification</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-full text-[var(--text-tertiary)] hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 pb-24 sm:pb-6">
              {success ? (
                <div className="text-center py-10 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-50">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mb-2">Request Submitted! 🎉</h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)]">The admin will review your payment and unlock your content shortly.</p>
                </div>
              ) : (
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                  {/* Order Summary + Payment */}
                  <div className="space-y-5">
                    <div className={`p-4 rounded-2xl border ${selectedItem.type === "bundle" ? "bg-purple-50 border-purple-100" : "bg-[var(--brand-50)] border-[var(--brand-100)]"}`}>
                      <h4 className="font-bold text-[var(--text-primary)] text-xs mb-2 uppercase tracking-wider">Order Summary</h4>
                      <div className={`text-lg font-black mb-1 ${selectedItem.type === "bundle" ? "text-purple-700" : "text-[var(--brand-600)]"}`}>{selectedItem.title}</div>
                      <div className="flex items-center gap-2">
                        {selectedItem.type === "bundle" && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Bundle</span>}
                        <div className="text-[var(--text-secondary)] font-medium text-sm">Total: <span className="text-[var(--text-primary)] font-black">Rs. {selectedItem.price.toLocaleString()}</span></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-[var(--text-primary)] text-xs mb-3 uppercase tracking-wider">Send Payment To</h4>
                      {paymentAccounts.length > 0 ? (
                        <div className="space-y-2">
                          {paymentAccounts.map(acc => (
                            <div key={acc.id} className="border border-[var(--border-strong)] p-3 rounded-xl flex gap-3 text-sm hover:border-[var(--brand-300)] transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-[var(--brand-50)] flex items-center justify-center overflow-hidden shrink-0 text-lg">
                                {acc.logoUrl && acc.logoUrl.startsWith("http")
                                  ? <img src={acc.logoUrl} className="w-6 h-6 object-contain" alt={acc.label} />
                                  : acc.logoUrl ? acc.logoUrl
                                  : acc.type === "BANK" ? <Building2 className="w-4 h-4 text-blue-500" />
                                  : <Smartphone className="w-4 h-4 text-green-500" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-[var(--text-primary)]">{acc.label}</div>
                                <div className="text-[var(--text-tertiary)] text-xs">{acc.accountTitle}</div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="font-mono text-[var(--text-secondary)] text-xs">{acc.accountNumber}</span>
                                  <button type="button" onClick={() => navigator.clipboard.writeText(acc.accountNumber)} className="text-[var(--brand-500)] hover:text-[var(--brand-700)] transition-colors">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--text-tertiary)] text-sm italic">Contact admin for payment details.</p>
                      )}
                    </div>
                  </div>

                  {/* Upload Form */}
                  <form onSubmit={handlePurchaseSubmit} className="space-y-4 border-l border-[var(--border-soft)] md:pl-8">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Transfer Method</label>
                      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="elegant-input bg-white font-medium">
                        <option value="BANK">Bank Transfer</option>
                        <option value="EASYPAISA">Easypaisa</option>
                        <option value="JAZZCASH">JazzCash</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Transaction ID (TID)</label>
                      <input type="text" required value={transactionId} onChange={e => setTransactionId(e.target.value)}
                        placeholder="e.g. 1928475630" className="elegant-input font-mono text-sm uppercase" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Upload Receipt *</label>
                      <label className="border-2 border-dashed border-[var(--brand-300)] bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[var(--brand-50)] transition-colors group relative overflow-hidden h-28">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        {proofImage && <img src={proofImage} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Proof" />}
                        <UploadCloud className={`w-7 h-7 mb-1 relative z-10 ${proofImage ? "text-[var(--brand-600)]" : "text-[var(--text-tertiary)]"}`} />
                        <span className="text-sm font-bold text-[var(--brand-600)] relative z-10">
                          {proofImage ? "Screenshot Added ✓" : "Click to upload screenshot"}
                        </span>
                        <span className="text-xs text-[var(--text-tertiary)] relative z-10">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 h-12">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                        : "Submit for Verification"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
