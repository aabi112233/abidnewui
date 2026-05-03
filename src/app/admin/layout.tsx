import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminMobileTopBar from "./components/AdminMobileTopBar";
import AdminScrollArea from "./components/AdminScrollArea";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.email !== "admin@nexuslearn.com") {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-[100dvh] bg-[var(--bg-main)] overflow-hidden font-sans text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile Top Bar */}
        <AdminMobileTopBar />

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-8 h-[56px] border-b border-[var(--border-soft)] bg-white/80 backdrop-blur-sm shrink-0">
          <div />
          <span className="text-sm font-bold text-[var(--text-tertiary)]">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Scrollable Content — auto-scrolls to top on route change */}
        <AdminScrollArea>{children}</AdminScrollArea>
      </div>
    </div>
  );
}
