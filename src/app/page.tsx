"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimateIn } from "@/components/animate-in";
import { TrainerCard } from "@/components/trainer-card";

const SPECIALISATIONS = [
  "Strength Training",
  "Weight Loss",
  "HIIT",
  "Yoga",
  "Pilates",
  "Boxing",
  "CrossFit",
  "Rehabilitation",
];

interface Trainer {
  id: number;
  slug: string;
  name: string;
  avatar_url?: string;
  photo_url?: string;
  verified: boolean;
  specialisations: string[];
  avg_rating: number;
  review_count: number;
  hourly_rate: number;
  home_suburb: string;
  state: string;
}

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default function HomePage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSpec, setSearchSpec] = useState("");
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    fetch("/api/trainers?limit=6")
      .then((r) => r.json())
      .then((data) => {
        setTrainers(data.trainers || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setNewsletterStatus("sent");
        setEmail("");
      } else {
        setNewsletterStatus("error");
      }
    } catch {
      setNewsletterStatus("error");
    }
  };

  const stat1 = useCountUp(500);
  const stat2 = useCountUp(10000);
  const stat3 = useCountUp(30);
  const stat4 = useCountUp(4800);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950">
        <div className="hero-grid-pattern absolute inset-0" />
        <div className="grain-texture absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-teal-300">
              Australia&apos;s Trainer Marketplace
            </p>
            <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Health is Wealth
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-teal-200/90 sm:text-xl">
              Australia&apos;s marketplace for verified personal trainers. Find your perfect match, book a session, and start your fitness journey today.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-10 max-w-2xl"
            >
              <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md sm:flex-row">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Suburb or city"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white py-3.5 pl-10 pr-4 text-sm text-warm-800 placeholder:text-warm-400 focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <select
                  value={searchSpec}
                  onChange={(e) => setSearchSpec(e.target.value)}
                  className="rounded-xl border-0 bg-white px-4 py-3.5 text-sm text-warm-800 focus:ring-2 focus:ring-teal-400"
                >
                  <option value="">All Specialisations</option>
                  {SPECIALISATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Link
                  href={`/trainers${searchLocation || searchSpec ? `?suburb=${encodeURIComponent(searchLocation)}&specialisation=${encodeURIComponent(searchSpec)}` : ""}`}
                  className="rounded-xl bg-coral-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
                >
                  Search
                </Link>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/trainers"
                className="animate-cta-pulse rounded-xl bg-coral-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
              >
                Find a Trainer
              </Link>
              <Link
                href="/for-trainers"
                className="rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                Join as Trainer
              </Link>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-14 flex justify-center gap-8 sm:gap-16"
            >
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">500+</p>
                <p className="mt-1 text-sm text-teal-300/80">Trainers</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">10,000+</p>
                <p className="mt-1 text-sm text-teal-300/80">Sessions</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-white">All Major</p>
                <p className="mt-1 text-sm text-teal-300/80">Cities</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Simple Process</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">
                How It Works
              </h2>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Find Your Trainer",
                desc: "Browse verified trainers by specialisation, location, and price. Read reviews from real clients.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Book a Session",
                desc: "Choose your time, place, and session type. Flexible scheduling that fits your lifestyle.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Start Training",
                desc: "Meet your trainer and crush your goals. Track your progress and build lasting healthy habits.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 150}>
                <div className="relative rounded-2xl border border-warm-100 bg-white p-8 text-center transition-shadow hover:shadow-lg">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    {item.icon}
                  </div>
                  <span className="mt-4 block font-display text-xs font-bold uppercase tracking-widest text-teal-500">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-warm-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-500">
                    {item.desc}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trainers */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Top Rated</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">
                  Featured Trainers
                </h2>
              </div>
              <Link
                href="/trainers"
                className="hidden items-center gap-1 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700 sm:flex"
              >
                View All Trainers
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimateIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-warm-200 bg-white">
                  <div className="aspect-[4/3] rounded-t-2xl bg-warm-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-2/3 rounded bg-warm-100" />
                    <div className="h-4 w-1/2 rounded bg-warm-100" />
                    <div className="h-4 w-full rounded bg-warm-100" />
                  </div>
                </div>
              ))
            ) : trainers.length > 0 ? (
              trainers.map((t, i) => (
                <AnimateIn key={t.id || i} delay={i * 100}>
                  <TrainerCard
                    slug={t.slug || `trainer-${t.id}`}
                    name={t.name}
                    photoUrl={t.avatar_url || t.photo_url}
                    verified={t.verified}
                    specialisations={t.specialisations || []}
                    avgRating={t.avg_rating || 0}
                    reviewCount={t.review_count || 0}
                    hourlyRate={t.hourly_rate || 0}
                    suburb={t.home_suburb || ""}
                    state={t.state || ""}
                  />
                </AnimateIn>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-warm-500">Trainers are being onboarded. Check back soon.</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/trainers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
            >
              View All Trainers
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <section className="bg-teal-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div ref={stat1.ref} className="text-center">
              <p className="font-display text-4xl font-bold text-white">{stat1.count}+</p>
              <p className="mt-2 text-sm text-teal-200/80">Verified Trainers</p>
            </div>
            <div ref={stat2.ref} className="text-center">
              <p className="font-display text-4xl font-bold text-white">{stat2.count.toLocaleString()}+</p>
              <p className="mt-2 text-sm text-teal-200/80">Sessions Booked</p>
            </div>
            <div ref={stat3.ref} className="text-center">
              <p className="font-display text-4xl font-bold text-white">{stat3.count}+</p>
              <p className="mt-2 text-sm text-teal-200/80">Cities Covered</p>
            </div>
            <div ref={stat4.ref} className="text-center">
              <p className="font-display text-4xl font-bold text-white">{stat4.count.toLocaleString()}+</p>
              <p className="mt-2 text-sm text-teal-200/80">5-Star Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Testimonials</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">
                What Our Clients Say
              </h2>
            </div>
          </AnimateIn>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                name: "Sarah Mitchell",
                location: "Sydney, NSW",
                quote: "AnywherePT made it incredibly easy to find a trainer who understood my goals. I've lost 15kg in six months and feel stronger than ever. The booking process was seamless.",
              },
              {
                name: "James O'Brien",
                location: "Melbourne, VIC",
                quote: "As a busy professional, I needed flexibility. My trainer comes to the park near my office three times a week. Best investment in my health I've ever made.",
              },
              {
                name: "Emily Chen",
                location: "Brisbane, QLD",
                quote: "I was nervous about personal training but my AnywherePT trainer was so encouraging and professional. The verification process gave me confidence from the start.",
              },
            ].map((t, i) => (
              <AnimateIn key={t.name} delay={i * 150}>
                <div className="flex h-full flex-col rounded-2xl border border-warm-100 bg-white p-8">
                  <svg className="h-8 w-8 text-teal-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-warm-600">
                    {t.quote}
                  </p>
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

      {/* For Trainers CTA */}
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">For Trainers</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                  Grow Your Training Business
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-teal-200/80">
                  Join hundreds of trainers already growing their client base through AnywherePT. Focus on training while we handle the rest.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Get matched with clients looking for your expertise",
                    "Manage your schedule and bookings in one place",
                    "Receive secure, on-time payments after every session",
                    "Build your reputation with verified reviews",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-teal-100">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/for-trainers"
                  className="mt-8 inline-block rounded-xl bg-coral-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
                >
                  Learn More
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={200}>
              <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  {[
                    { label: "Average monthly earnings", value: "$4,200" },
                    { label: "New client enquiries per month", value: "12+" },
                    { label: "Session completion rate", value: "97%" },
                    { label: "Average trainer rating", value: "4.8/5" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between rounded-xl bg-white/5 px-5 py-4">
                      <span className="text-sm text-teal-200/80">{stat.label}</span>
                      <span className="font-display text-lg font-bold text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* For Gyms CTA */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn delay={100}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "40%", label: "More foot traffic" },
                  { value: "25+", label: "Partner gyms" },
                  { value: "$2,500", label: "Avg monthly revenue" },
                  { value: "100%", label: "Free to join" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-warm-100 bg-cream p-6 text-center">
                    <p className="font-display text-2xl font-bold text-teal-700">{s.value}</p>
                    <p className="mt-1 text-xs text-warm-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">For Gyms</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">
                  Partner With AnywherePT
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-warm-500">
                  Open your doors to more clients by hosting AnywherePT trainers. Increase foot traffic and revenue with zero upfront cost.
                </p>
                <Link
                  href="/for-gyms"
                  className="mt-8 inline-block rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Partner With Us
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Corporate Wellness</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">
                Health is Wealth &mdash; For Your Team
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-warm-500">
                Invest in your employees&apos; health with corporate fitness programs. Reduce sick days, boost morale, and build a healthier workplace.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/enterprise"
                  className="rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Learn More
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl border-2 border-teal-600 px-8 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-teal-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Stay in the Loop
              </h2>
              <p className="mt-3 text-sm text-teal-200/80">
                Get the latest fitness tips, new trainer profiles, and exclusive offers delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-xl border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-teal-300/60 backdrop-blur-sm focus:ring-2 focus:ring-teal-400"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "sending"}
                  className="rounded-xl bg-coral-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-600 disabled:opacity-60"
                >
                  {newsletterStatus === "sending" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {newsletterStatus === "sent" && (
                <p className="mt-3 text-sm text-teal-300">Thank you for subscribing.</p>
              )}
              {newsletterStatus === "error" && (
                <p className="mt-3 text-sm text-coral-300">Something went wrong. Please try again.</p>
              )}
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
