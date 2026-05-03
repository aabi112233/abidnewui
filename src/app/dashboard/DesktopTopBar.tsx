"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";
import { useState } from "react";

export default function DesktopTopBar({
  userName,
  userEmail,
  isMockUser,
}: {
  userName: string;
  userEmail: string;
  isMockUser: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="learnova-topbar">
      {/* Search Bar */}
      <div className="learnova-search-wrapper">
        <Search className="learnova-search-icon" />
        <input
          type="text"
          placeholder="Search courses, lessons, resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="learnova-search-input"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <NotificationBell isMockUser={isMockUser} />
        <div className="h-8 w-px bg-slate-200 mx-1" />
        <ProfileDropdown userName={userName} userEmail={userEmail} align="bottom" />
      </div>
    </div>
  );
}
