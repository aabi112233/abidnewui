import Link from "next/link";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-grid-pattern text-center p-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/60 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-100/60 blur-[120px] pointer-events-none" />

      <div className="elegant-card p-12 max-w-lg w-full relative z-10 animate-fade-up">
        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--brand-600)] to-[var(--accent-teal)] mb-4 leading-none">
          404
        </div>
        <div className="w-16 h-16 bg-[var(--brand-50)] rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 text-[var(--brand-600)] animate-float" />
        </div>
        <h1 className="text-2xl font-black text-[var(--text-primary)] mb-3">Page Not Found</h1>
        <p className="text-[var(--text-secondary)] font-medium mb-8 leading-relaxed">
          Looks like this page took a wrong turn. The page you're looking for doesn't exist or was moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/dashboard" className="btn-secondary flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
