"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";

export default function MobileTopBar({
  userName,
  userEmail,
  isMockUser,
}: {
  userName: string;
  userEmail: string;
  isMockUser: boolean;
}) {
  const pathname = usePathname();
  const topBarRef = useRef<HTMLDivElement>(null);

  // Hide on course player pages — they have their own header
  const isCoursePlayer = /^\/dashboard\/learning\/[^/]+$/.test(pathname);

  // Scroll the parent container to top when route changes
  // This fixes the "half hidden top bar" when navigating from the More menu
  useEffect(() => {
    const scrollContainer = document.getElementById("dashboard-main-scroll");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [pathname]);

  if (isCoursePlayer) return null;

  return (
    <div
      ref={topBarRef}
      className="flex items-center justify-between md:hidden bg-white/95 backdrop-blur-md border-b border-[var(--border-soft)] px-4 py-3 shrink-0 sticky top-0 z-40"
    >
      <h1 className="text-xl font-black text-[var(--brand-900)] tracking-tight">
        NexusLearn<span className="text-[var(--brand-500)]">.</span>
      </h1>
      <div className="flex items-center gap-2">
        <NotificationBell isMockUser={isMockUser} />
        <ProfileDropdown userName={userName} userEmail={userEmail} align="bottom" />
      </div>
    </div>
  );
}
