"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, PlusCircle, Package, Trash2, Save, X,
  LinkIcon, DollarSign, FileText, CheckSquare, Square,
  Tag, Users, AlertTriangle, Edit3, Image, Video,
  ChevronDown, ChevronRight, PlayCircle, FileIcon,
  HelpCircle, Eye, EyeOff, Clock, Globe, Award,
  Layers, Plus, GripVertical, ToggleLeft, ToggleRight,
  Percent, Star, BookMarked, List
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LessonData {
  id: string; title: string; url?: string; duration?: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ"; order: number; isFree: boolean;
  description?: string;
}
interface SectionData {
  id: string; title: string; order: number; lessons: LessonData[];
}
interface Course {
  id: string; title: string; slug?: string; description: string;
  shortDescription?: string; price: number; originalPrice?: number;
  thumbnailUrl?: string; promoVideoUrl?: string;
  level: string; duration?: string; language: string; category?: string;
  tags?: string; whatYoullLearn?: string; requirements?: string;
  isActive: boolean; sections: SectionData[];
  _count?: { purchases: number };
}
interface Bundle {
  id: string; title: string; description: string; price: number;
  isActive: boolean; courses: { course: Course }[]; _count: { purchases: number };
}

type Tab = "courses" | "add-course" | "edit-course" | "create-bundle" | "bundles";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LESSON_TYPES = ["VIDEO", "DOCUMENT", "QUIZ"] as const;
const levelColor: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED: "bg-red-100 text-red-700"
};
const lessonTypeIcon: Record<string, any> = {
  VIDEO: PlayCircle, DOCUMENT: FileIcon, QUIZ: HelpCircle
};

function safeJson(val?: string | null): string[] {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
}

function pctOff(orig: number, discounted: number) {
  if (orig <= discounted) return 0;
  return Math.round((1 - discounted / orig) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon: Icon, label, badge, color = "blue" }: any) {
  const activeStyle = color === "purple"
    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
    : "bg-[var(--brand-600)] text-white shadow-md shadow-blue-200";
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${active ? activeStyle : "text-[var(--text-secondary)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)]"}`}>
      <Icon className="w-4 h-4" />
      {label}
      {badge != null && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${active ? "bg-white/20 text-white" : "bg-[var(--brand-100)] text-[var(--brand-700)]"}`}>{badge}</span>
      )}
    </button>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="elegant-card p-8 max-w-sm w-full animate-fade-up text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">Are you sure?</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// Dynamic bullet list (What You'll Learn / Requirements)
function BulletListEditor({ label, items, setItems, placeholder }: {
  label: string; items: string[]; setItems: (v: string[]) => void; placeholder: string;
}) {
  const add = () => setItems([...items, ""]);
  const update = (i: number, v: string) => setItems(items.map((x, idx) => idx === i ? v : x));
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-[var(--text-secondary)]">{label}</label>
        <button type="button" onClick={add} className="text-sm font-bold text-[var(--brand-600)] flex items-center gap-1 hover:gap-2 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-[var(--brand-400)] shrink-0">•</span>
            <input value={item} onChange={e => update(i, e.target.value)}
              className="elegant-input flex-1 py-2 text-sm" placeholder={placeholder} />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-[var(--text-tertiary)] italic">No items yet. Click "Add" to start.</p>
        )}
      </div>
    </div>
  );
}

// Tag chips editor
function TagEditor({ tags, setTags }: { tags: string[]; setTags: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setInput("");
  };
  const remove = (t: string) => setTags(tags.filter(x => x !== t));
  return (
    <div>
      <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--brand-50)] border border-[var(--brand-100)] text-[var(--brand-700)] text-xs font-bold rounded-full">
            {t}
            <button type="button" onClick={() => remove(t)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className="elegant-input flex-1 py-2 text-sm" placeholder="Type tag and press Enter or Add" />
        <button type="button" onClick={add} className="btn-secondary py-2 px-4 text-sm">Add</button>
      </div>
    </div>
  );
}

// ─── Section Builder ──────────────────────────────────────────────────────────
function SectionBuilder({ courseId, sections, onRefresh }: {
  courseId: string; sections: SectionData[]; onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingSection, setAddingSection] = useState(false);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", url: "", duration: "", type: "VIDEO" as "VIDEO" | "DOCUMENT" | "QUIZ", isFree: false, description: "" });

  const toggleExpand = (id: string) =>
    setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const addSection = async () => {
    if (!newSectionTitle.trim()) return;
    await fetch(`/api/admin/courses/${courseId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newSectionTitle.trim(), order: sections.length })
    });
    setNewSectionTitle(""); setAddingSection(false); onRefresh();
  };

  const deleteSection = async (sectionId: string) => {
    await fetch(`/api/admin/courses/${courseId}/sections`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId })
    });
    onRefresh();
  };

  const addLesson = async (sectionId: string) => {
    if (!lessonForm.title.trim()) return;
    const section = sections.find(s => s.id === sectionId);
    await fetch(`/api/admin/courses/${courseId}/sections/${sectionId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lessonForm, order: section?.lessons.length ?? 0 })
    });
    setLessonForm({ title: "", url: "", duration: "", type: "VIDEO", isFree: false, description: "" });
    setAddingLesson(null); onRefresh();
  };

  const updateLesson = async (sectionId: string, lessonId: string) => {
    if (!lessonForm.title.trim()) return;
    await fetch(`/api/admin/courses/${courseId}/sections/${sectionId}/lessons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, ...lessonForm })
    });
    setLessonForm({ title: "", url: "", duration: "", type: "VIDEO", isFree: false, description: "" });
    setEditingLesson(null); onRefresh();
  };

  const deleteLesson = async (sectionId: string, lessonId: string) => {
    await fetch(`/api/admin/courses/${courseId}/sections/${sectionId}/lessons`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId })
    });
    onRefresh();
  };

  const toggleFree = async (sectionId: string, lesson: LessonData) => {
    await fetch(`/api/admin/courses/${courseId}/sections/${sectionId}/lessons`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, isFree: !lesson.isFree })
    });
    onRefresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-[var(--text-secondary)] flex items-center gap-2">
          <Layers className="w-4 h-4" /> Sections & Lessons
        </label>
        <button type="button" onClick={() => setAddingSection(!addingSection)}
          className="text-sm font-bold text-[var(--brand-600)] flex items-center gap-1 hover:gap-2 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Section
        </button>
      </div>

      {addingSection && (
        <div className="flex gap-2 p-3 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-xl">
          <input value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSection())}
            className="elegant-input flex-1 py-2 text-sm" placeholder="Section title e.g. Introduction" autoFocus />
          <button type="button" onClick={addSection} className="btn-primary py-2 px-4 text-sm">Add</button>
          <button type="button" onClick={() => setAddingSection(false)} className="text-[var(--text-tertiary)] hover:text-red-500 px-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {sections.length === 0 && !addingSection && (
        <div className="text-center py-6 border-2 border-dashed border-[var(--border-strong)] rounded-2xl">
          <Layers className="w-8 h-8 text-[var(--border-strong)] mx-auto mb-2" />
          <p className="text-sm text-[var(--text-tertiary)] font-medium">No sections yet. Add one to organize your lessons.</p>
        </div>
      )}

      {sections.map((section, si) => {
        const isOpen = expanded.includes(section.id);
        const LessonCount = section.lessons.length;
        return (
          <div key={section.id} className="border border-[var(--border-strong)] rounded-2xl overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 cursor-pointer group" onClick={() => toggleExpand(section.id)}>
              <GripVertical className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
              {isOpen ? <ChevronDown className="w-4 h-4 text-[var(--brand-600)] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />}
              <span className="flex-1 font-bold text-sm text-[var(--text-primary)]">
                {si + 1}. {section.title}
              </span>
              <span className="text-xs text-[var(--text-tertiary)] font-medium mr-2">{LessonCount} lesson{LessonCount !== 1 ? "s" : ""}</span>
              <button type="button" onClick={e => { e.stopPropagation(); deleteSection(section.id); }}
                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lessons */}
            {isOpen && (
              <div className="p-3 space-y-2">
                {section.lessons.map((lesson, li) => {
                  const TypeIcon = lessonTypeIcon[lesson.type] || PlayCircle;
                  if (editingLesson === lesson.id) {
                    return (
                      <div key={lesson.id} className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-xl p-3 space-y-2">
                        <div className="grid sm:grid-cols-2 gap-2">
                          <input value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))}
                            className="elegant-input py-2 text-sm" placeholder="Lesson title *" autoFocus />
                          <input value={lessonForm.url} onChange={e => setLessonForm(p => ({ ...p, url: e.target.value }))}
                            className="elegant-input py-2 text-sm font-mono" placeholder="Video/resource URL" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input value={lessonForm.duration} onChange={e => setLessonForm(p => ({ ...p, duration: e.target.value }))}
                            className="elegant-input py-2 text-sm" placeholder="Duration e.g. 12:30" />
                          <select value={lessonForm.type} onChange={e => setLessonForm(p => ({ ...p, type: e.target.value as any }))}
                            className="elegant-input py-2 text-sm">
                            {LESSON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <label className="flex items-center gap-2 px-3 cursor-pointer">
                            <input type="checkbox" checked={lessonForm.isFree} onChange={e => setLessonForm(p => ({ ...p, isFree: e.target.checked }))}
                              className="w-4 h-4 rounded accent-[var(--brand-600)]" />
                            <span className="text-sm font-bold text-[var(--text-secondary)]">Free Preview</span>
                          </label>
                        </div>
                        <textarea value={lessonForm.description} onChange={e => setLessonForm(p => ({ ...p, description: e.target.value }))}
                          className="elegant-input py-2 text-sm min-h-[80px]" placeholder="Lesson description (supports HTML links like <a href='...'>Link</a>)" />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => updateLesson(section.id, lesson.id)} className="btn-primary py-2 px-4 text-sm flex items-center gap-1">
                            <Save className="w-3.5 h-3.5" /> Update Lesson
                          </button>
                          <button type="button" onClick={() => { setEditingLesson(null); setLessonForm({ title: "", url: "", duration: "", type: "VIDEO", isFree: false, description: "" }); }}
                            className="btn-secondary py-2 px-3 text-sm">Cancel</button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={lesson.id} className="flex flex-col p-3 bg-white border border-[var(--border-soft)] rounded-xl group hover:border-[var(--brand-200)] transition-colors">
                      <div className="flex items-center gap-3">
                        <TypeIcon className={`w-4 h-4 shrink-0 ${lesson.type === "VIDEO" ? "text-blue-500" : lesson.type === "DOCUMENT" ? "text-amber-500" : "text-purple-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[var(--text-primary)] truncate">{li + 1}. {lesson.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {lesson.duration && <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration}</span>}
                            {lesson.url && <span className="text-xs text-[var(--brand-500)] truncate max-w-[120px]">{lesson.url}</span>}
                          </div>
                        </div>
                        <button type="button" onClick={() => toggleFree(section.id, lesson)}
                          title={lesson.isFree ? "Free Preview: On" : "Free Preview: Off"}
                          className={`text-xs px-2 py-0.5 rounded-full font-bold border transition-colors ${lesson.isFree ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-green-300"}`}>
                          {lesson.isFree ? "Free" : "Paid"}
                        </button>
                        <button type="button" onClick={() => {
                          setAddingLesson(null);
                          setEditingLesson(lesson.id);
                          setLessonForm({ title: lesson.title, url: lesson.url || "", duration: lesson.duration || "", type: lesson.type, isFree: lesson.isFree, description: lesson.description || "" });
                        }} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => deleteLesson(section.id, lesson.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border border-red-100 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {lesson.description && (
                        <div className="mt-2 text-xs text-[var(--text-secondary)] pl-7">
                           <div dangerouslySetInnerHTML={{ __html: lesson.description }} className="prose prose-sm max-w-none" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Lesson */}
                {addingLesson === section.id ? (
                  <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-xl p-3 space-y-2">
                    <div className="grid sm:grid-cols-2 gap-2">
                      <input value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))}
                        className="elegant-input py-2 text-sm" placeholder="Lesson title *" autoFocus />
                      <input value={lessonForm.url} onChange={e => setLessonForm(p => ({ ...p, url: e.target.value }))}
                        className="elegant-input py-2 text-sm font-mono" placeholder="Video/resource URL" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={lessonForm.duration} onChange={e => setLessonForm(p => ({ ...p, duration: e.target.value }))}
                        className="elegant-input py-2 text-sm" placeholder="Duration e.g. 12:30" />
                      <select value={lessonForm.type} onChange={e => setLessonForm(p => ({ ...p, type: e.target.value as any }))}
                        className="elegant-input py-2 text-sm">
                        {LESSON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <label className="flex items-center gap-2 px-3 cursor-pointer">
                        <input type="checkbox" checked={lessonForm.isFree} onChange={e => setLessonForm(p => ({ ...p, isFree: e.target.checked }))}
                          className="w-4 h-4 rounded accent-[var(--brand-600)]" />
                        <span className="text-sm font-bold text-[var(--text-secondary)]">Free Preview</span>
                      </label>
                    </div>
                    <textarea value={lessonForm.description} onChange={e => setLessonForm(p => ({ ...p, description: e.target.value }))}
                      className="elegant-input py-2 text-sm min-h-[80px]" placeholder="Lesson description (supports HTML links like <a href='...'>Link</a>)" />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => addLesson(section.id)} className="btn-primary py-2 px-4 text-sm flex items-center gap-1">
                        <Save className="w-3.5 h-3.5" /> Save Lesson
                      </button>
                      <button type="button" onClick={() => { setAddingLesson(null); setLessonForm({ title: "", url: "", duration: "", type: "VIDEO", isFree: false, description: "" }); }}
                        className="btn-secondary py-2 px-3 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => { 
                    setAddingLesson(section.id); 
                    setEditingLesson(null);
                    setLessonForm({ title: "", url: "", duration: "", type: "VIDEO", isFree: false, description: "" });
                    if (!isOpen) toggleExpand(section.id); 
                  }}
                    className="w-full py-2 border-2 border-dashed border-[var(--brand-200)] rounded-xl text-sm font-bold text-[var(--brand-500)] hover:border-[var(--brand-400)] hover:bg-[var(--brand-50)] transition-all flex items-center justify-center gap-2">
                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Course Form (shared for Add & Edit) ─────────────────────────────────────
function CourseForm({
  initial, onSubmit, loading, onCancel, title: formTitle,
  courseId, onRefresh
}: {
  initial?: Partial<Course>; onSubmit: (data: any) => Promise<void>;
  loading: boolean; onCancel?: () => void; title: string;
  courseId?: string; onRefresh?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [originalPrice, setOriginalPrice] = useState(initial?.originalPrice?.toString() ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnailUrl ?? "");
  const [promoVideoUrl, setPromoVideoUrl] = useState(initial?.promoVideoUrl ?? "");
  const [level, setLevel] = useState(initial?.level ?? "BEGINNER");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [language, setLanguage] = useState(initial?.language ?? "Urdu");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tags, setTags] = useState<string[]>(safeJson(initial?.tags));
  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>(safeJson(initial?.whatYoullLearn));
  const [requirements, setRequirements] = useState<string[]>(safeJson(initial?.requirements));
  const [sections, setSections] = useState<SectionData[]>(initial?.sections ?? []);

  const [thumbPreviewError, setThumbPreviewError] = useState(false);
  const [activeSection, setActiveSection] = useState<"basic" | "pricing" | "content" | "curriculum">("basic");

  const pct = price && originalPrice ? pctOff(parseFloat(originalPrice), parseFloat(price)) : 0;

  const refreshSections = useCallback(async () => {
    if (!courseId) return;
    const res = await fetch(`/api/admin/courses/${courseId}/sections`);
    if (res.ok) setSections(await res.json());
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title, description, shortDescription, price, originalPrice,
      thumbnailUrl, promoVideoUrl, level, duration, language, category,
      tags, whatYoullLearn, requirements
    });
  };

  const sectionTabs = [
    { key: "basic", label: "Basic Info", icon: BookOpen },
    { key: "pricing", label: "Pricing", icon: DollarSign },
    { key: "content", label: "Details", icon: List },
    { key: "curriculum", label: "Curriculum", icon: Layers },
  ] as const;

  return (
    <div className="elegant-card overflow-hidden animate-fade-up">
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 border-b border-[var(--border-soft)]">
        <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-[var(--brand-600)] shrink-0" /> {formTitle}
        </h2>
        <div className="flex gap-1 mt-4 overflow-x-auto custom-scrollbar pb-1">
          {sectionTabs.map(({ key, label, icon: Icon }) => (
            <button type="button" key={key} onClick={() => setActiveSection(key as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeSection === key ? "bg-[var(--brand-600)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--brand-50)]"}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6">

        {/* ── BASIC INFO ── */}
        {activeSection === "basic" && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Course Title *</label>
                <div className="input-icon-wrapper">
                  <BookOpen className="icon-left" />
                  <input required value={title} onChange={e => setTitle(e.target.value)}
                    className="elegant-input has-icon-left" placeholder="e.g. Mastering AI for Freelancers 2026" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Short Description</label>
                <input value={shortDescription} onChange={e => setShortDescription(e.target.value)}
                  className="elegant-input" placeholder="One-line tagline for course cards" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Category</label>
                <input value={category} onChange={e => setCategory(e.target.value)}
                  className="elegant-input" placeholder="e.g. Freelancing, AI, Digital Marketing" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Full Description *</label>
                <div className="input-icon-wrapper">
                  <FileText className="icon-top" />
                  <textarea required value={description} onChange={e => setDescription(e.target.value)}
                    rows={4} className="elegant-input has-icon-left resize-none" placeholder="Describe what students will learn..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Difficulty Level</label>
                <select value={level} onChange={e => setLevel(e.target.value)} className="elegant-input">
                  <option value="BEGINNER">🟢 Beginner</option>
                  <option value="INTERMEDIATE">🟡 Intermediate</option>
                  <option value="ADVANCED">🔴 Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Duration</label>
                <div className="input-icon-wrapper">
                  <Clock className="icon-left" />
                  <input value={duration} onChange={e => setDuration(e.target.value)}
                    className="elegant-input has-icon-left" placeholder="e.g. 12 hours, 6 weeks" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Language</label>
                <div className="input-icon-wrapper">
                  <Globe className="icon-left" />
                  <input value={language} onChange={e => setLanguage(e.target.value)}
                    className="elegant-input has-icon-left" placeholder="e.g. Urdu, English, Urdu/English" />
                </div>
              </div>
              <div>
                <TagEditor tags={tags} setTags={setTags} />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                <Image className="w-4 h-4" /> Course Thumbnail Image
              </label>
              <div className="flex items-center gap-3">
                <div className="input-icon-wrapper flex-1">
                  <LinkIcon className="icon-left" />
                  <input value={thumbnailUrl} onChange={e => { setThumbnailUrl(e.target.value); setThumbPreviewError(false); }}
                    className="elegant-input has-icon-left font-mono" placeholder="URL or upload an image ->" />
                </div>
                <label className="btn-secondary h-12 flex items-center px-4 cursor-pointer">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if(!file) return;
                    const fd = new FormData();
                    fd.append('file', file);
                    try {
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                      const data = await res.json();
                      if(data.url) {
                        setThumbnailUrl(data.url);
                        setThumbPreviewError(false);
                      } else {
                        alert(data.error || "Failed to upload image");
                      }
                    } catch(err) {
                      alert("Upload failed.");
                    }
                  }} />
                </label>
              </div>
              {thumbnailUrl && !thumbPreviewError && (
                <div className="mt-3 relative rounded-2xl overflow-hidden border border-[var(--border-strong)] h-40 w-72">
                  <img src={thumbnailUrl} alt="thumbnail preview" className="w-full h-full object-cover"
                    onError={() => setThumbPreviewError(true)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-bold">Preview</span>
                </div>
              )}
              {thumbPreviewError && <p className="text-xs text-red-500 mt-1">⚠️ Could not load image.</p>}
            </div>

            {/* Promo Video */}
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                <Video className="w-4 h-4" /> Promo Video URL <span className="text-[var(--text-tertiary)] font-normal">(optional)</span>
              </label>
              <div className="input-icon-wrapper">
                <LinkIcon className="icon-left" />
                <input value={promoVideoUrl} onChange={e => setPromoVideoUrl(e.target.value)}
                  className="elegant-input has-icon-left font-mono" placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
          </div>
        )}

        {/* ── PRICING ── */}
        {activeSection === "pricing" && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">
                  Original Price (Rs.) <span className="text-[var(--text-tertiary)] font-normal">— struck through</span>
                </label>
                <div className="input-icon-wrapper">
                  <DollarSign className="icon-left" />
                  <input type="number" min="0" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                    className="elegant-input has-icon-left" placeholder="10000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">
                  Discounted Price (Rs.) * <span className="text-[var(--text-tertiary)] font-normal">— selling price</span>
                </label>
                <div className="input-icon-wrapper">
                  <DollarSign className="icon-left" />
                  <input required type="number" min="100" value={price} onChange={e => setPrice(e.target.value)}
                    className="elegant-input has-icon-left" placeholder="5000" />
                </div>
              </div>
            </div>

            {/* Pricing Preview Card */}
            {price && (
              <div className="bg-gradient-to-br from-[var(--brand-50)] to-emerald-50 border border-[var(--brand-100)] rounded-2xl p-6">
                <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Live Pricing Preview</p>
                <div className="flex items-center gap-4 flex-wrap">
                  {originalPrice && parseFloat(originalPrice) > parseFloat(price) && (
                    <span className="text-2xl font-bold text-[var(--text-tertiary)] line-through">Rs. {parseFloat(originalPrice).toLocaleString()}</span>
                  )}
                  <span className="text-3xl font-black text-[var(--brand-700)]">Rs. {parseFloat(price || "0").toLocaleString()}</span>
                  {pct > 0 && (
                    <span className="bg-red-500 text-white text-sm font-black px-3 py-1 rounded-full flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />{pct}% OFF
                    </span>
                  )}
                </div>
                {pct > 0 && (
                  <p className="text-sm text-green-600 font-bold mt-2">
                    Student saves Rs. {(parseFloat(originalPrice) - parseFloat(price)).toLocaleString()}!
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── DETAILS / CONTENT ── */}
        {activeSection === "content" && (
          <div className="space-y-6">
            <BulletListEditor
              label="What You'll Learn"
              items={whatYoullLearn}
              setItems={setWhatYoullLearn}
              placeholder="e.g. Build production-ready apps with AI"
            />
            <div className="border-t border-[var(--border-soft)] pt-6">
              <BulletListEditor
                label="Requirements / Prerequisites"
                items={requirements}
                setItems={setRequirements}
                placeholder="e.g. Basic computer knowledge"
              />
            </div>
          </div>
        )}

        {/* ── CURRICULUM ── */}
        {activeSection === "curriculum" && (
          courseId ? (
            <SectionBuilder courseId={courseId} sections={sections} onRefresh={refreshSections} />
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-[var(--border-strong)] rounded-2xl">
              <Layers className="w-10 h-10 text-[var(--border-strong)] mx-auto mb-3" />
              <p className="font-bold text-[var(--text-secondary)]">Curriculum becomes available after you publish the course.</p>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">Save the course first, then come back to add sections & lessons.</p>
            </div>
          )
        )}

        <div className="flex gap-3 pt-2 border-t border-[var(--border-soft)]">
          <button type="submit" disabled={loading}
            className="btn-primary flex items-center gap-2 h-12 px-8">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              : <><Save className="w-4 h-4" />{initial?.id ? "Update Course" : "Publish Course"}</>
            }
          </button>
          {onCancel && <button type="button" onClick={onCancel} className="btn-secondary h-12 px-6">Cancel</button>}
        </div>
      </form>
    </div>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course, onEdit, onDelete, onToggle }: {
  course: Course; onEdit: () => void; onDelete: () => void; onToggle: () => void;
}) {
  const pct = course.originalPrice ? pctOff(course.originalPrice, course.price) : 0;
  const totalLessons = course.sections.reduce((s, sec) => s + sec.lessons.length, 0);

  return (
    <div className="elegant-card overflow-hidden group hover:border-[var(--brand-300)] hover:shadow-xl transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-[var(--brand-600)] to-blue-700 overflow-hidden">
        {course.thumbnailUrl
          ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center"><BookMarked className="w-14 h-14 text-white/30" /></div>
        }
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${levelColor[course.level] ?? "bg-gray-100 text-gray-600"}`}>
            {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
          </span>
          {pct > 0 && <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-red-500 text-white">{pct}% OFF</span>}
        </div>
        {/* Status toggle */}
        <button onClick={onToggle}
          title={course.isActive ? "Click to hide" : "Click to publish"}
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${course.isActive ? "bg-green-500 text-white hover:bg-green-600" : "bg-slate-500 text-white hover:bg-slate-600"}`}>
          {course.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {course.isActive ? "Live" : "Hidden"}
        </button>
      </div>

      <div className="p-5">
        {/* Category */}
        {course.category && <p className="text-[10px] font-bold text-[var(--brand-500)] uppercase tracking-widest mb-1">{course.category}</p>}
        <h3 className="font-black text-[var(--text-primary)] text-base leading-tight mb-1">{course.title}</h3>
        <p className="text-xs text-[var(--text-secondary)] font-medium line-clamp-2">{course.shortDescription || course.description}</p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {course.duration && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-[var(--border-soft)] px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />{course.duration}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-[var(--border-soft)] px-2 py-0.5 rounded-full">
            <Globe className="w-3 h-3" />{course.language}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-[var(--border-soft)] px-2 py-0.5 rounded-full">
            <Layers className="w-3 h-3" />{course.sections.length} sec · {totalLessons} lessons
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-[var(--border-soft)] px-2 py-0.5 rounded-full">
            <Users className="w-3 h-3" />{course._count?.purchases ?? 0} enrolled
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-4">
          {course.originalPrice && course.originalPrice > course.price && (
            <span className="text-sm font-bold text-[var(--text-tertiary)] line-through">Rs. {course.originalPrice.toLocaleString()}</span>
          )}
          <span className="text-xl font-black text-[var(--brand-700)]">Rs. {course.price.toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--brand-50)] hover:bg-[var(--brand-100)] text-[var(--brand-700)] font-bold text-sm border border-[var(--brand-100)] transition-colors">
            <Edit3 className="w-4 h-4" /> Edit
          </button>
          <button onClick={onDelete}
            className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center border border-red-100 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCoursesPage() {
  const [tab, setTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ type: "course" | "bundle"; id: string } | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const [formLoading, setFormLoading] = useState(false);
  const [bundleTitle, setBundleTitle] = useState("");
  const [bundleDesc, setBundleDesc] = useState("");
  const [bundlePrice, setBundlePrice] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [bundleLoading, setBundleLoading] = useState(false);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 4000); };

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([fetch("/api/admin/courses"), fetch("/api/admin/bundles")]);
      if (cRes.ok) setCourses(await cRes.json());
      if (bRes.ok) setBundles(await bRes.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const selectedTotal = courses.filter(c => selectedCourseIds.includes(c.id)).reduce((s, c) => s + c.price, 0);
  const toggleCourse = (id: string) => setSelectedCourseIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleCreateCourse = async (data: any) => {
    setFormLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showMsg("✅ Course published!"); await loadData(); setTab("courses");
    } catch (err: any) { showMsg("❌ " + err.message); } finally { setFormLoading(false); }
  };

  const handleUpdateCourse = async (data: any) => {
    if (!editCourse) return;
    setFormLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editCourse.id, ...data })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showMsg("✅ Course updated!"); await loadData(); setTab("courses"); setEditCourse(null);
    } catch (err: any) { showMsg("❌ " + err.message); } finally { setFormLoading(false); }
  };

  const handleToggleActive = async (course: Course) => {
    await fetch("/api/admin/courses", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: course.id, isActive: !course.isActive })
    });
    await loadData();
  };

  const handleCreateBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourseIds.length < 2) { showMsg("❌ Select at least 2 courses."); return; }
    setBundleLoading(true);
    try {
      const res = await fetch("/api/admin/bundles", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: bundleTitle, description: bundleDesc, price: bundlePrice, courseIds: selectedCourseIds })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showMsg("✅ Bundle created!"); setBundleTitle(""); setBundleDesc(""); setBundlePrice(""); setSelectedCourseIds([]);
      await loadData(); setTab("bundles");
    } catch (err: any) { showMsg("❌ " + err.message); } finally { setBundleLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const url = confirmDelete.type === "course" ? "/api/admin/courses" : "/api/admin/bundles";
    try {
      await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: confirmDelete.id }) });
      showMsg("🗑️ Deleted."); await loadData();
    } catch { showMsg("❌ Failed."); }
    setConfirmDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 pb-10">
      {confirmDelete && <ConfirmModal message={`Permanently delete this ${confirmDelete.type}?`} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}

      <header className="animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">Course & Bundle Manager</h1>
        </div>
        <p className="text-[var(--text-secondary)] font-medium text-sm sm:text-base ml-0 sm:ml-[52px]">Create, edit, and organise your courses and bundles.</p>
      </header>

      {msg && (
        <div className={`p-4 rounded-xl text-sm font-bold animate-fade-up ${msg.startsWith("✅") || msg.startsWith("🗑️") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg}
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-2 overflow-x-auto bg-white border border-[var(--border-strong)] rounded-2xl p-2 shadow-sm animate-fade-up custom-scrollbar" style={{ animationDelay: "100ms" }}>
        <TabBtn active={tab === "courses"} onClick={() => setTab("courses")} icon={BookOpen} label="All Courses" badge={courses.length} />
        <TabBtn active={tab === "add-course"} onClick={() => setTab("add-course")} icon={PlusCircle} label="Add Course" />
        {editCourse && <TabBtn active={tab === "edit-course"} onClick={() => setTab("edit-course")} icon={Edit3} label={`Editing: ${editCourse.title.slice(0, 20)}…`} />}
        <TabBtn active={tab === "create-bundle"} onClick={() => setTab("create-bundle")} icon={Package} label="Create Bundle" color="purple" />
        <TabBtn active={tab === "bundles"} onClick={() => setTab("bundles")} icon={Tag} label="All Bundles" badge={bundles.length} />
      </div>

      {/* ALL COURSES */}
      {tab === "courses" && (
        <div className="animate-fade-up">
          {loading ? (
            <div className="elegant-card p-12 text-center text-[var(--text-tertiary)]">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="elegant-card p-12 text-center">
              <BookOpen className="w-12 h-12 text-[var(--border-strong)] mx-auto mb-3" />
              <p className="font-bold text-[var(--text-secondary)]">No courses yet.</p>
              <button onClick={() => setTab("add-course")} className="btn-primary mt-4 inline-flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Create first course
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(course => (
                <CourseCard key={course.id} course={course}
                  onEdit={() => { setEditCourse(course); setTab("edit-course"); }}
                  onDelete={() => setConfirmDelete({ type: "course", id: course.id })}
                  onToggle={() => handleToggleActive(course)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD COURSE */}
      {tab === "add-course" && (
        <CourseForm
          title="Create New Course"
          onSubmit={handleCreateCourse}
          loading={formLoading}
          onCancel={() => setTab("courses")}
        />
      )}

      {/* EDIT COURSE */}
      {tab === "edit-course" && editCourse && (
        <CourseForm
          title={`Edit: ${editCourse.title}`}
          initial={editCourse}
          courseId={editCourse.id}
          onSubmit={handleUpdateCourse}
          loading={formLoading}
          onCancel={() => { setTab("courses"); setEditCourse(null); }}
          onRefresh={loadData}
        />
      )}

      {/* CREATE BUNDLE */}
      {tab === "create-bundle" && (
        <div className="elegant-card p-4 sm:p-6 md:p-8 animate-fade-up">
          <h2 className="text-xl font-black text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" /> Create Course Bundle
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Bundle multiple courses together at a special discount price.</p>
          <form onSubmit={handleCreateBundle} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Bundle Name *</label>
                <div className="input-icon-wrapper">
                  <Package className="icon-left" />
                  <input required value={bundleTitle} onChange={e => setBundleTitle(e.target.value)} className="elegant-input has-icon-left" placeholder="e.g. Ultimate Freelancer Pack" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Bundle Price (Rs.) *</label>
                <div className="input-icon-wrapper">
                  <DollarSign className="icon-left" />
                  <input required type="number" min="100" value={bundlePrice} onChange={e => setBundlePrice(e.target.value)} className="elegant-input has-icon-left" placeholder="8000" />
                </div>
                {selectedCourseIds.length > 0 && bundlePrice && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Retail total: <span className="font-bold text-[var(--brand-600)]">Rs. {selectedTotal.toLocaleString()}</span>
                    {parseFloat(bundlePrice) < selectedTotal && <span className="text-green-600 font-bold ml-2">({Math.round((1 - parseFloat(bundlePrice) / selectedTotal) * 100)}% off!)</span>}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Bundle Description *</label>
              <textarea required rows={2} value={bundleDesc} onChange={e => setBundleDesc(e.target.value)} className="elegant-input resize-none" placeholder="Describe what's included..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
                Select Courses * <span className="text-[var(--text-tertiary)] font-normal">(minimum 2 required)</span>
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {courses.map(course => {
                  const selected = selectedCourseIds.includes(course.id);
                  return (
                    <button type="button" key={course.id} onClick={() => toggleCourse(course.id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${selected ? "border-[var(--brand-500)] bg-[var(--brand-50)]" : "border-[var(--border-strong)] bg-white hover:border-[var(--brand-300)]"}`}>
                      <div className={`w-5 h-5 rounded shrink-0 mt-0.5 ${selected ? "text-[var(--brand-600)]" : "text-[var(--border-strong)]"}`}>
                        {selected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${selected ? "text-[var(--brand-700)]" : "text-[var(--text-primary)]"}`}>{course.title}</p>
                        <p className={`text-xs font-bold mt-0.5 ${selected ? "text-[var(--brand-600)]" : "text-[var(--text-tertiary)]"}`}>Rs. {course.price.toLocaleString()}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="submit" disabled={bundleLoading || selectedCourseIds.length < 2} className="btn-primary flex items-center gap-2 h-12 disabled:opacity-50">
              {bundleLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : <><Package className="w-4 h-4" />Create Bundle Package</>}
            </button>
          </form>
        </div>
      )}

      {/* ALL BUNDLES */}
      {tab === "bundles" && (
        <div className="space-y-4 animate-fade-up">
          {bundles.length === 0 ? (
            <div className="elegant-card p-12 text-center">
              <Package className="w-12 h-12 text-[var(--border-strong)] mx-auto mb-3" />
              <p className="font-bold text-[var(--text-secondary)]">No bundles yet.</p>
              <button onClick={() => setTab("create-bundle")} className="btn-primary mt-4 inline-flex items-center gap-2"><Package className="w-4 h-4" />Create first bundle</button>
            </div>
          ) : bundles.map((bundle, i) => (
            <div key={bundle.id} className="elegant-card p-5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-[var(--text-primary)]">{bundle.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-100 text-purple-700">{bundle.courses.length} courses</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5 truncate">{bundle.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bundle.courses.map(({ course }) => (
                      <span key={course.id} className="inline-flex items-center gap-1 text-xs bg-[var(--brand-50)] border border-[var(--brand-100)] text-[var(--brand-700)] px-2 py-1 rounded-lg font-bold">
                        <BookOpen className="w-3 h-3" />{course.title}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs font-bold">
                    <span className="text-[var(--brand-600)]">Rs. {bundle.price.toLocaleString()}</span>
                    <span className="text-[var(--text-tertiary)] flex items-center gap-1"><Users className="w-3 h-3" />{bundle._count?.purchases || 0} purchases</span>
                  </div>
                </div>
                <button onClick={() => setConfirmDelete({ type: "bundle", id: bundle.id })}
                  className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
