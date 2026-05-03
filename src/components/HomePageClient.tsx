"use client";

import Link from "next/link";
import {
  ArrowRight, BookOpen, TrendingUp, Users,
  CheckCircle2, ShieldCheck, PlayCircle, Star, Sparkles,
  Trophy, Heart, HelpCircle, Mail, Phone, MapPin,
  Clock, Globe, Percent, BookMarked, Zap, ChevronDown,
  DollarSign, Award, Flame, Menu, X, Share2,
  MessageCircle, GraduationCap, Target, BarChart3, Layers
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

/* ─── Testimonials Data (Roman Urdu) ─── */
const testimonials = [
  {
    text: "Yaar sach bolu toh pehle mujhe laga scam hoga, lekin ek dost ne bataya toh try kiya. Course ki quality dekh ke shock ho gaya. SEO seekh ke ab 3 clients handle kar raha hoon, alhamdulillah.",
    name: "Usman Tariq",
    role: "SEO Freelancer — Lahore",
  },
  {
    text: "Meri ammi kehti thi phone pe time waste karta hai. Ab jab unhe bataya ke main ghar baith ke 45,000 kama rahi hoon toh bohat khush hain. NexusLearn se graphic design seekhi hai.",
    name: "Nimra Fatima",
    role: "Graphic Designer — Karachi",
  },
  {
    text: "Referral ka system samajh aane mein 2 din lage lekin jab Level 1 ka pehla commission aaya Rs. 5,400 — tab believe hua ke ye real hai. Ab toh 12 log meri team mein hain.",
    name: "Hamza Butt",
    role: "Student — Faisalabad",
  },
  {
    text: "Main housewife hoon aur bacho ko school bhej ke free time mein courses karti hoon. Digital marketing ka course kiya aur ab 2 local shops ka social media handle karti hoon. Har month 30k+.",
    name: "Saima Bibi",
    role: "Homemaker — Rawalpindi",
  },
  {
    text: "Withdrawal ka process bohat simple hai bhai. Maine JazzCash pe request dali aur raat ko paisa aa gaya. Koi jhanjhat nahi, koi hidden charges nahi. Full transparent system hai.",
    name: "Ali Hassan",
    role: "Network Builder — Multan",
  },
  {
    text: "Freelancing ke liye bohat platforms try kiye — YouTube pe videos dekhe, paid courses liye — lekin yahan pe jo structured path mila wo kahin nahi mila. Ab Upwork pe regular orders aa rahe hain.",
    name: "Areeba Khan",
    role: "Content Writer — Islamabad",
  },
  {
    text: "AI tools wala course le ke ChatGPT se kaam seekha. Ab logo ke liye blog posts likhta hoon aur har post ka 1500 leta hoon. Pehle mahine hi investment wapas aa gai.",
    name: "Fahad Sheikh",
    role: "AI Content Creator — Peshawar",
  },
  {
    text: "Support group bohat active hai. Maine raat ko 12 baje ek sawaal poocha aur 15 minute mein senior ne video bana ke bhej di. Ye community feel kahin nahi milti.",
    name: "Zainab Iqbal",
    role: "Community Member — Sialkot",
  },
  {
    text: "Mera chota bhai bhi ab NexusLearn pe hai. Hum dono milke kaam karte hain — main courses karta hoon aur wo network build karta hai. Family business ban gaya hai ye toh!",
    name: "Waqar Ahmed",
    role: "Team Leader — Gujranwala",
  },
];

const testimonialsCol1 = testimonials.slice(0, 3);
const testimonialsCol2 = testimonials.slice(3, 6);
const testimonialsCol3 = testimonials.slice(6, 9);

/* ─── Animated Counter ─── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800, start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(e * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return <div ref={ref}>{val.toLocaleString()}{suffix}</div>;
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="elegant-card p-5 sm:p-6 bg-white cursor-pointer select-none transition-all duration-300"
      style={{ borderColor: open ? "var(--brand-300)" : undefined }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-bold text-[var(--text-primary)] text-sm sm:text-base">{q}</h4>
        <ChevronDown
          className="w-5 h-5 shrink-0 text-[var(--brand-600)] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      {open && (
        <p className="mt-4 text-[var(--text-secondary)] font-medium text-sm leading-relaxed animate-fade-up" style={{ animationDuration: "0.3s" }}>
          {a}
        </p>
      )}
    </div>
  );
}

/* ─── Floating Particles ─── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
      <div className="absolute top-[-10%] right-[-8%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full blur-[130px] opacity-30 animate-slow-spin mix-blend-multiply"
        style={{ background: "radial-gradient(circle, #93c5fd, #a5b4fc)" }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[120px] opacity-25 animate-slow-reverse-spin mix-blend-multiply"
        style={{ background: "radial-gradient(circle, #6ee7b7, #5eead4)" }} />
      <div className="absolute top-[40%] left-[30%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[100px] opacity-[0.18]"
        style={{ background: "radial-gradient(circle, #fde68a, #fca5a5)" }} />
      {[
        { top: "18%", left: "8%", size: 10, delay: "0s", color: "#93c5fd" },
        { top: "55%", left: "5%", size: 6, delay: "1.2s", color: "#6ee7b7" },
        { top: "25%", right: "12%", size: 14, delay: "0.5s", color: "#a5b4fc" },
        { top: "70%", right: "8%", size: 8, delay: "1.8s", color: "#fcd34d" },
        { top: "42%", left: "18%", size: 5, delay: "2.4s", color: "#f9a8d4" },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full animate-float opacity-60"
          style={{
            top: p.top, left: (p as any).left, right: (p as any).right,
            width: p.size * 4, height: p.size * 4,
            background: `radial-gradient(circle at 30% 30%, ${p.color}88, ${p.color}22)`,
            animationDelay: p.delay, animationDuration: `${4 + i * 0.5}s`,
            filter: "blur(1px)",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.025]" />
    </div>
  );
}

/* ─── Income Calculator ─── */
function IncomeCalculator() {
  const [referrals, setReferrals] = useState(10);
  const price = 5000;
  const rates = [0.30, 0.10, 0.07, 0.03];
  const l1 = referrals * price * rates[0];
  const l2 = referrals * 3 * price * rates[1];
  const l3 = referrals * 3 * 3 * price * rates[2];
  const l4 = referrals * 3 * 3 * 3 * price * rates[3];
  const total = l1 + l2 + l3 + l4;

  return (
    <div className="elegant-card p-6 sm:p-8 bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-[var(--text-primary)]">Income Calculator</h3>
          <p className="text-xs text-[var(--text-tertiary)] font-medium">Estimate your potential earnings</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold text-[var(--text-secondary)]">Your Direct Referrals</label>
          <span className="text-sm font-black text-[var(--brand-600)]">{referrals} people</span>
        </div>
        <input
          type="range" min="1" max="50" value={referrals}
          onChange={e => setReferrals(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] font-bold text-[var(--text-tertiary)] mt-1">
          <span>1</span><span>25</span><span>50</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {[
          { label: "Level 1 (30%)", value: l1, color: "bg-blue-500" },
          { label: "Level 2 (10%)", value: l2, color: "bg-purple-500" },
          { label: "Level 3 (7%)", value: l3, color: "bg-pink-500" },
          { label: "Level 4 (3%)", value: l4, color: "bg-emerald-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-[var(--text-secondary)] w-28 shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full transition-all duration-700`}
                style={{ width: `${Math.min((value / (total || 1)) * 100, 100)}%` }} />
            </div>
            <span className="text-sm font-black text-[var(--text-primary)] w-24 text-right">Rs. {value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-center">
        <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Estimated Monthly Earnings</p>
        <p className="text-3xl font-black text-white">Rs. {total.toLocaleString()}</p>
      </div>
    </div>
  );
}

/* ─── Shield Icon ─── */
function Shield({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* ─── Courses mock ─── */
const COURSES_MOCK = [
  { id: "1", title: "Digital Marketing Mastery", price: 3999, originalPrice: 7999, level: "BEGINNER", category: "Marketing", thumbnailUrl: null, duration: "12 hrs", language: "Urdu", shortDescription: "Learn SEO, social media ads, content marketing and grow any business online." },
  { id: "2", title: "AI & Freelancing Pro", price: 5999, originalPrice: 12000, level: "INTERMEDIATE", category: "Technology", thumbnailUrl: null, duration: "18 hrs", language: "Urdu", shortDescription: "Master AI tools like ChatGPT and earn $1000+/month on Fiverr and Upwork." },
  { id: "3", title: "Graphic Design Bootcamp", price: 2999, originalPrice: 5999, level: "BEGINNER", category: "Design", thumbnailUrl: null, duration: "10 hrs", language: "Urdu", shortDescription: "Go from zero to professional designer using Canva, Figma and Adobe suite." },
];

function pctOff(orig: number, disc: number) {
  if (!orig || orig <= disc) return 0;
  return Math.round((1 - disc / orig) * 100);
}

const levelColor: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED: "bg-red-100 text-red-700",
};

/* ═══════════════════════════════════════════
   MAIN HOMEPAGE 
   ═══════════════════════════════════════════ */
export default function HomePage({ courses: serverCourses }: { courses?: typeof COURSES_MOCK }) {
  const courses = serverCourses ?? COURSES_MOCK;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <main className="min-h-screen relative flex flex-col bg-white overflow-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-md border-b border-[var(--border-soft)]" : "bg-white/60 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--brand-900)] tracking-tight">
              NexusLearn<span className="text-[var(--brand-500)]">.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {[["Features", "#features"], ["Courses", "#pricing"], ["How it Works", "#how-it-works"], ["FAQ", "#faq"]].map(([label, href]) => (
              <Link key={label} href={href} className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--brand-600)] transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="btn-primary py-2 sm:py-2.5 px-4 sm:px-6 text-sm shadow-md shadow-blue-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Log In
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[var(--text-secondary)] hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE MENU DRAWER ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-slide-in-right flex flex-col" style={{ animationDuration: '0.25s' }}>
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-soft)]">
              <span className="text-lg font-black text-[var(--brand-900)]">NexusLearn<span className="text-[var(--brand-500)]">.</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-5 space-y-1">
              {[
                ["Features", "#features", Sparkles],
                ["Courses", "#pricing", BookOpen],
                ["How it Works", "#how-it-works", Target],
                ["FAQ", "#faq", HelpCircle],
              ].map(([label, href, Icon]: any) => (
                <Link
                  key={label} href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-600)] transition-colors"
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </nav>
            <div className="p-5 border-t border-[var(--border-soft)] space-y-3">
              <Link href="/login" className="btn-primary w-full text-center block text-sm">Log In</Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-16 sm:pt-36 md:pt-48 md:pb-32 px-4 sm:px-6 overflow-hidden">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border mb-6 sm:mb-8 animate-fade-up"
            style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)", borderColor: "#c7d2fe" }}>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
            <span className="text-xs sm:text-sm font-black text-indigo-700">Empowering 10,000+ Students Across Pakistan</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[var(--text-primary)] leading-[1.05] mb-6 sm:mb-8 animate-fade-up delay-100">
            Master Skills.<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #2563eb 20%, #7c3aed 60%, #0f766e)" }}>
              Build Your Wealth.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-8 sm:mb-12 leading-relaxed font-medium animate-fade-up delay-200 px-2">
            Join the most elite learning network in Pakistan. Access premium digital courses and unlock a revolutionary <strong>4-tier income stream</strong> while you learn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up delay-300 px-4">
            <Link href="/register"
              className="btn-primary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 flex items-center justify-center gap-2 transition-all hover:scale-105"
              style={{ boxShadow: "0 20px 50px -10px rgba(37,99,235,0.4)" }}
            >
              Start Learning Today <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#pricing"
              className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 flex items-center justify-center hover:bg-white hover:text-[var(--brand-600)] border-2 transition-all"
            >
              Explore Packages
            </Link>
          </div>

          <div className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto border-t border-[var(--border-soft)] pt-8 sm:pt-12 animate-fade-up delay-500">
            {[
              { label: "Live Courses", end: courses.length || 8, suffix: "", color: "text-[var(--text-primary)]" },
              { label: "Paid Out (Rs.)", end: 5, suffix: "M+", color: "text-[var(--brand-600)]" },
              { label: "Active Users", end: 15, suffix: "k+", color: "text-[var(--text-primary)]" },
              { label: "Rating", end: 49, suffix: "/5", color: "text-[var(--accent-teal)]" },
            ].map(({ label, end, suffix, color }) => (
              <div key={label}>
                <div className={`text-2xl sm:text-3xl font-black ${color}`}>
                  <Counter end={end} suffix={suffix} />
                </div>
                <div className="text-[10px] sm:text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST MARQUEE ─── */}
      <div className="w-full bg-slate-50 border-y border-[var(--border-soft)] py-4 sm:py-5 overflow-hidden relative z-10">
        <div className="flex items-center gap-8 sm:gap-12 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 sm:gap-12 font-black text-[var(--text-tertiary)] text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-60">
              {[
                [Trophy, "Multi-Level Rewards"],
                [ShieldCheck, "Secure Payments"],
                [Star, "Certified Courses"],
                [Users, "Community Support"],
                [PlayCircle, "Instant Access"],
                [Zap, "Live Mentorship"],
              ].map(([Icon, text], j) => (
                <span key={j} className="flex items-center gap-2 sm:gap-3">
                  {/* @ts-ignore */}
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {text as string}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4"
              style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)", color: "#4f46e5" }}>
              <Sparkles className="w-3.5 h-3.5" /> Why NexusLearn?
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">
              Everything you need to succeed.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: BookOpen, title: "Premium Content", desc: "Expert-curated courses in Digital Marketing, Freelancing, and Tech.", color: "#2563eb", bg: "#eff6ff", glow: "rgba(37,99,235,0.12)" },
              { icon: TrendingUp, title: "4-Level Earnings", desc: "Earn commissions when you invite, and when your invites invite others — 4 levels deep.", color: "#7c3aed", bg: "#f5f3ff", glow: "rgba(124,58,237,0.12)" },
              { icon: Heart, title: "Lifetime Support", desc: "Get access to exclusive Discord groups and weekly live mentorship sessions with experts.", color: "#db2777", bg: "#fdf2f8", glow: "rgba(219,39,119,0.12)" },
              { icon: GraduationCap, title: "Certificates", desc: "Earn verifiable certificates upon course completion to showcase your skills.", color: "#059669", bg: "#ecfdf5", glow: "rgba(5,150,105,0.12)" },
              { icon: Layers, title: "Structured Learning", desc: "Step-by-step courses with video lessons, quizzes, and progress tracking.", color: "#b45309", bg: "#fffbeb", glow: "rgba(180,83,9,0.12)" },
              { icon: MessageCircle, title: "Community", desc: "Join 5,000+ learners in our active community. Network, share, and grow together.", color: "#0891b2", bg: "#ecfeff", glow: "rgba(8,145,178,0.12)" },
            ].map((feat, i) => (
              <div key={i} className="elegant-card p-6 sm:p-10 group animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 sm:mb-8 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: feat.bg, boxShadow: `0 0 0 0 ${feat.glow}` }}>
                  <feat.icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: feat.color }} />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mb-2 sm:mb-4">{feat.title}</h4>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-16 grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {[
              { icon: DollarSign, label: "4-Tier Income", color: "#2563eb" },
              { icon: Shield, label: "100% Secure", color: "#0f766e" },
              { icon: Award, label: "Certifications", color: "#b45309" },
              { icon: Flame, label: "Trending Skills", color: "#dc2626" },
              { icon: Globe, label: "Learn Anywhere", color: "#7c3aed" },
              { icon: Users, label: "5k+ Community", color: "#db2777" },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-[var(--border-soft)] hover:border-[var(--brand-200)] transition-all group animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" style={{ color }} />
                <span className="text-[8px] sm:text-[10px] font-bold text-[var(--text-secondary)] text-center uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURSES / PRICING ─── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 relative z-10 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8faff 0%, #f1f5ff 60%, #fff 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4"
              style={{ background: "#fef9c3", color: "#a16207" }}>
              <Star className="w-3.5 h-3.5" /> Pricing & Packages
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-4">Choose Your Path</h2>
            <p className="text-[var(--text-secondary)] font-medium max-w-2xl mx-auto text-sm sm:text-base">One-time payment for lifetime access and affiliate status.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {courses.map((course: any, index: number) => {
              const pct = pctOff(course.originalPrice ?? 0, course.price);
              const lvl = course.level ?? "BEGINNER";
              const isPopular = index === 1;
              return (
                <div key={course.id}
                  className="elegant-card flex flex-col bg-white overflow-hidden group animate-fade-up relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    border: isPopular ? "2px solid #2563eb" : undefined,
                    boxShadow: isPopular ? "0 20px 60px -15px rgba(37,99,235,0.25)" : undefined,
                  }}>
                  {isPopular && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />}
                  {isPopular && <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">🔥 Most Popular</div>}

                  <div className="relative h-36 sm:h-44 overflow-hidden" style={{ background: "linear-gradient(135deg, #1d4ed8, #4f46e5)" }}>
                    {course.thumbnailUrl
                      ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><BookMarked className="w-12 h-12 sm:w-16 sm:h-16 text-white/20" /></div>
                    }
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${levelColor[lvl] ?? "bg-gray-100 text-gray-600"}`}>
                        {lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                      </span>
                      {pct > 0 && (
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-red-500 text-white flex items-center gap-1">
                          <Percent className="w-3 h-3" />{pct}% OFF
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Lifetime</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7 flex-1 flex flex-col">
                    {course.category && <p className="text-[10px] font-bold text-[var(--brand-500)] uppercase tracking-widest mb-1">{course.category}</p>}
                    <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mb-2 leading-tight">{course.title}</h3>
                    <p className="text-[var(--text-secondary)] text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed line-clamp-2">
                      {course.shortDescription || course.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                      {course.duration && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-[var(--border-soft)] px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />{course.duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-[var(--border-soft)] px-2 py-0.5 rounded-full">
                        <Globe className="w-3 h-3" />{course.language ?? "Urdu"}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-tertiary)] bg-slate-50 border border-[var(--border-soft)] px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3" /> 4.9
                      </span>
                    </div>

                    <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-7">
                      {["4-Tier Affiliate Link", "Exclusive Community Access", "Weekly Live Training", "Course Certificate"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-baseline gap-2 mb-4 sm:mb-6 mt-auto">
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="text-base sm:text-lg font-bold text-[var(--text-tertiary)] line-through">Rs. {course.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="text-2xl sm:text-3xl font-black text-[var(--brand-700)]">Rs. {course.price.toLocaleString()}</span>
                    </div>

                    <Link href={`/register?courseId=${course.id}`}
                      className="w-full h-12 sm:h-14 flex items-center justify-center text-sm sm:text-base font-bold rounded-xl transition-all group-hover:scale-[1.02]"
                      style={{
                        background: isPopular ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#1e40af",
                        color: "#fff",
                        boxShadow: isPopular ? "0 10px 30px -8px rgba(37,99,235,0.5)" : "0 8px 20px -6px rgba(30,64,175,0.3)",
                      }}>
                      Enroll & Start Earning <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS + INCOME CALCULATOR ─── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-start">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6"
                style={{ background: "#ecfdf5", color: "#065f46" }}>
                <TrendingUp className="w-3.5 h-3.5" /> The Success Path
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-8 sm:mb-10 tracking-tight leading-tight">
                From Learning to <span className="text-[var(--brand-600)]">Earning</span> in 3 Simple Steps.
              </h2>

              <div className="space-y-0">
                {[
                  { step: "01", title: "Select Your Package", desc: "Choose a course that fits your interest and pay a one-time fee.", color: "#2563eb" },
                  { step: "02", title: "Learn Premium Skills", desc: "Watch high-quality videos and master in-demand digital skills at your own pace.", color: "#7c3aed" },
                  { step: "03", title: "Share & Earn Big", desc: "Use your unique link to invite others and earn passive income up to 4 levels deep.", color: "#0f766e" },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 group pb-6 sm:pb-8 border-b border-[var(--border-soft)] last:border-0 last:pb-0 pt-6 sm:pt-8 first:pt-0">
                    <div className="text-3xl sm:text-4xl font-black transition-colors duration-300 shrink-0 w-10 sm:w-14 text-right"
                      style={{ color: "#e2e8f0" }}>{s.step}</div>
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mb-2">{s.title}</h4>
                      <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Income Calculator */}
            <div className="animate-fade-up delay-200">
              <IncomeCalculator />

              {/* Earnings mockup card */}
              <div className="elegant-card p-4 rounded-3xl overflow-hidden shadow-xl mt-6 bg-white">
                <div className="p-5 sm:p-6 rounded-2xl text-white space-y-4" style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)" }}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Your Network Earnings</div>
                      <div className="text-2xl sm:text-3xl font-black">Rs. 84,500</div>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { l: "Level 1 (Direct)", e: "Rs. 40,000", p: "80%", c: "from-blue-500 to-indigo-500" },
                      { l: "Level 2 (Indirect)", e: "Rs. 25,000", p: "60%", c: "from-violet-500 to-purple-600" },
                      { l: "Level 3", e: "Rs. 12,000", p: "40%", c: "from-pink-500 to-rose-500" },
                      { l: "Level 4", e: "Rs. 7,500", p: "30%", c: "from-emerald-400 to-teal-500" },
                    ].map((row, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] sm:text-xs font-bold">
                          <span className="text-white/70">{row.l}</span>
                          <span className="text-white">{row.e}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${row.c} rounded-full`} style={{ width: row.p }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-white/50">Updated live</span>
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Growing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10" style={{ background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4"
              style={{ background: "#fdf4ff", color: "#7e22ce" }}>
              <Star className="w-3.5 h-3.5" /> Success Stories
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">Hamare Students Kya Kehte Hain</h2>
            <p className="text-[var(--text-secondary)] font-medium mt-4 max-w-lg mx-auto text-sm sm:text-base">Real feedback from our growing community across Pakistan.</p>
          </div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={testimonialsCol1} duration={15} />
            <TestimonialsColumn testimonials={testimonialsCol2} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={testimonialsCol3} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 bg-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm"
              style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
              <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--brand-600)]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-4">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium">Everything you need to know about the network.</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { q: "How do I get my referral code?", a: "Once you purchase any package and your payment is approved by the admin, your unique referral code will be visible on your Dashboard." },
              { q: "Is this a one-time fee?", a: "Yes! There are no monthly subscriptions. You pay once for lifetime access to the course and the affiliate network." },
              { q: "How do I withdraw my earnings?", a: "You can request a withdrawal from your Wallet page. Admins process withdrawal requests within 24-48 hours." },
              { q: "What if I don't invite anyone?", a: "That's fine! You still keep lifetime access to your courses. The referral network is an optional earning opportunity." },
              { q: "What payment methods are accepted?", a: "We accept Easypaisa, JazzCash, and bank transfers. Payment instructions are shown after you select a package." },
              { q: "How does the 4-tier commission work?", a: "When someone joins using your link, you earn Level 1 commission (30%). When they invite someone, you earn Level 2 (10%). It goes 4 levels deep — Level 3 at 7% and Level 4 at 3%." },
              { q: "Can I earn without buying a course?", a: "No, you need to purchase at least one course to activate your referral code and start earning commissions." },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl sm:rounded-[60px] p-8 sm:p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 40%, #0f766e 100%)" }}>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/8 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-black mb-6 sm:mb-8">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Pakistan&apos;s Unique E-Learning & Earning Platform
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 sm:mb-8 leading-tight">
                Ready to build<br />your future?
              </h2>
              <p className="text-base sm:text-xl text-blue-100 mb-8 sm:mb-12 font-medium">
                Join thousands of students and start your journey towards financial independence today.
              </p>
              <Link href="/register"
                className="inline-flex items-center justify-center w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-xl font-black rounded-2xl transition-all hover:scale-105"
                style={{ background: "#fff", color: "#1d4ed8", boxShadow: "0 20px 50px -10px rgba(0,0,0,0.3)" }}>
                Get Started Now <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-[var(--border-soft)] pt-12 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-20">
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-[var(--brand-900)]">NexusLearn.</span>
              </Link>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium max-w-xs mb-6 sm:mb-8">
                Pakistan&apos;s leading platform for learning digital skills and building a recursive income stream.
              </p>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
                  { label: "Twitter", svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 3h6l14 18H16z" /><path d="M4 21l7-7M17 3l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg> },
                  { label: "Instagram", svg: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg> },
                  { label: "YouTube", svg: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="white"/></svg> },
                ].map(({ label, svg }) => (
                  <a key={label} href="#" aria-label={label} className="w-10 h-10 rounded-xl bg-slate-50 border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--brand-600)] hover:border-[var(--brand-300)] transition-all">
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-black text-[var(--text-primary)] uppercase tracking-wider text-xs mb-4 sm:mb-6">Quick Links</h5>
              <ul className="space-y-3 sm:space-y-4">
                {[["Home", "/"], ["Features", "#features"], ["Courses", "#pricing"], ["FAQ", "#faq"], ["Login", "/login"], ["Register", "/register"]].map(([l, href]) => (
                  <li key={l}>
                    <Link href={href} className="text-sm text-[var(--text-secondary)] font-bold hover:text-[var(--brand-600)] transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black text-[var(--text-primary)] uppercase tracking-wider text-xs mb-4 sm:mb-6">Contact Us</h5>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)]"><Mail className="w-4 h-4 text-[var(--brand-500)] shrink-0" /> support@nexuslearn.com</li>
                <li className="flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)]"><Phone className="w-4 h-4 text-[var(--brand-500)] shrink-0" /> +92 300 0000000</li>
                <li className="flex items-center gap-3 text-sm font-bold text-[var(--text-secondary)]"><MapPin className="w-4 h-4 text-[var(--brand-500)] shrink-0" /> Lahore, Pakistan</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border-soft)] pt-6 sm:pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="text-[var(--text-tertiary)] text-[10px] sm:text-xs font-bold uppercase tracking-widest">© 2026 NexusLearn. All rights reserved.</div>
            <div className="flex gap-4 sm:gap-8 text-[var(--text-tertiary)] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <Link href="#" className="hover:text-[var(--text-primary)]">Terms</Link>
              <Link href="#" className="hover:text-[var(--text-primary)]">Privacy</Link>
              <Link href="#" className="hover:text-[var(--text-primary)]">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── WhatsApp Float Button ─── */}
      <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Chat on WhatsApp">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </main>
  );
}
