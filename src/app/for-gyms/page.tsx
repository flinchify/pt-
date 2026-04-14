"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimateIn } from "@/components/animate-in";

export default function ForGymsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 py-24 sm:py-32">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="Modern gym interior with equipment"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/60 via-teal-950/40 to-teal-950/80" />
        <div className="hero-grid-pattern absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-300">For Gyms</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Partner Your Gym with AnywherePT
            </h1>
            <p className="mt-6 text-lg text-teal-200/80">
              Increase foot traffic, fill off-peak hours, and earn additional revenue by hosting AnywherePT trainers and their clients at your facility.
            </p>
            <Link href="/signup?role=gym" className="mt-8 inline-block rounded-full bg-coral-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600">
              Register Your Gym
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Why Partner With Us</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">Benefits for Your Gym</h2>
              <p className="mt-4 text-warm-500">Zero upfront cost, zero risk. Earn more from your existing space.</p>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {[
              {
                title: "Extra Foot Traffic",
                desc: "AnywherePT trainers bring their clients to your gym, increasing visits during off-peak hours and exposing new potential members to your facility.",
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
                title: "Trainer Management Dashboard",
                desc: "See which trainers and clients are using your gym, manage capacity, and approve trainer access all from one simple dashboard.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                ),
              },
              {
                title: "Booking Integration",
                desc: "Sessions are automatically scheduled and tracked. Know exactly when trainers and clients will be using your space so you can manage capacity.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
                  </svg>
                ),
              },
              {
                title: "Revenue Share",
                desc: "Earn a share of every session conducted at your gym. Additional revenue with no extra work required from your team.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 100}>
                <div className="flex gap-5 rounded-2xl border border-warm-100 bg-white p-6 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-warm-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-warm-500">{item.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gym Showcase Image */}
      <section className="py-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96">
            <Image
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80"
              alt="People working out in a modern gym facility"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/50 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-200">Our Network</p>
              <p className="mt-2 max-w-md text-lg font-semibold text-white sm:text-xl">
                Join a growing network of gyms across the country already partnered with AnywherePT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-warm-200/60 bg-cream py-20 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Getting Started</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">How It Works</h2>
            </div>
          </AnimateIn>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Register Your Gym",
                desc: "Create your gym profile with location, amenities, operating hours, and photos. It takes less than 10 minutes.",
              },
              {
                step: "02",
                title: "Approve Trainers",
                desc: "Review and approve verified AnywherePT trainers who want to use your gym. Set capacity limits and house rules.",
              },
              {
                step: "03",
                title: "Start Earning",
                desc: "Earn a revenue share for every session conducted at your gym. Payments are processed automatically each week.",
              },
            ].map((item, i) => (
              <AnimateIn key={item.step} delay={i * 150}>
                <div className="text-center">
                  <span className="font-display text-5xl font-bold text-teal-200">{item.step}</span>
                  <h3 className="mt-3 font-display text-xl font-bold text-warm-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-500">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative bg-teal-900 py-16 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80"
          alt="Gym equipment and training area"
          fill
          className="object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-teal-300">By The Numbers</p>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "25+", label: "Partner Gyms" },
              { value: "40%", label: "Avg. Traffic Increase" },
              { value: "$2,500", label: "Avg. Monthly Revenue" },
              { value: "100%", label: "Free to Join" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-teal-200/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 p-10 text-center sm:p-16">
              <Image
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1200&q=80"
                alt="Personal trainer working with client in gym"
                fill
                className="object-cover opacity-10"
              />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-widest text-teal-200">Get Started Today</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-white">Ready to Partner?</h2>
                <p className="mt-4 text-teal-100">
                  Join the growing network of gyms earning additional revenue through AnywherePT. Registration is free and takes minutes.
                </p>
                <Link href="/signup?role=gym" className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50">
                  Register Your Gym
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
