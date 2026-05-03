"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle2, ChevronDown, ChevronRight,
  BookOpen, X, Loader2, FileText, ArrowLeft,
  PanelLeftClose, PanelLeftOpen, Clock, Video, Type,
  MessageSquare, Info,
  Send, Menu, ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  url?: string | null;
  duration?: string | null;
  type: string;
  isFree: boolean;
  order: number;
  description?: string | null;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  duration?: string | null;
  language?: string | null;
  instructorName?: string | null;
  level: string;
}

interface Props {
  course: Course;
  sections: Section[];
  totalLessons: number;
  initialCompletedIds: string[];
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/") || url.includes("player.vimeo.com")) return url;
  if (url.includes("youtube.com/watch?v=")) {
    const id = new URLSearchParams(url.split("?")[1]).get("v");
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return url;
}

function parseDurationMinutes(d?: string | null): number {
  if (!d) return 5;
  const m = d.match(/(\d+)\s*m/i);
  const h = d.match(/(\d+)\s*h/i);
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0) || 5;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Sidebar Content ────────────────────────────────────────────────────────

function SidebarContent({
  course, sections, totalLessons, completedIds, activeLesson,
  expandedSections, toggleSection, selectLesson, progressPercent,
}: {
  course: Course; sections: Section[]; totalLessons: number;
  completedIds: Set<string>; activeLesson: Lesson | null;
  expandedSections: Set<string>; toggleSection: (id: string) => void;
  selectLesson: (l: Lesson) => void; progressPercent: number;
}) {
  const allLessons = sections.flatMap(s => s.lessons);
  const remainingMins = allLessons
    .filter(l => !completedIds.has(l.id))
    .reduce((sum, l) => sum + parseDurationMinutes(l.duration), 0);

  return (
    <>
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex-shrink-0">
        <a href="/dashboard/learning" className="flex items-center gap-1.5 text-slate-400 hover:text-[var(--brand-600)] text-xs font-semibold mb-3 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Learning
        </a>
        <h2 className="text-slate-800 font-black text-sm leading-snug line-clamp-2 mb-4">{course.title}</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400">Course Progress</span>
            <span className={progressPercent === 100 ? "text-emerald-600" : "text-[var(--brand-600)]"}>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${progressPercent === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-400)]"}`} style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{completedIds.size} of {totalLessons} lessons</span>
            {remainingMins > 0 && <span>~{formatMinutes(remainingMins)} remaining</span>}
          </div>
        </div>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto py-1">
        {sections.map((section) => {
          const done = section.lessons.filter(l => completedIds.has(l.id)).length;
          const open = expandedSections.has(section.id);
          const sectionMins = section.lessons.reduce((s, l) => s + parseDurationMinutes(l.duration), 0);
          const allDone = done === section.lessons.length && section.lessons.length > 0;

          return (
            <div key={section.id} className="border-b border-slate-50 last:border-0">
              <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-2.5 min-w-0">
                  {open ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                  <span className={`font-bold text-xs truncate ${allDone ? "text-emerald-600" : "text-slate-700"}`}>{section.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold flex-shrink-0 ml-2">
                  {sectionMins > 0 && <span>{formatMinutes(sectionMins)}</span>}
                  <span className={allDone ? "text-emerald-500" : ""}>{done}/{section.lessons.length}</span>
                </div>
              </button>

              {open && section.lessons.map((lesson) => {
                const isActive = activeLesson?.id === lesson.id;
                const isDone = completedIds.has(lesson.id);
                return (
                  <button key={lesson.id} onClick={() => selectLesson(lesson)} className={`w-full flex items-start gap-3 px-5 pl-10 py-3 text-left transition-all border-l-[3px] ${isActive ? "bg-blue-50 border-l-[var(--brand-500)]" : "border-l-transparent hover:bg-slate-50"}`}>
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${isDone ? "bg-emerald-500 border-emerald-500" : isActive ? "border-[var(--brand-500)]" : "border-slate-200"}`}>
                      {isDone ? <CheckCircle2 className="w-3 h-3 text-white" /> : <span className={`${isActive ? "text-[var(--brand-500)]" : "text-slate-300"}`}>{lesson.url ? <Video className="w-2.5 h-2.5" /> : <Type className="w-2.5 h-2.5" />}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${isActive ? "text-[var(--brand-700)] font-bold" : isDone ? "text-slate-400 line-through" : "text-slate-600 font-medium"}`}>{lesson.title}</p>
                      {lesson.duration && <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {lesson.duration}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Main Player ─────────────────────────────────────────────────────────────

type ContentTab = "overview" | "notes" | "qa";

export default function CoursePlayerClient({ course, sections, totalLessons, initialCompletedIds }: Props) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(initialCompletedIds));
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map(s => s.id)));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [markingDone, setMarkingDone] = useState(false);
  const [contentTab, setContentTab] = useState<ContentTab>("overview");
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [qaInput, setQaInput] = useState("");
  const [qaMessages, setQaMessages] = useState<{user: string; text: string; time: string}[]>([]);
  const notesTimerRef = useRef<NodeJS.Timeout | null>(null);

  const progressPercent = totalLessons > 0 ? Math.round((completedIds.size / totalLessons) * 100) : 0;
  const allLessons = sections.flatMap(s => s.lessons);

  useEffect(() => {
    const saved = localStorage.getItem(`lms_last_lesson_${course.id}`);
    if (saved) { for (const s of sections) { const l = s.lessons.find(x => x.id === saved); if (l) { setActiveLesson(l); return; } } }
    if (sections[0]?.lessons[0]) setActiveLesson(sections[0].lessons[0]);
  }, [course.id, sections]);

  useEffect(() => { if (activeLesson) { setNotes(localStorage.getItem(`lms_notes_${activeLesson.id}`) || ""); setNotesSaved(false); } }, [activeLesson?.id]);

  useEffect(() => {
    if (!activeLesson) return;
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(() => { if (notes) { localStorage.setItem(`lms_notes_${activeLesson.id}`, notes); setNotesSaved(true); setTimeout(() => setNotesSaved(false), 2000); } }, 1500);
    return () => { if (notesTimerRef.current) clearTimeout(notesTimerRef.current); };
  }, [notes, activeLesson?.id]);

  const selectLesson = useCallback((lesson: Lesson) => {
    setActiveLesson(lesson);
    setMobileSidebarOpen(false);
    localStorage.setItem(`lms_last_lesson_${course.id}`, lesson.id);
  }, [course.id]);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const currentIndex = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isCompleted = activeLesson ? completedIds.has(activeLesson.id) : false;

  const markCompleteAndNext = async () => {
    if (!activeLesson) return;
    if (!completedIds.has(activeLesson.id)) {
      setMarkingDone(true);
      try {
        await fetch("/api/user/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: activeLesson.id, courseId: course.id }) });
        const newCompleted = new Set([...completedIds, activeLesson.id]);
        setCompletedIds(newCompleted);
        if (newCompleted.size === totalLessons) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }
      } catch { alert("Failed to mark complete."); }
      finally { setMarkingDone(false); }
    }
    if (nextLesson) setTimeout(() => selectLesson(nextLesson), 400);
  };

  const embedUrl = activeLesson?.url ? getEmbedUrl(activeLesson.url) : null;
  const sidebarProps = { course, sections, totalLessons, completedIds, activeLesson, expandedSections, toggleSection, selectLesson, progressPercent };

  return (
    <div className="flex h-full w-full bg-slate-50 overflow-hidden">
      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="text-center animate-scale-in">
            <div className="text-6xl mb-3">🎉</div>
            <div className="bg-emerald-500 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-2xl">Course Completed!</div>
          </div>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-100 flex-shrink-0 transition-all duration-300 ${desktopSidebarOpen ? "w-[320px]" : "w-0 overflow-hidden border-0"}`}>
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-[85vw] max-w-[320px] bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 lg:hidden shadow-2xl ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-slate-800 font-black text-sm">Course Content</span>
          <button onClick={() => setMobileSidebarOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* ── TOP HEADER BAR ── */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <a href="/dashboard/learning" className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </a>
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <button onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)} className="hidden lg:flex w-8 h-8 rounded-lg bg-slate-100 items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
              {desktopSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            {/* Lesson title in header - truncated */}
            <h3 className="hidden sm:block text-sm font-bold text-slate-600 truncate max-w-[300px]">
              {activeLesson?.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-500">{progressPercent}%</span>
            </div>
          </div>
        </header>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto">
          
          {/* ── LESSON TITLE (MOBILE) ── */}
          <div className="px-5 pt-5 pb-3 sm:px-8 sm:pt-6 sm:pb-4">
            <div className="flex items-center gap-2 mb-1.5">
              {activeLesson?.url ? <Video className="w-3.5 h-3.5 text-[var(--brand-600)]" /> : <FileText className="w-3.5 h-3.5 text-[var(--brand-600)]" />}
              <span className="text-[var(--brand-600)] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {activeLesson?.url ? "Video Lesson" : "Text Lesson"}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 leading-tight">
              {activeLesson?.title || "Select a Lesson"}
            </h1>
          </div>

          {/* ── VIDEO PLAYER ── */}
          <div className="px-0 sm:px-8 pb-5">
            <div className="bg-slate-900 aspect-video w-full relative group overflow-hidden sm:rounded-2xl sm:shadow-lg">
              {embedUrl ? (
                <iframe key={embedUrl} src={embedUrl} className="w-full h-full" allowFullScreen />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-white/10 mb-4" />
                  <p className="text-white/40 font-bold text-sm sm:text-lg">{activeLesson?.title}</p>
                  <p className="text-white/20 text-xs sm:text-sm mt-1">No video available for this lesson.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── CONTENT WRAPPER ── */}
          <div className="max-w-4xl mx-auto w-full px-5 sm:px-8">
            
            {/* ── LESSON PROGRESS BAR ── */}
            <div className="pb-5 mb-5 border-b border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  Lesson <span className="text-slate-800">{currentIndex + 1}</span> of <span className="text-slate-800">{allLessons.length}</span>
                </p>
                {isCompleted && (
                  <span className="text-emerald-600 text-[10px] sm:text-xs font-black flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
              <div className="h-2 bg-slate-100 rounded-full w-full relative overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / allLessons.length) * 100}%` }} />
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="border-b border-slate-200 mb-6">
              <nav className="flex gap-1">
                {([
                  { id: "overview" as const, label: "Overview", icon: Info },
                  { id: "notes" as const, label: "Notes", icon: FileText },
                  { id: "qa" as const, label: "Discussion", icon: MessageSquare },
                ] as const).map(tab => {
                  const active = contentTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setContentTab(tab.id)} className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${active ? "border-[var(--brand-600)] text-[var(--brand-600)]" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="pb-36">
              {contentTab === "overview" && (
                <div className="space-y-6">
                  {activeLesson?.description && (
                    <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <h3 className="text-sm font-black text-slate-800 mb-3">Lesson Description</h3>
                      <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: activeLesson.description }} />
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <BookOpen className="w-5 h-5 text-[var(--brand-600)] mb-2" />
                      <p className="text-2xl font-black text-slate-800">{totalLessons}</p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Total Lessons</p>
                    </div>
                    <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
                      <p className="text-2xl font-black text-slate-800">{completedIds.size}</p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                    </div>
                    {course.instructorName && (
                      <div className="sm:col-span-2 p-5 bg-white border border-slate-100 flex items-center gap-4 rounded-xl shadow-sm">
                        <div className="w-11 h-11 rounded-xl bg-[var(--brand-100)] text-[var(--brand-600)] font-black flex items-center justify-center text-lg">{course.instructorName[0]}</div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Instructor</p>
                          <p className="text-base font-black text-slate-800">{course.instructorName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {contentTab === "notes" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-black text-slate-800">Personal Notes</h3>
                    {notesSaved && <span className="text-emerald-600 text-xs font-bold animate-pulse">Saved ✓</span>}
                  </div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Type your notes here... (Auto-saved)"
                    className="w-full h-52 sm:h-64 p-4 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-100)] outline-none transition-all leading-relaxed resize-none"
                  />
                </div>
              )}

              {contentTab === "qa" && (
                <div className="space-y-5">
                  <h3 className="text-base font-black text-slate-800">Lesson Discussion</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qaInput}
                      onChange={e => setQaInput(e.target.value)}
                      placeholder="Ask something..."
                      className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-100)] transition-all"
                      onKeyDown={e => { if (e.key === "Enter" && qaInput.trim()) { setQaMessages([...qaMessages, {user: "You", text: qaInput, time: "Just now"}]); setQaInput(""); } }}
                    />
                    <button onClick={() => { if(qaInput.trim()){ setQaMessages([...qaMessages, {user: "You", text: qaInput, time: "Just now"}]); setQaInput(""); } }} className="bg-[var(--brand-600)] text-white px-4 rounded-xl font-bold hover:bg-[var(--brand-700)] transition-colors shrink-0">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {qaMessages.length > 0 ? qaMessages.map((m, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-black text-xs text-[var(--brand-700)]">{m.user}</span>
                          <span className="text-[10px] text-slate-400">{m.time}</span>
                        </div>
                        <p className="text-sm text-slate-600">{m.text}</p>
                      </div>
                    )) : (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm">
                        No questions yet. Be the first to ask!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FIXED BOTTOM BAR ── */}
        <div className="bg-white border-t border-slate-100 py-3 px-4 sm:px-6 flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="w-20">
              {prevLesson ? (
                <button onClick={() => selectLesson(prevLesson)} className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-[var(--brand-600)] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Prev
                </button>
              ) : <div />}
            </div>
            
            <button 
              onClick={markCompleteAndNext}
              disabled={markingDone}
              className="flex items-center gap-2 bg-[var(--brand-600)] text-white px-5 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-black rounded-full hover:bg-[var(--brand-700)] transition-all active:scale-95 shadow-lg shadow-blue-200/50 disabled:opacity-50"
            >
              {markingDone ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                isCompleted ? (nextLesson ? "Next Lesson" : "All Done ✓") : "Complete & Next"
              )}
              {!markingDone && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="w-20 flex justify-end">
              {nextLesson ? (
                <button onClick={() => selectLesson(nextLesson)} className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-[var(--brand-600)] transition-colors">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
