"use client";
import React from "react";
import { motion } from "motion/react";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #3b82f6, #2563eb)",
  "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #14b8a6, #0d9488)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #ef4444, #dc2626)",
  "linear-gradient(135deg, #06b6d4, #0891b2)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #6366f1, #4f46e5)",
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: {
    text: string;
    name: string;
    role: string;
  }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role }, i) => {
                const initials = name.split(" ").map(w => w[0]).join("").toUpperCase();
                const gradient = AVATAR_GRADIENTS[(index * 3 + i) % AVATAR_GRADIENTS.length];
                return (
                  <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 max-w-xs w-full" key={i}>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, s) => (
                        <svg key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-sm text-slate-600 font-medium leading-relaxed italic">&ldquo;{text}&rdquo;</div>
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md"
                        style={{ background: gradient }}
                      >
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="font-bold text-sm text-slate-900 tracking-tight leading-5">{name}</div>
                        <div className="text-xs text-slate-400 font-semibold leading-5 tracking-tight">{role}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
