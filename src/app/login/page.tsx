"use client";

import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      // Admin users go to admin panel, regular users go to dashboard
      const destination = email.trim().toLowerCase() === "admin@nexuslearn.com"
        ? "/admin"
        : "/dashboard";
      router.push(destination);
    }
  };

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[var(--brand-900)] via-[var(--brand-600)] to-[var(--accent-teal)] relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6 animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">NexusLearn<span className="text-white/60">.</span></h1>
          <p className="text-xl text-white/80 font-medium leading-relaxed max-w-sm mx-auto">
            Pakistan's premier invite-only learning platform with a powerful 4-level affiliate network.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[["40%", "Level 1 bonus"], ["20%", "Level 2 bonus"], ["10%", "Level 3 bonus"]].map(([pct, label]) => (
              <div key={pct} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-black">{pct}</div>
                <div className="text-xs opacity-70 font-semibold mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-grid-pattern">
        <div className="absolute top-6 left-6">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium bg-white/80 py-2 px-4 rounded-full shadow-sm border border-[var(--border-strong)] text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand-600)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-[var(--text-primary)] mb-2">Welcome Back</h2>
            <p className="text-[var(--text-secondary)] font-medium">Sign in to access your learning dashboard.</p>
          </div>

          {isRegistered && (
            <div className="p-4 mb-6 bg-green-50 border border-green-200 border-l-4 border-l-green-500 rounded-xl text-green-700 text-sm font-bold">
              🎉 Account created! Your payment is under review. Please log in.
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-l-red-500 text-red-700 text-sm font-bold rounded-r-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="elegant-input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Password</label>
              <div className="input-icon-wrapper">
                <Lock className="icon-left" />
                <input
                  type={showPass ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="elegant-input has-icon-left pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-12 text-base mt-2 shadow-[0_8px_30px_-8px_rgba(37,99,235,0.5)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing In...
                </span>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Sign In Securely</>
              )}
            </button>
          </form>

          <p className="text-center text-[var(--text-secondary)] mt-8 text-sm font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="text-[var(--brand-600)] font-bold hover:text-[var(--brand-500)] transition-colors">
              Sign Up →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-[var(--brand-500)]">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
