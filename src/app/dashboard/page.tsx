"use client";

import { useSession } from "next-auth/react";
import {
  Wallet, TrendingUp, Users, Copy, CheckCircle2, Trophy, Zap,
  Star, ArrowUpRight, Activity, Crown, Sun, Calendar, BarChart2,
  Medal, Award, ChevronUp, Flame, Target, BookOpen, Clock,
  Filter, ChevronDown, MoreVertical, Search
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ──────────────────────────────────────────
// Count-Up Hook
// ──────────────────────────────────────────
function useCountUp(target: number, duration = 1600, enabled = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, enabled]);

  return enabled ? value : target;
}

function AnimatedStat({ value, enabled }: { value: number; enabled: boolean }) {
  const count = useCountUp(value, 1400, enabled);
  return <>{count.toLocaleString()}</>;
}

// ──────────────────────────────────────────
// Course data for My Courses view
// ──────────────────────────────────────────
const THUMB_COLORS = ["learnova-thumb-blue", "learnova-thumb-purple", "learnova-thumb-green", "learnova-thumb-orange", "learnova-thumb-pink", "learnova-thumb-teal"];
const COURSE_ICONS = [
  <><div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><span className="text-2xl">💻</span></div><div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center -ml-3"><span className="text-xl">⚙️</span></div></>,
  <><div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center"><span className="text-2xl">🎨</span></div></>,
  <><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center"><span className="text-2xl">📊</span></div><div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center -ml-2"><span className="text-xl">📱</span></div></>,
  <><div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center"><span className="text-2xl">📱</span></div></>,
  <><div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center"><span className="text-2xl">🔒</span></div></>,
  <><div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center"><span className="text-2xl">📢</span></div></>,
  <><div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center"><span className="text-2xl">📷</span></div></>,
  <><div className="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center"><span className="text-2xl">🤖</span></div></>,
];

const MY_COURSES = [
  { id: 1, title: "Web Development Bootcamp",        instructor: "Jane Cooper",        progress: 65, lessons: 24, duration: "8h 45m", status: "In Progress", starred: false, thumb: 0, icon: 0 },
  { id: 2, title: "UI/UX Design Fundamentals",        instructor: "Ronald Richards",    progress: 60, lessons: 18, duration: "6h 30m", status: "In Progress", starred: false, thumb: 1, icon: 1 },
  { id: 3, title: "Data Analytics Essentials",         instructor: "Dianne Russell",     progress: 100, lessons: 22, duration: "10h 15m", status: "Completed",   starred: true,  thumb: 2, icon: 2 },
  { id: 4, title: "Mobile App Development with Flutter", instructor: "Esther Howard",   progress: 30, lessons: 20, duration: "7h 20m", status: "In Progress", starred: false, thumb: 0, icon: 3 },
  { id: 5, title: "Cybersecurity Fundamentals",        instructor: "Cody Fisher",        progress: 0,  lessons: 16, duration: "5h 40m", status: "Not Started", starred: false, thumb: 4, icon: 4 },
  { id: 6, title: "Digital Marketing Strategy",        instructor: "Jenny Wilson",        progress: 45, lessons: 19, duration: "6h 50m", status: "In Progress", starred: false, thumb: 1, icon: 5 },
  { id: 7, title: "Photography Masterclass",           instructor: "Brooklyn Simmons",   progress: 0,  lessons: 15, duration: "4h 10m", status: "Not Started", starred: false, thumb: 3, icon: 6 },
  { id: 8, title: "Machine Learning Foundations",      instructor: "Guy Hawkins",         progress: 100, lessons: 28, duration: "12h 30m", status: "Completed",   starred: true,  thumb: 5, icon: 7 },
];

const TABS = ["All Courses", "In Progress", "Completed", "Starred"];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("All Courses");
  const [courses, setCourses] = useState(MY_COURSES);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  const filtered = courses.filter(c => {
    if (activeTab === "All Courses") return true;
    if (activeTab === "In Progress") return c.status === "In Progress";
    if (activeTab === "Completed") return c.status === "Completed";
    if (activeTab === "Starred") return c.starred;
    return true;
  });

  const toggleStar = (id: number) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">

      {/* ── Page Header ── */}
      <div className="learnova-page-header animate-fade-up">
        <h1>My Courses</h1>
        <p>Continue learning, explore new topics, and achieve your goals.</p>
      </div>

      {/* ── Filter Row ── */}
      <div className="learnova-filter-row animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="learnova-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`learnova-tab ${activeTab === tab ? "learnova-tab-active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="learnova-filter-right">
          <button className="learnova-filter-btn">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="learnova-sort-btn">
            Sort: Recent <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Course Grid ── */}
      <div className="learnova-course-grid">
        {filtered.map((course, idx) => {
          const isCompleted = course.status === "Completed";
          const isNotStarted = course.status === "Not Started";
          const badgeClass = isCompleted ? "learnova-badge-completed" : isNotStarted ? "learnova-badge-notstarted" : "learnova-badge-progress";

          return (
            <div
              key={course.id}
              className={`learnova-course-card ${animateCards ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Thumbnail */}
              <div className={`learnova-card-thumb ${THUMB_COLORS[course.thumb % THUMB_COLORS.length]}`}>
                <div className="flex items-center gap-1">
                  {COURSE_ICONS[course.icon % COURSE_ICONS.length]}
                </div>
                <div className={`learnova-card-badge ${badgeClass}`}>
                  {course.status}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStar(course.id); }}
                  className={`learnova-star ${course.starred ? 'active' : ''}`}
                >
                  <Star className="w-4 h-4" fill={course.starred ? '#f59e0b' : 'none'} stroke={course.starred ? '#f59e0b' : '#94a3b8'} />
                </button>
              </div>

              {/* Body */}
              <div className="learnova-card-body">
                <h3 className="learnova-card-title">{course.title}</h3>
                <div className="learnova-card-instructor">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.toLowerCase().replace(' ', '')}`} alt={course.instructor} />
                  <span>{course.instructor}</span>
                </div>

                {/* Progress */}
                <div className="learnova-card-progress">
                  <div className="learnova-progress-bar">
                    <div
                      className={`learnova-progress-fill ${isCompleted ? 'completed' : ''}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className={`learnova-progress-text ${isCompleted ? 'completed' : ''}`}>
                    {course.progress}% complete
                  </span>
                </div>

                {/* Meta */}
                <div className="learnova-card-meta">
                  <span><BookOpen className="w-3.5 h-3.5" /> {course.lessons} Lessons</span>
                  <span><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Browse Catalog Banner ── */}
      <div className="learnova-banner animate-fade-up" style={{ animationDelay: '500ms' }}>
        <div className="learnova-banner-content">
          <div className="learnova-banner-icon">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4>Looking for more courses?</h4>
            <p>Explore our catalog and find the perfect course to grow your skills.</p>
          </div>
        </div>
        <Link href="/dashboard/store" className="learnova-banner-btn">
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}
