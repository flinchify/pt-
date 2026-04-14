"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "client" | "trainer" | "gym" | "enterprise" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  role: Role;
  children: ReactNode;
}

const navByRole: Record<Role, NavItem[]> = {
  client: [
    { label: "Overview", href: "/dashboard", icon: <HomeIcon /> },
    { label: "Bookings", href: "/dashboard/bookings", icon: <CalendarIcon /> },
    { label: "My Trainers", href: "/dashboard/trainers", icon: <UsersIcon /> },
    { label: "Progress", href: "/dashboard/progress", icon: <ChartIcon /> },
    { label: "Goals", href: "/dashboard/goals", icon: <TargetIcon /> },
    { label: "Messages", href: "/dashboard/messages", icon: <MessageIcon /> },
    { label: "Settings", href: "/dashboard/settings", icon: <GearIcon /> },
  ],
  trainer: [
    { label: "Overview", href: "/dashboard/trainer", icon: <HomeIcon /> },
    { label: "Bookings", href: "/dashboard/trainer/bookings", icon: <CalendarIcon /> },
    { label: "Clients", href: "/dashboard/trainer/clients", icon: <UsersIcon /> },
    { label: "Availability", href: "/dashboard/trainer/availability", icon: <ClockIcon /> },
    { label: "Earnings", href: "/dashboard/trainer/earnings", icon: <DollarIcon /> },
    { label: "Reviews", href: "/dashboard/trainer/reviews", icon: <StarIcon /> },
    { label: "Profile", href: "/dashboard/trainer/profile", icon: <UserIcon /> },
    { label: "Messages", href: "/dashboard/trainer/messages", icon: <MessageIcon /> },
    { label: "Settings", href: "/dashboard/trainer/settings", icon: <GearIcon /> },
  ],
  gym: [
    { label: "Overview", href: "/dashboard/gym", icon: <HomeIcon /> },
    { label: "Trainers", href: "/dashboard/gym/trainers", icon: <UsersIcon /> },
    { label: "Bookings", href: "/dashboard/gym/bookings", icon: <CalendarIcon /> },
    { label: "Earnings", href: "/dashboard/gym/earnings", icon: <DollarIcon /> },
    { label: "Profile", href: "/dashboard/gym/profile", icon: <UserIcon /> },
    { label: "Settings", href: "/dashboard/gym/settings", icon: <GearIcon /> },
  ],
  enterprise: [
    { label: "Overview", href: "/dashboard/enterprise", icon: <HomeIcon /> },
    { label: "Employees", href: "/dashboard/enterprise/employees", icon: <UsersIcon /> },
    { label: "Bookings", href: "/dashboard/enterprise/bookings", icon: <CalendarIcon /> },
    { label: "Analytics", href: "/dashboard/enterprise/analytics", icon: <ChartIcon /> },
    { label: "Billing", href: "/dashboard/enterprise/billing", icon: <DollarIcon /> },
    { label: "Settings", href: "/dashboard/enterprise/settings", icon: <GearIcon /> },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: <HomeIcon /> },
    { label: "Users", href: "/dashboard/admin/users", icon: <UsersIcon /> },
    { label: "Trainers", href: "/dashboard/admin/trainers", icon: <UserIcon /> },
    { label: "Gyms", href: "/dashboard/admin/gyms", icon: <BuildingIcon /> },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: <CalendarIcon /> },
    { label: "Revenue", href: "/dashboard/admin/revenue", icon: <DollarIcon /> },
    { label: "Reviews", href: "/dashboard/admin/reviews", icon: <StarIcon /> },
    { label: "Settings", href: "/dashboard/admin/settings", icon: <GearIcon /> },
  ],
};

export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const items = navByRole[role] || navByRole.client;

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Mobile header bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-warm-200 bg-white px-4 lg:hidden">
        <Link href="/" className="font-display text-lg font-bold text-teal-900">
          AnywherePT
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-warm-600 hover:bg-warm-100"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar backdrop (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-30 h-full w-64 transform border-r border-warm-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center border-b border-warm-100 px-5">
            <Link
              href="/"
              className="font-display text-lg font-bold text-teal-900"
            >
              AnywherePT
            </Link>
          </div>

          <nav className="flex flex-col gap-0.5 p-3">
            {items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-warm-600 hover:bg-warm-50 hover:text-warm-800"
                  }`}
                >
                  <span
                    className={
                      isActive ? "text-teal-600" : "text-warm-400"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-warm-100 p-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-warm-500 hover:bg-warm-50 hover:text-warm-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to site
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/* ---- Icon components ---- */

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <line x1="8" y1="6" x2="8" y2="6.01" />
      <line x1="16" y1="6" x2="16" y2="6.01" />
      <line x1="12" y1="6" x2="12" y2="6.01" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
    </svg>
  );
}
