import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Users, ChevronRight, User, ArrowRight, BookOpen, Heart, Share2 } from "lucide-react";
import CourseDetailTabs from "./CourseDetailTabs";
import CourseDetailClient from "./CourseDetailClient";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  let courseId: string;
  try {
    const p = await params;
    courseId = p.courseId;
  } catch {
    notFound();
  }

  if (!courseId) notFound();

  const session = await auth();

  let course: any = null;
  let popularCourses: any[] = [];

  try {
    [course, popularCourses] = await Promise.all([
      prisma.course.findUnique({
        where: { id: courseId, isActive: true },
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: { lessons: { orderBy: { order: "asc" } } },
          },
          reviews: {
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      }),
      prisma.course.findMany({
        where: { isActive: true, id: { not: courseId } },
        orderBy: { enrolledCount: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          rating: true,
          price: true,
          originalPrice: true,
          category: true,
          instructorName: true,
          reviews: { select: { id: true } },
        },
      }),
    ]);
  } catch (err) {
    console.error("CourseDetailPage DB error:", err);
    notFound();
  }

  if (!course) notFound();

  // Check ownership
  let isOwned = false;
  if (session?.user?.email) {
    try {
      const purchase = await prisma.purchase.findFirst({
        where: {
          user: { email: session.user.email },
          status: "APPROVED",
          OR: [
            { itemType: "COURSE", courseId },
            { itemType: "BUNDLE", bundle: { courses: { some: { courseId } } } },
          ],
        },
      });
      isOwned = !!purchase;
    } catch {
      isOwned = false;
    }
  }

  const sections = course.sections || [];
  const totalLessons = sections.reduce((s: number, sec: any) => s + sec.lessons.length, 0);

  // Parse JSON fields safely
  const parseJSON = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
  };

  const whatYoullLearn = parseJSON(course.whatYoullLearn);
  const requirements = parseJSON(course.requirements);
  const faqs = parseJSON((course as any).faqs);

  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const avgRating =
    course.reviews.length > 0
      ? course.reviews.reduce((s: number, r: any) => s + r.rating, 0) / course.reviews.length
      : course.rating;

  return (
    <div className="max-w-[100vw] overflow-x-hidden">
      {/* ━━━ HERO SECTION ━━━ */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-200 -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 mb-8 sm:mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          
          {/* Breadcrumb */}
          <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8">
            <Link href="/dashboard/store" className="hover:text-[var(--brand-600)] transition-colors font-medium">
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            {course.category && (
              <>
                <span className="text-slate-400 font-medium">{course.category}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
            <span className="text-slate-700 font-semibold truncate max-w-[150px] sm:max-w-none">{course.title}</span>
          </nav>
          
          <div className="max-w-4xl">
            {/* Category badges */}
            {course.category && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[var(--brand-600)] text-sm font-bold uppercase tracking-wide">{course.category}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                  course.level === "BEGINNER" ? "bg-emerald-500 text-white" :
                  course.level === "INTERMEDIATE" ? "bg-amber-500 text-white" :
                  "bg-red-500 text-white"
                }`}>
                  {course.level}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] mb-6">
              {course.title}
            </h1>

            {/* Description snippet */}
            {course.shortDescription && (
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                {course.shortDescription}
              </p>
            )}

            {/* Instructor + Stats */}
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8">
              <div className="flex items-center gap-3">
                {course.instructorImage ? (
                  <img src={course.instructorImage} alt={course.instructorName || "Instructor"} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-white shadow-sm">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Instructor</p>
                  <p className="text-sm font-bold text-slate-900">{course.instructorName || "Expert Instructor"}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1.5">Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-slate-900">{avgRating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1.5">Enrolled</p>
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    {course.enrolledCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions row — Wishlist + Share (competitor pattern) */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 border border-slate-200 px-4 py-2 rounded-lg cursor-pointer hover:text-red-500 hover:border-red-200 transition-colors">
                <Heart className="w-4 h-4" /> Add to wishlist
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 border border-slate-200 px-4 py-2 rounded-lg cursor-pointer hover:text-[var(--brand-600)] hover:border-blue-200 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ MAIN CONTENT ━━━ */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* LEFT: Tabbed Content */}
          <div className="w-full lg:flex-1 order-2 lg:order-1 min-w-0">
            <CourseDetailTabs
              courseId={courseId}
              description={course.description}
              thumbnailUrl={course.thumbnailUrl}
              whatYoullLearn={whatYoullLearn}
              requirements={requirements}
              faqs={faqs}
              sections={sections as any}
              reviews={course.reviews as any}
              totalLessons={totalLessons}
              averageRating={avgRating}
              isOwned={isOwned}
              instructorName={course.instructorName}
              instructorBio={course.instructorBio}
              instructorImage={course.instructorImage}
            />
          </div>

          {/* RIGHT: Sticky Sidebar */}
          <div className="w-full lg:w-[360px] xl:w-[400px] order-1 lg:order-2 flex-shrink-0 lg:sticky lg:top-6">
            <CourseDetailClient
              courseId={courseId}
              courseTitle={course.title}
              price={course.price}
              originalPrice={course.originalPrice || undefined}
              discount={discount}
              isOwned={isOwned}
              totalLessons={totalLessons}
              duration={course.duration || undefined}
              level={course.level}
              language={course.language || "Urdu"}
              thumbnailUrl={course.thumbnailUrl || undefined}
              enrolledCount={course.enrolledCount}
            />
          </div>
        </div>

        {/* ━━━ BOTTOM: Popular Courses ━━━ */}
        {popularCourses.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Featured Courses</h3>
                <p className="text-slate-500 text-sm mt-1">Hand-picked courses to help you grow your skills.</p>
              </div>
              <Link href="/dashboard/store" className="hidden sm:flex items-center gap-2 text-sm font-bold text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCourses.map((c) => {
                const cDiscount = c.originalPrice ? Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100) : 0;
                return (
                  <Link key={c.id} href={`/dashboard/store/${c.id}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col">
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      {c.thumbnailUrl ? (
                        <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-slate-200" />
                        </div>
                      )}
                      {cDiscount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                          -{cDiscount}%
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-[10px] font-black text-[var(--brand-600)] uppercase tracking-wider mb-2">{c.category || "Course"}</p>
                      <h4 className="font-bold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-[var(--brand-600)] transition-colors">{c.title}</h4>
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= Math.round(c.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-400">({c.reviews?.length || 0})</span>
                      </div>
                      <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-slate-900">Rs. {c.price}</span>
                          {c.originalPrice && <span className="text-xs text-slate-400 line-through">Rs. {c.originalPrice}</span>}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[var(--brand-600)] group-hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <Link href="/dashboard/store" className="sm:hidden flex items-center justify-center gap-2 mt-8 py-4 bg-slate-50 rounded-xl text-sm font-bold text-slate-600">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
