"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AdminScrollArea({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Reset scroll to top whenever the route changes
  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar"
    >
      <main className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">{children}</main>
    </div>
  );
}
