"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";

const DARK_HERO_PATHS = ["/", "/for-trainers", "/for-gyms", "/enterprise", "/pricing"];

const dashboardPaths: Record<string, string> = {
  client: "/dashboard",
  trainer: "/dashboard/trainer",
  gym: "/dashboard/gym",
  enterprise: "/dashboard/enterprise",
  admin: "/dashboard/admin",
};

export function Header() {
  const pathname = usePathname();
  const { user, loading, openLogin, openSignup, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [forTrainersOpen, setForTrainersOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isDarkHero = DARK_HERO_PATHS.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setForTrainersOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setForTrainersOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isTransparent = isDarkHero && !scrolled;

  const headerBg = isTransparent
    ? "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm";

  const textColor = isTransparent ? "text-white" : "text-warm-800";
  const logoColor = isTransparent ? "text-white" : "text-teal-900";

  const handleLogout = useCallback(async () => {
    setUserMenuOpen(false);
    await logout();
  }, [logout]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerBg}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className={`font-display text-xl font-bold tracking-tight ${logoColor}`}
        >
          AnywherePT
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink href="/trainers" active={pathname === "/trainers"} className={textColor}>
            Find Trainers
          </NavLink>

          {/* For Trainers dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setForTrainersOpen(!forTrainersOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
            >
              For Trainers
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${forTrainersOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {forTrainersOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 rounded-xl border border-warm-200 bg-white py-1 shadow-lg">
                <Link
                  href="/for-trainers"
                  className="block px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
                >
                  For Trainers
                </Link>
                <Link
                  href="/for-gyms"
                  className="block px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
                >
                  For Gyms
                </Link>
                <Link
                  href="/enterprise"
                  className="block px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
                >
                  Enterprise
                </Link>
              </div>
            )}
          </div>

          <NavLink href="/pricing" active={pathname === "/pricing"} className={textColor}>
            Pricing
          </NavLink>
          <NavLink href="/about" active={pathname === "/about"} className={textColor}>
            About
          </NavLink>
        </nav>

        {/* Auth / User Menu */}
        <div className="hidden items-center gap-3 lg:flex">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-warm-200" />
          ) : user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">
                  {user.name || user.email.split("@")[0]}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-warm-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-warm-100 px-4 py-2">
                    <p className="text-sm font-semibold text-warm-800">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-warm-500">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700">
                      {user.role}
                    </span>
                  </div>
                  <Link
                    href={dashboardPaths[user.role] || "/dashboard"}
                    className="block px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-warm-700 hover:bg-warm-50"
                  >
                    Settings
                  </Link>
                  <hr className="my-1 border-warm-100" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={openLogin}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
              >
                Log in
              </button>
              <button
                onClick={openSignup}
                className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg lg:hidden ${textColor}`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-warm-100 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <MobileLink href="/trainers" onClick={() => setMobileOpen(false)}>
              Find Trainers
            </MobileLink>
            <MobileLink href="/for-trainers" onClick={() => setMobileOpen(false)}>
              For Trainers
            </MobileLink>
            <MobileLink href="/for-gyms" onClick={() => setMobileOpen(false)}>
              For Gyms
            </MobileLink>
            <MobileLink href="/enterprise" onClick={() => setMobileOpen(false)}>
              Enterprise
            </MobileLink>
            <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>
              Pricing
            </MobileLink>
            <MobileLink href="/about" onClick={() => setMobileOpen(false)}>
              About
            </MobileLink>

            <hr className="my-3 border-warm-100" />

            {loading ? null : user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-warm-800">
                    {user.name || user.email}
                  </p>
                  <span className="text-xs text-warm-500">{user.role}</span>
                </div>
                <MobileLink
                  href={dashboardPaths[user.role] || "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </MobileLink>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openLogin();
                  }}
                  className="flex-1 rounded-lg border border-warm-200 py-2.5 text-center text-sm font-medium text-warm-700"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openSignup();
                  }}
                  className="flex-1 rounded-lg bg-coral-500 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  className,
  children,
}: {
  href: string;
  active: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${className} ${
        active ? "opacity-100" : "opacity-80 hover:opacity-100"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-warm-700 hover:bg-warm-50"
    >
      {children}
    </Link>
  );
}
