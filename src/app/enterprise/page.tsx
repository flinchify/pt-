"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimateIn } from "@/components/animate-in";

export default function EnterprisePage() {
  const [employeeCount, setEmployeeCount] = useState(100);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ROI calculations
  const avgSickDaysCost = 350; // per day per employee
  const sickDayReduction = 0.25;
  const participationRate = 0.4;
  const monthlySavings = Math.round(
    employeeCount * participationRate * sickDayReduction * avgSickDaysCost * (12 / 12)
  );
  const annualSavings = monthlySavings * 12;

  const handleDemoRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/enterprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          employees: formData.get("employees"),
          message: formData.get("message"),
        }),
      });
      if (res.ok) {
        setFormSubmitted(true);
      }
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  const plans = [
    {
      name: "Starter",
      employees: "Up to 50 employees",
      price: "$499",
      period: "/mo",
      features: [
        "Employee self-service portal",
        "Verified trainer network access",
        "Basic usage reporting",
        "Email support",
        "Standard trainer matching",
      ],
    },
    {
      name: "Growth",
      employees: "Up to 200 employees",
      price: "$1,499",
      period: "/mo",
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced analytics dashboard",
        "Team challenges and leaderboards",
        "Priority trainer matching",
        "Dedicated success manager",
        "Quarterly wellness reports",
        "Custom branding options",
      ],
    },
    {
      name: "Enterprise",
      employees: "Unlimited employees",
      price: "Custom",
      period: "",
      features: [
        "Everything in Growth",
        "Dedicated account manager",
        "Custom API integration",
        "On-site trainer coordination",
        "Executive wellness programs",
        "Real-time ROI dashboard",
        "SLA guarantee",
        "Multi-location support",
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 py-24 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1920&q=80"
            alt="Corporate wellness and fitness"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950/80 via-teal-900/70 to-teal-950/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-300">Corporate Wellness</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Health is Wealth &mdash; For Your Team
            </h1>
            <p className="mt-6 text-lg text-teal-200/80">
              Invest in your employees&apos; wellbeing with corporate fitness programs powered by AnywherePT. Healthier teams, better business outcomes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#demo" className="rounded-full bg-coral-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600">
                Request a Demo
              </a>
              <a href="#plans" className="rounded-full border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60">
                View Plans
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">The Business Case</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">Why Corporate Wellness?</h2>
            </div>
          </AnimateIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Reduced Sick Days", desc: "Companies with wellness programs see up to 25% fewer sick days, directly improving productivity and reducing costs.", stat: "25%" },
              { title: "Increased Productivity", desc: "Regular exercise improves focus, energy levels, and cognitive function. Fit employees are more productive employees.", stat: "21%" },
              { title: "Team Building", desc: "Group fitness sessions and team challenges foster camaraderie and improve workplace culture and collaboration.", stat: "3x" },
              { title: "Employee Wellbeing", desc: "Demonstrate your commitment to employee health. Wellness benefits are consistently rated among the most valued perks.", stat: "87%" },
            ].map((item, i) => (
              <AnimateIn key={item.title} delay={i * 100}>
                <div className="rounded-2xl border border-warm-100 bg-white p-6 text-center transition-shadow hover:shadow-lg">
                  <p className="font-display text-4xl font-bold text-teal-600">{item.stat}</p>
                  <h3 className="mt-3 font-display text-lg font-bold text-warm-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-500">{item.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-warm-200/60 bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Getting Started</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">How It Works</h2>
            </div>
          </AnimateIn>

          <div className="mt-14 grid gap-8 sm:grid-cols-4">
            {[
              { step: "1", title: "Company Signs Up", desc: "Choose a plan that fits your team size. We handle all the setup and onboarding." },
              { step: "2", title: "Employees Get Accounts", desc: "Each employee gets their own AnywherePT account to browse trainers and book sessions." },
              { step: "3", title: "Book Trainers", desc: "Employees book personal training sessions at times and locations that suit them." },
              { step: "4", title: "Track Results", desc: "Receive comprehensive reports on participation, engagement, and wellness outcomes." },
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

          {/* Corporate wellness image */}
          <div className="mt-16 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80"
              alt="Team fitness training session in a modern office gym"
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Measure Your Impact</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-warm-900">ROI Calculator</h2>
                <p className="mt-3 text-warm-500">
                  See the potential return on investment from a corporate wellness program. Adjust the slider to match your company size.
                </p>
                <div className="mt-8">
                  <label className="text-sm font-semibold text-warm-700">
                    Number of employees: {employeeCount}
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={1000}
                    step={10}
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
                    className="mt-2 w-full accent-teal-600"
                  />
                  <div className="mt-1 flex justify-between text-xs text-warm-400">
                    <span>10</span>
                    <span>1,000</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-warm-400">
                  Based on industry averages: {(participationRate * 100)}% participation rate, ${avgSickDaysCost}/day sick leave cost, {(sickDayReduction * 100)}% reduction in sick days.
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={150}>
              <div className="rounded-2xl border border-warm-200 bg-white p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-warm-500">Employees</p>
                    <p className="mt-1 font-display text-3xl font-bold text-warm-900">{employeeCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Participants</p>
                    <p className="mt-1 font-display text-3xl font-bold text-warm-900">{Math.round(employeeCount * participationRate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Monthly Savings</p>
                    <p className="mt-1 font-display text-3xl font-bold text-teal-700">${monthlySavings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Annual Savings</p>
                    <p className="mt-1 font-display text-3xl font-bold text-teal-700">${annualSavings.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-sm font-medium text-emerald-700">
                    Estimated ROI: {Math.round((annualSavings / (employeeCount <= 50 ? 499 * 12 : employeeCount <= 200 ? 1499 * 12 : 2999 * 12)) * 100)}%
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Corporate fitness image break */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&q=80"
          alt="Employees exercising together in a corporate wellness program"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-950/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-center font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Empower your team to move more
          </p>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="border-y border-warm-200/60 bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Pricing</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">Enterprise Plans</h2>
            </div>
          </AnimateIn>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <AnimateIn key={plan.name} delay={i * 100}>
                <div className={`relative flex h-full flex-col rounded-2xl border bg-white p-8 ${
                  plan.popular ? "border-teal-500 shadow-xl shadow-teal-500/10" : "border-warm-200"
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-display text-xl font-bold text-warm-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-warm-500">{plan.employees}</p>
                  <div className="mt-4">
                    <span className="font-display text-4xl font-bold text-warm-900">{plan.price}</span>
                    <span className="text-warm-500">{plan.period}</span>
                  </div>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-warm-600">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#demo"
                    className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                      plan.popular
                        ? "bg-coral-500 text-white hover:bg-coral-600"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </a>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section id="demo" className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Get in Touch</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">Request a Demo</h2>
              <p className="mt-4 text-warm-500">
                See how AnywherePT can transform your workplace wellness. We will set up a personalised demo for your team.
              </p>
            </div>
          </AnimateIn>

          {formSubmitted ? (
            <AnimateIn>
              <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3 className="mt-4 font-display text-xl font-bold text-warm-900">Thank You</h3>
                <p className="mt-2 text-warm-600">We have received your request and will be in touch within one business day.</p>
              </div>
            </AnimateIn>
          ) : (
            <form onSubmit={handleDemoRequest} className="mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-warm-700">Full Name</label>
                  <input name="name" type="text" required className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400" placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-warm-700">Work Email</label>
                  <input name="email" type="email" required className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400" placeholder="jane@company.com.au" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-warm-700">Company Name</label>
                  <input name="company" type="text" required className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400" placeholder="Company Pty Ltd" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-warm-700">Number of Employees</label>
                  <select name="employees" required className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800">
                    <option value="">Select range</option>
                    <option value="10-50">10 - 50</option>
                    <option value="51-200">51 - 200</option>
                    <option value="201-500">201 - 500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-warm-700">Message (optional)</label>
                <textarea name="message" rows={4} className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400" placeholder="Tell us about your wellness goals..." />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-coral-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-coral-600 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Request Demo"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
