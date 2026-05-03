"use client";

import { Bell, ChevronDown } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";

export default function DesktopTopBar({
  userName,
  userEmail,
  isMockUser,
}: {
  userName: string;
  userEmail: string;
  isMockUser: boolean;
}) {
  return (
    <div className="hidden md:flex items-center justify-end px-8 py-4 bg-[#F8FAFC]">
      <div className="flex items-center gap-3">
        <NotificationBell isMockUser={isMockUser} />
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <ProfileDropdown userName={userName} userEmail={userEmail} align="bottom" />
      </div>
    </div>
  );
}
