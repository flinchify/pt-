"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin" },
  { label: "Accounts", href: "/admin/accounts" },
  { label: "Trainers", href: "/admin/trainers" },
  { label: "Gyms", href: "/admin/gyms" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Revenue", href: "/admin/revenue" },
  { label: "Compliance", href: "/admin/compliance" },
];

function isAdminAuthenticated(): boolean {
  if (typeof document === "undefined") return false;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  return cookies.some((c) => c.startsWith("admin_session="));
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuth = isAdminAuthenticated();

  // If not authenticated and not on the login page (admin root), still render children
  // The admin page.tsx handles showing login vs dashboard
  if (!isAuth && pathname !== "/admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="mt-2 text-sm text-navy-400">
            <Link href="/admin" className="text-teal-400 hover:underline">
              Sign in to admin panel
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-navy-950">
      {/* Dark Navy Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-navy-800 bg-navy-950 lg:w-60">
        <div className="flex h-16 items-center gap-2 border-b border-navy-800 px-5">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-teal-400">Anywhere</span>
            <span className="text-white">PT</span>
          </span>
          <span className="ml-auto rounded bg-coral-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral-400">
            Admin
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-teal-600/20 text-teal-300"
                        : "text-navy-400 hover:bg-navy-900 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-navy-800 p-4">
          <button
            onClick={() => {
              document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/admin";
            }}
            className="w-full rounded-lg bg-navy-900 px-3 py-2 text-sm text-navy-400 transition-colors hover:bg-navy-800 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col pl-56 lg:pl-60">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
