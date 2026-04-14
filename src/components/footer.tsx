"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setStatus("loading");

      try {
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("You're subscribed. Welcome to the community.");
          setEmail("");
        } else {
          setStatus("error");
          setMessage(data.error || "Something went wrong. Please try again.");
        }
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    },
    [email]
  );

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-warm-300">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl font-bold text-white"
            >
              AnywherePT
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-warm-400">
              Health is Wealth. Australia&apos;s marketplace connecting people with
              certified personal trainers, anywhere.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex gap-3">
              <SocialLink href="#" label="Facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </SocialLink>
              <SocialLink href="#" label="X / Twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </SocialLink>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-200">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href="/trainers">Find Trainers</FooterLink>
              <FooterLink href="/for-trainers">For Trainers</FooterLink>
              <FooterLink href="/for-gyms">For Gyms</FooterLink>
              <FooterLink href="/enterprise">Enterprise</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-200">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-200">
              Stay Updated
            </h4>
            <p className="mt-4 text-sm text-warm-400">
              Get the latest fitness tips and platform updates.
            </p>
            <form onSubmit={handleSubmit} className="mt-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") {
                      setStatus("idle");
                      setMessage("");
                    }
                  }}
                  placeholder="Your email"
                  required
                  className="min-w-0 flex-1 rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-white placeholder:text-warm-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
                >
                  {status === "loading" ? "..." : "Join"}
                </button>
              </div>
              {message && (
                <p
                  className={`mt-2 text-xs ${
                    status === "success" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-navy-800 pt-8 sm:flex-row">
          <p className="text-sm text-warm-500">
            {currentYear} AnywherePT. All rights reserved.
          </p>
          <p className="text-sm font-medium text-warm-500">
            Health is Wealth
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-warm-400 transition-colors hover:text-teal-400"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-700 text-warm-400 transition-colors hover:border-teal-600 hover:text-teal-400"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  );
}
