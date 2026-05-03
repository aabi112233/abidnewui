"use client";

import { useState, useRef } from "react";
import {
  ChevronDown, CheckCircle2, Star, PlayCircle, Lock,
  MessageSquare, X, Loader2, User, BookOpen,
  HelpCircle, FileText, Send, Share2, Copy, Clock,
  Video, Type, ChevronsDown, ChevronsUp, ExternalLink, Download, Users
} from "lucide-react";

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

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: { name?: string | null; image?: string | null };
}

interface Faq {
  question: string;
  answer: string;
}

interface Props {
  courseId: string;
  description: string;
  thumbnailUrl?: string | null;
  whatYoullLearn: string[];
  requirements: string[];
  faqs: Faq[];
  sections: Section[];
  reviews: Review[];
  totalLessons: number;
  averageRating: number;
  isOwned: boolean;
  instructorName?: string | null;
  instructorBio?: string | null;
  instructorImage?: string | null;
}

const TABS = [
  { id: "description", label: "Description", icon: FileText },
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
];

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive && hovered ? hovered : rating;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${interactive ? "cursor-pointer w-6 h-6" : "w-4 h-4"} transition-colors ${
            s <= Math.round(display) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
          }`}
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
}

function parseDur(d?: string | null): number {
  if (!d) return 0;
  const m = d.match(/(\d+)\s*m/i);
  const h = d.match(/(\d+)\s*h/i);
  return (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
}

function fmtMins(mins: number): string {
  if (mins === 0) return "";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Description Tab ───────────────────────────────────────────────────────
function DescriptionTab({
  description, thumbnailUrl, whatYoullLearn, requirements,
  instructorName, instructorBio, instructorImage,
}: {
  description: string;
  thumbnailUrl?: string | null;
  whatYoullLearn: string[];
  requirements: string[];
  instructorName?: string | null;
  instructorBio?: string | null;
  instructorImage?: string | null;
}) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-lg font-black text-[var(--text-primary)] mb-3">About This Course</h3>
        <div className="relative">
          <p className="text-[var(--text-secondary)] leading-relaxed text-sm whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>

      {/* What you'll learn */}
      {whatYoullLearn.length > 0 && (
        <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-xl p-6">
          <h3 className="text-base font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)]" /> What You&apos;ll Learn
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {whatYoullLearn.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--text-secondary)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements */}
      {requirements.length > 0 && (
        <div>
          <h3 className="text-base font-black text-[var(--text-primary)] mb-3">Requirements</h3>
          <ul className="space-y-2">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructor */}
      {(instructorName || instructorBio) && (
        <div className="border-t border-[var(--border-soft)] pt-6">
          <h3 className="text-base font-black text-[var(--text-primary)] mb-4">Your Instructor</h3>
          <div className="flex items-start gap-4">
            {instructorImage ? (
              <img src={instructorImage} alt={instructorName || "Instructor"} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[var(--brand-100)] flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-[var(--brand-600)]" />
              </div>
            )}
            <div>
              <p className="font-black text-[var(--text-primary)]">{instructorName}</p>
              {instructorBio && (
                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{instructorBio}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Course Materials Mockup */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 mt-6">
        <h3 className="text-base font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Course Materials
        </h3>
        <div className="space-y-3">
          {[
            { name: "Message for Students", size: "3 KB", icon: FileText, color: "text-red-500" },
            { name: "Course Assets Archive", size: "126 MB", icon: FileText, color: "text-purple-500" }
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-50">
              <div className="flex items-center gap-3">
                <file.icon className={`w-5 h-5 ${file.color}`} />
                <span className="font-bold text-sm text-[var(--text-secondary)]">{file.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--text-tertiary)]">{file.size}</span>
                <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Info Mockup */}
      <div className="bg-[var(--bg-subtle)] border border-[var(--border-strong)] rounded-xl p-6 mt-6">
        <h3 className="text-base font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-500" /> Basic Info
        </h3>
        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)] mt-2 flex-shrink-0" />
            Comprehensive introduction to the course topic including installation, setup, and configuration.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-500)] mt-2 flex-shrink-0" />
            Step-by-step guidance on creating real-world projects and assignments.
          </li>
        </ul>
      </div>

      {/* Intended Audience Mockup */}
      <div className="bg-[var(--bg-subtle)] border border-[var(--border-strong)] rounded-xl p-6 mt-6">
        <h3 className="text-base font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-500" /> Intended Audience
        </h3>
        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            Beginners who want to learn the fundamentals from scratch.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            Professionals looking to upgrade their skills and monetize their expertise.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ─── Curriculum Tab ─────────────────────────────────────────────────────────
function CurriculumTab({
  sections, totalLessons, isOwned,
}: {
  sections: Section[];
  totalLessons: number;
  isOwned: boolean;
}) {
  const [allOpen, setAllOpen] = useState(true);
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  const totalDuration = sections.reduce((sum, s) =>
    sum + s.lessons.reduce((ls, l) => ls + parseDur(l.duration), 0),
  0);

  const toggleAll = () => {
    const newState = !allOpen;
    setAllOpen(newState);
    detailsRefs.current.forEach(ref => {
      if (ref) ref.open = newState;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-[var(--text-secondary)]">
          {sections.length} sections · {totalLessons} lessons
          {totalDuration > 0 && <> · {fmtMins(totalDuration)} total</>}
        </p>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--brand-600)] hover:text-[var(--brand-500)] transition-colors"
        >
          {allOpen ? <ChevronsUp className="w-3.5 h-3.5" /> : <ChevronsDown className="w-3.5 h-3.5" />}
          {allOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-2">
        {sections.length > 0 ? (
          sections.map((section, si) => {
            const sectionDuration = section.lessons.reduce((s, l) => s + parseDur(l.duration), 0);
            return (
              <details
                key={section.id}
                ref={el => { detailsRefs.current[si] = el; }}
                className="group border border-[var(--border-strong)] rounded-xl overflow-hidden"
                open
              >
                <summary className="flex items-center justify-between px-5 py-4 bg-[var(--bg-subtle)] hover:bg-[var(--brand-50)] cursor-pointer select-none list-none transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--brand-600)] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      {si + 1}
                    </span>
                    <span className="font-bold text-[var(--text-primary)] text-sm">{section.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {sectionDuration > 0 && (
                      <span className="text-[10px] text-[var(--text-tertiary)] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {fmtMins(sectionDuration)}
                      </span>
                    )}
                    <span className="text-xs text-[var(--text-tertiary)] font-bold">
                      {section.lessons.length} lessons
                    </span>
                    <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] group-open:rotate-180 transition-transform" />
                  </div>
                </summary>

                <div className="divide-y divide-[var(--border-soft)]">
                  {section.lessons.map((lesson, li) => (
                    <div key={lesson.id} className="flex flex-col px-5 py-3 hover:bg-[var(--brand-50)] transition-colors border-b border-[var(--border-soft)] last:border-0">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-[var(--text-tertiary)] w-5 text-right flex-shrink-0">
                          {si + 1}.{li + 1}
                        </span>
                        {/* Lesson type icon */}
                        {lesson.isFree || isOwned ? (
                          <div className="text-[var(--brand-600)] flex-shrink-0">
                            {lesson.url ? <Video className="w-4 h-4" /> : <Type className="w-4 h-4" />}
                          </div>
                        ) : (
                          <Lock className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                        )}
                        <span className="flex-1 text-sm font-medium text-[var(--text-secondary)]">
                          {lesson.title}
                        </span>
                        {lesson.isFree && !isOwned && (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            PREVIEW
                          </span>
                        )}
                        {lesson.duration && (
                          <span className="text-xs text-[var(--text-tertiary)] font-bold flex-shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lesson.duration}
                          </span>
                        )}
                      </div>
                      {lesson.description && (
                        <div className="mt-2 pl-[3.25rem] text-xs text-[var(--text-secondary)] leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: lesson.description }} className="prose prose-sm max-w-none" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            );
          })
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-[var(--border-strong)] rounded-xl">
            <BookOpen className="w-12 h-12 text-[var(--border-strong)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] font-bold">Content coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FAQ Tab ─────────────────────────────────────────────────────────────────
function FaqTab({ faqs }: { faqs: Faq[] }) {
  const defaultFaqs: Faq[] = [
    { question: "How long do I have access to this course?", answer: "You have lifetime access to this course. Once enrolled, you can watch the lectures at your own pace, anytime, from any device." },
    { question: "Is there a certificate after completion?", answer: "Yes! After completing all lessons, you will receive a certificate of completion that you can share on LinkedIn or other platforms." },
    { question: "Can I get a refund if I'm not satisfied?", answer: "We offer a 30-day satisfaction guarantee. If you're not happy with the course, contact our support team within 30 days of purchase." },
    { question: "Do I need prior knowledge?", answer: "The course is designed to be accessible. Each course clearly states its level (Beginner / Intermediate / Advanced). Check the requirements before enrolling." },
    { question: "How do I access the course after purchase?", answer: "After your payment is verified by the admin (within 24 hours), the course will automatically appear in your 'My Learning' dashboard." },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <div className="space-y-3">
      {displayFaqs.map((faq, i) => (
        <details key={i} className="group border border-[var(--border-strong)] rounded-xl overflow-hidden">
          <summary className="flex items-center justify-between px-5 py-4 bg-white hover:bg-[var(--bg-subtle)] cursor-pointer select-none list-none transition-colors">
            <span className="font-bold text-[var(--text-primary)] text-sm pr-4">{faq.question}</span>
            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-5 pb-4 pt-2 bg-[var(--bg-subtle)] border-t border-[var(--border-soft)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

// ─── Reviews Tab ─────────────────────────────────────────────────────────────
function ReviewsTab({
  courseId, reviews, averageRating, isOwned,
}: {
  courseId: string;
  reviews: Review[];
  averageRating: number;
  isOwned: boolean;
}) {
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  const submitReview = async () => {
    if (!myRating) return alert("Please choose a star rating.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating: myRating, comment: comment || undefined }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSubmitted(true);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayReviews = showAll ? reviews : reviews.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start gap-8 p-5 bg-[var(--bg-subtle)] border border-[var(--border-strong)] rounded-xl">
          <div className="text-center flex-shrink-0">
            <div className="text-5xl font-black text-amber-500">{averageRating.toFixed(1)}</div>
            <StarRating rating={averageRating} />
            <p className="text-xs text-[var(--text-tertiary)] mt-1 font-medium">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {ratingBreakdown.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex gap-0.5 w-20 flex-shrink-0">
                  {Array.from({ length: star }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-[var(--border-soft)] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-bold text-[var(--text-tertiary)] w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit review */}
      {isOwned && !submitted && (
        <div className="border border-[var(--brand-100)] bg-[var(--brand-50)] rounded-xl p-5">
          <h4 className="font-black text-[var(--text-primary)] text-sm mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-[var(--brand-600)]" /> Write a Review
          </h4>
          <div className="mb-3">
            <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">Your Rating</p>
            <StarRating rating={myRating} interactive onRate={setMyRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course…"
            rows={3}
            className="elegant-input text-sm mb-3"
          />
          <button
            onClick={submitReview}
            disabled={submitting || !myRating}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Review
          </button>
        </div>
      )}

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="font-black text-emerald-700 text-sm">Review submitted! Thank you 🙏</p>
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-[var(--border-strong)] rounded-xl">
          <MessageSquare className="w-12 h-12 text-[var(--border-strong)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)] font-bold">No reviews yet</p>
          {isOwned && <p className="text-[var(--text-tertiary)] text-sm mt-1">Be the first to review!</p>}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayReviews.map((review) => (
              <div key={review.id} className="border border-[var(--border-soft)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  {review.user.image ? (
                    <img src={review.user.image} alt={review.user.name || "User"} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[var(--brand-100)] flex items-center justify-center text-xs font-black text-[var(--brand-600)]">
                      {(review.user.name || "U").charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-sm text-[var(--text-primary)]">{review.user.name || "Anonymous"}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">
                    {new Date(review.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
          {reviews.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-center text-sm font-bold text-[var(--brand-600)] hover:text-[var(--brand-500)] py-3 border border-[var(--border-strong)] rounded-xl transition-colors"
            >
              {showAll ? "Show Less" : `View All ${reviews.length} Reviews`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function CourseDetailTabs({
  courseId, description, thumbnailUrl, whatYoullLearn, requirements,
  faqs, sections, reviews, totalLessons, averageRating, isOwned,
  instructorName, instructorBio, instructorImage,
}: Props) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-strong)] mb-7">
        <nav className="flex overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-sm font-black whitespace-nowrap border-b-2 -mb-[2px] transition-all
                  ${active
                    ? "border-[var(--brand-600)] text-[var(--brand-600)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "curriculum" && totalLessons > 0 && (
                  <span className="bg-[var(--brand-100)] text-[var(--brand-700)] text-[10px] font-black px-1.5 py-0.5 rounded-full">{totalLessons}</span>
                )}
                {tab.id === "reviews" && reviews.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">{reviews.length}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "description" && (
          <DescriptionTab
            description={description}
            thumbnailUrl={thumbnailUrl}
            whatYoullLearn={whatYoullLearn}
            requirements={requirements}
            instructorName={instructorName}
            instructorBio={instructorBio}
            instructorImage={instructorImage}
          />
        )}
        {activeTab === "curriculum" && (
          <CurriculumTab sections={sections} totalLessons={totalLessons} isOwned={isOwned} />
        )}
        {activeTab === "faq" && <FaqTab faqs={faqs} />}
        {activeTab === "reviews" && (
          <ReviewsTab
            courseId={courseId}
            reviews={reviews}
            averageRating={averageRating}
            isOwned={isOwned}
          />
        )}
      </div>
    </div>
  );
}
