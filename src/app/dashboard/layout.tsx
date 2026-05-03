import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Providers } from "@/components/Providers";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";
import MobileTopBar from "./MobileTopBar";
import DesktopTopBar from "./DesktopTopBar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.email === "admin@nexuslearn.com";
  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";

  // Check if current user is a mock user (for notification behavior)
  let isMockUser = false;
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { isMockUser: true },
    });
    isMockUser = user?.isMockUser ?? false;
  } catch (e) {}

  return (
    <Providers>
      <div className="flex h-[100dvh] bg-[var(--bg-main)] overflow-hidden font-sans text-[var(--text-primary)]">
        
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <DesktopSidebar isAdmin={isAdmin} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bars */}
          <MobileTopBar userName={userName} userEmail={userEmail} isMockUser={isMockUser} />
          <DesktopTopBar userName={userName} userEmail={userEmail} isMockUser={isMockUser} />

          {/* Scrollable wrapper — content scrolls independently here */}
          <div id="dashboard-main-scroll" className="flex-1 overflow-y-auto overscroll-contain">
            {/* Scrollable Content */}
            <main className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
              {children}
            </main>
          </div>
        </div>
        {/* Mobile Bottom Navigation */}
        <MobileSidebar isAdmin={isAdmin} />
      </div>
    </Providers>
  );
}
