"use client";

import { useState, useEffect } from "react";
import { Award, Download, Share2, ExternalLink, GraduationCap, Calendar } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/certificates").then(r => r.json()).then(data => {
      setCertificates(data.certificates || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-10">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-10">
      <header className="animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-amber-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">My Certificates</h1>
        </div>
        <p className="text-[var(--text-secondary)] font-medium ml-[52px] text-sm">Certificates earned upon course completion.</p>
      </header>

      {certificates.length === 0 ? (
        <div className="elegant-card p-14 text-center border-dashed animate-fade-up">
          <Award className="w-16 h-16 text-[var(--border-strong)] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-secondary)]">No Certificates Earned Yet</h2>
          <p className="text-[var(--text-tertiary)] mt-2 mb-6 text-sm">
            Complete a course 100% to earn your certificate.
          </p>
          <Link href="/dashboard/learning" className="btn-primary inline-flex items-center gap-2 text-sm">
            <GraduationCap className="w-4 h-4" /> Go to My Courses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {certificates.map((cert: any, i: number) => (
            <div key={cert.id} className="elegant-card overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              {/* Certificate preview */}
              <div className="h-40 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative p-6 flex flex-col justify-between">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-black flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Certificate of Completion
                  </div>
                  <div className="text-white/60 text-[10px] font-bold font-mono">{cert.certCode}</div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-white font-black text-lg leading-tight line-clamp-2">{cert.course?.title}</h3>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-4 mb-4 text-xs font-bold text-[var(--text-tertiary)]">
                  {cert.course?.category && (
                    <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full">{cert.course.category}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(cert.issuedAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="btn-primary flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <button className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
