"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimateIn } from "@/components/animate-in";

export default function ForTrainersPage() {
  const [sessionsPerWeek, setSessionsPerWeek] = useState(10);
  const avgRate = 80;
  const platformFee = 0.15;
  const weeklyGross = sessionsPerWeek * avgRate;
  const monthlyGross = weeklyGross * 4.33;
  const monthlyNet = monthlyGross * (1 - platformFee);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 py-24 sm:py-32">
        <div className="hero-grid-pattern absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">For Personal Trainers</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Grow Your Training Business with AnywherePT
            </h1>
            <p className="mt-6 text-lg text-teal-200/80">
              Join hundreds of trainers who are building their client base, managing their schedule, and earning more through Australia&apos;s leading trainer marketplace.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup?role=trainer" className="rounded-xl bg-coral-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600">
                Apply to Join
              </Link>
              <Link href="/contact" className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-warm-900 sm:text-4xl">Why Join AnywherePT?</h2>
              <p className="mt-4 text-warm-500">Everything you need to grow and manage your personal training business, all in one place.</p>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "More Clients",
                desc: "Get discovered by thousands of people looking for personal trainers in your area. Our matching algorithm connects you with ideal clients.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                title: "Easy Scheduling",
                desc: "Set your availability once and let clients book around your schedule. Automatic reminders and calendar sync keep everything on track.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                title: "Secure Payments",
                desc: "Get paid on time, every time. Payments are processed securely through Stripe and deposited directly to your bank account weekly.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                ),
              },
              {
                title: "Your Profile",
                desc: "Showcase your qualifications, experience, photos, and reviews on a professional profile page that ranks in search engines.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 100}>
                <div className="rounded-2xl border border-warm-100 bg-white p-6 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-warm-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-500">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="border-y border-warm-200/60 bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn>
              <div>
                <h2 className="font-display text-3xl font-bold text-warm-900">Earnings Calculator</h2>
                <p className="mt-3 text-warm-500">
                  See how much you could earn on AnywherePT. Adjust the slider to match your availability.
                </p>
                <div className="mt-8">
                  <label className="text-sm font-semibold text-warm-700">
                    Sessions per week: {sessionsPerWeek}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={sessionsPerWeek}
                    onChange={(e) => setSessionsPerWeek(parseInt(e.target.value))}
                    className="mt-2 w-full accent-teal-600"
                  />
                  <div className="mt-1 flex justify-between text-xs text-warm-400">
                    <span>1 session</span>
                    <span>30 sessions</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-warm-400">
                  Based on an average rate of ${avgRate}/session and {(platformFee * 100).toFixed(0)}% platform fee.
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={150}>
              <div className="rounded-2xl border border-warm-200 bg-white p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-warm-500">Weekly Sessions</p>
                    <p className="mt-1 font-display text-3xl font-bold text-warm-900">{sessionsPerWeek}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Monthly Sessions</p>
                    <p className="mt-1 font-display text-3xl font-bold text-warm-900">{Math.round(sessionsPerWeek * 4.33)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Monthly Gross</p>
                    <p className="mt-1 font-display text-3xl font-bold text-warm-600">${Math.round(monthlyGross).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Your Earnings</p>
                    <p className="mt-1 font-display text-3xl font-bold text-teal-700">${Math.round(monthlyNet).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-xl bg-teal-50 p-4">
                  <p className="text-center text-sm text-teal-700">
                    Estimated annual earnings: <span className="font-bold">${Math.round(monthlyNet * 12).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* How Verification Works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-warm-900 sm:text-4xl">How Verification Works</h2>
              <p className="mt-4 text-warm-500">We verify every trainer to ensure quality and safety for our community.</p>
            </div>
          </AnimateIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-4">
            {[
              { step: "1", title: "Apply Online", desc: "Fill out your application with your qualifications, experience, and certifications." },
              { step: "2", title: "Document Check", desc: "Upload your certification documents, insurance, and Working with Children Check." },
              { step: "3", title: "Background Check", desc: "We conduct a comprehensive background check for the safety of our community." },
              { step: "4", title: "Profile Approved", desc: "Once approved, your verified profile goes live and you can start accepting bookings." },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 100}>
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 font-display text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-warm-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-warm-500">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Testimonials */}
      <section className="border-y border-warm-200/60 bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-center font-display text-3xl font-bold text-warm-900">What Trainers Say</h2>
          </AnimateIn>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                name: "Marcus Thompson",
                location: "Sydney, NSW",
                quote: "AnywherePT transformed my business. I went from struggling to find clients to having a fully booked schedule within three months. The platform handles all the admin so I can focus on what I love: training.",
              },
              {
                name: "Priya Sharma",
                location: "Melbourne, VIC",
                quote: "The secure payments and professional profile page have made a huge difference. My clients love the easy booking system, and I love getting paid on time every week without chasing invoices.",
              },
              {
                name: "Chris Wallace",
                location: "Brisbane, QLD",
                quote: "Being verified on AnywherePT instantly builds trust with new clients. The scheduling tools are excellent, and the support team actually responds when you need help. Highly recommended.",
              },
            ].map((t, i) => (
              <AnimateIn key={t.name} delay={i * 100}>
                <div className="flex h-full flex-col rounded-2xl border border-warm-100 bg-white p-8">
                  <svg className="h-8 w-8 text-teal-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-warm-600">{t.quote}</p>
                  <div className="mt-6 border-t border-warm-100 pt-4">
                    <p className="text-sm font-semibold text-warm-900">{t.name}</p>
                    <p className="text-xs text-warm-500">{t.location}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to Grow Your Business?
              </h2>
              <p className="mt-4 text-teal-200/80">
                Join AnywherePT today and start connecting with clients across Australia. Application takes less than 10 minutes.
              </p>
              <Link
                href="/signup?role=trainer"
                className="mt-8 inline-block rounded-xl bg-coral-500 px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
              >
                Apply Now
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
