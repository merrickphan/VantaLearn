"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { VantaLogo } from "@/components/branding/VantaLogo";
import { AP_CATEGORY_ORDER, getCoursesGroupedByCategory } from "@/lib/apCategories";
import { useCountdown } from "@/hooks/useTimer";
import { FriendlyCourseIcon } from "@/components/study/FriendlyCourseIcon";

function SidebarCountdown({ examDate }: { examDate: string }) {
  const { days, hours, minutes } = useCountdown(examDate);
  const done = days <= 0 && hours <= 0 && minutes <= 0;
  if (done) return <span className="text-[10px] text-vanta-muted">—</span>;
  return (
    <span className="text-[10px] font-mono tabular-nums rounded px-1 py-0.5 bg-slate-200 text-slate-900">
      {days}d {hours}h {minutes}m
    </span>
  );
}

const LayoutGridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const TrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutGridIcon /> },
  { href: "/study", label: "Study", icon: <BookIcon /> },
  { href: "/dashboard/predictor", label: "Predictor", icon: <TrendIcon /> },
  { href: "/dashboard/progress", label: "Progress", icon: <BarChartIcon /> },
  { href: "/dashboard/settings", label: "Settings", icon: <SettingsIcon /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const coursesByArea = useMemo(() => getCoursesGroupedByCategory(), []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-vanta-bg">
      {/* AP subjects sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-vanta-border bg-vanta-surface/80 fixed left-0 top-0 h-full z-40">
        <div className="p-4 border-b border-vanta-border">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <VantaLogo size={28} variant="command" />
            <span className="font-display font-semibold text-sm tracking-wide text-vanta-text group-hover:text-sky-300 transition-colors">
              VantaLearn
            </span>
          </Link>
          <p className="text-[10px] text-vanta-muted uppercase tracking-widest mt-2">Browse by area</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-3">
          {AP_CATEGORY_ORDER.map((cat) => {
            const courses = coursesByArea[cat.id];
            if (!courses.length) return null;
            return (
              <div key={cat.id}>
                <p className="px-2 mb-1 text-[9px] font-semibold text-vanta-muted uppercase tracking-wider">{cat.label}</p>
                <div className="space-y-0.5">
                  {courses.map((c) => {
                    const href = `/study?subject=${encodeURIComponent(c.name)}`;
                    return (
                      <Link
                        key={c.id}
                        href={href}
                        className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-vanta-surface-hover transition-colors"
                      >
                        <span className="shrink-0 mt-0.5" aria-hidden>
                          <FriendlyCourseIcon courseId={c.id} size={30} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-vanta-text leading-tight truncate">{c.name}</p>
                          <SidebarCountdown examDate={c.examDate} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="p-2 border-t border-vanta-border space-y-0.5">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium transition-colors
                  ${active ? "bg-sky-500/15 text-sky-400" : "text-vanta-muted hover:text-vanta-text hover:bg-vanta-surface-hover"}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full rounded-lg px-2 py-2 text-xs text-vanta-muted hover:text-vanta-error hover:bg-vanta-error/10 transition-colors"
          >
            <LogOutIcon />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[220px]">
        {/* Top command bar */}
        <header className="sticky top-0 z-30 border-b border-vanta-border bg-vanta-bg/90 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 md:px-6">
            <div className="lg:hidden flex items-center gap-2 shrink-0">
              <VantaLogo size={26} variant="command" />
              <span className="font-display font-semibold text-xs tracking-wide text-vanta-text">VantaLearn</span>
            </div>
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-xl mx-auto">
              {mainNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                      ${active ? "text-sky-400 bg-sky-500/10" : "text-vanta-muted hover:text-vanta-text"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex-1 md:flex-none md:w-56">
              <div className="relative">
                <input
                  type="search"
                  readOnly
                  placeholder="Search subjects…"
                  className="w-full bg-vanta-surface-elevated border border-vanta-border rounded-lg py-1.5 pl-8 pr-3 text-xs text-vanta-muted placeholder:text-vanta-muted/50 cursor-default"
                  aria-label="Search (coming soon)"
                />
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-vanta-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-vanta-surface border-t border-vanta-border z-40 flex justify-around safe-area-pb">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-2 text-[10px] font-medium min-w-0 flex-1
                  ${active ? "text-sky-400" : "text-vanta-muted"}`}
              >
                <span className="scale-90">{item.icon}</span>
                <span className="truncate w-full text-center">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
