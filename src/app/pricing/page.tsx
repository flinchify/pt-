"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimateIn } from "@/components/animate-in";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Casual",
      desc: "Pay per session, no commitment required.",
      price: "60",
      priceLabel: "/session",
      annualPrice: "60",
      features: [
        "Access to all verified trainers",
        "Flexible scheduling",
        "Secure payment per session",
        "Session history and tracking",
        "Trainer reviews and ratings",
        "Free cancellation (24hr notice)",
      ],
      cta: "Get Started",
      href: "/signup",
      popular: false,
    },
    {
      name: "Committed",
      desc: "8 sessions per month. Save 15% on every session.",
      price: "149",
      priceLabel: "/mo",
      annualPrice: "126",
      features: [
        "Everything in Casual",
        "8 sessions per month",
        "15% savings on session rates",
        "Priority trainer matching",
        "Progress tracking dashboard",
        "Monthly fitness reports",
        "Rollover unused sessions (up to 4)",
      ],
      cta: "Start Saving",
      href: "/signup?plan=committed",
      popular: true,
    },
    {
      name: "Unlimited",
      desc: "Unlimited sessions with priority booking.",
      price: "249",
      priceLabel: "/mo",
      annualPrice: "212",
      features: [
        "Everything in Committed",
        "Unlimited sessions",
        "Priority booking access",
        "Premium trainer access",
        "Nutrition planning support",
        "Dedicated account manager",
        "Custom workout programs",
        "Body composition tracking",
      ],
      cta: "Go Unlimited",
      href: "/signup?plan=unlimited",
      popular: false,
    },
  ];

  const comparisonFeatures = [
    { feature: "Verified trainers", casual: true, committed: true, unlimited: true },
    { feature: "Secure payments", casual: true, committed: true, unlimited: true },
    { feature: "Session history", casual: true, committed: true, unlimited: true },
    { feature: "Free cancellation (24hr)", casual: true, committed: true, unlimited: true },
    { feature: "Sessions per month", casual: "Pay as you go", committed: "8", unlimited: "Unlimited" },
    { feature: "Savings on rates", casual: "--", committed: "15%", unlimited: "25%" },
    { feature: "Priority booking", casual: false, committed: true, unlimited: true },
    { feature: "Progress dashboard", casual: false, committed: true, unlimited: true },
    { feature: "Fitness reports", casual: false, committed: true, unlimited: true },
    { feature: "Rollover sessions", casual: false, committed: "Up to 4", unlimited: "N/A" },
    { feature: "Premium trainers", casual: false, committed: false, unlimited: true },
    { feature: "Nutrition support", casual: false, committed: false, unlimited: true },
    { feature: "Dedicated manager", casual: false, committed: false, unlimited: true },
    { feature: "Custom programs", casual: false, committed: false, unlimited: true },
  ];

  const faqs = [
    {
      q: "Can I change plans at any time?",
      a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. If you upgrade mid-cycle, you will receive a pro-rated credit.",
    },
    {
      q: "What happens if I do not use all my sessions?",
      a: "On the Committed plan, you can roll over up to 4 unused sessions to the next month. Any sessions beyond that limit will expire at the end of the billing period.",
    },
    {
      q: "Is there a minimum commitment period?",
      a: "No, there is no minimum commitment for any plan. Monthly plans can be cancelled at any time and will remain active until the end of the current billing period.",
    },
    {
      q: "How does the Casual plan pricing work?",
      a: "With the Casual plan, you pay the trainer's listed rate for each session. Rates vary by trainer and session type, starting from around $60 per session.",
    },
    {
      q: "Do you offer a free trial?",
      a: "We do not currently offer a free trial, but you can start with the Casual plan with no commitment to try the platform. We also offer a satisfaction guarantee on your first session.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure Stripe integration. We also support Apple Pay and Google Pay.",
    },
    {
      q: "Can I get a refund?",
      a: "Sessions can be cancelled for free up to 24 hours before the scheduled time. For subscription plans, you can cancel at any time but refunds are not provided for the current billing period.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-teal-200/80">
              Choose the plan that fits your training goals. No hidden fees, cancel anytime.
            </p>

            {/* Toggle */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!annual ? "text-white" : "text-teal-300/60"}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative h-7 w-12 rounded-full transition-colors ${annual ? "bg-coral-500" : "bg-teal-700"}`}
                aria-label="Toggle annual pricing"
              >
                <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${annual ? "translate-x-5.5 left-0.5" : "left-0.5"}`}
                  style={{ transform: annual ? "translateX(22px)" : "translateX(0)" }}
                />
              </button>
              <span className={`text-sm font-medium ${annual ? "text-white" : "text-teal-300/60"}`}>
                Annual
                <span className="ml-1 rounded-full bg-coral-500/20 px-2 py-0.5 text-xs text-coral-300">Save 15%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="-mt-4 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
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
                  <p className="mt-2 text-sm text-warm-500">{plan.desc}</p>
                  <div className="mt-6">
                    <span className="font-display text-4xl font-bold text-warm-900">
                      ${annual && plan.annualPrice !== plan.price ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-warm-500">{plan.priceLabel}</span>
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
                  <Link
                    href={plan.href}
                    className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
                      plan.popular
                        ? "bg-coral-500 text-white hover:bg-coral-600"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="border-y border-warm-200/60 bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold text-warm-900">Enterprise</h2>
              <p className="mt-4 text-warm-500">
                Looking for corporate wellness solutions for your team? We offer custom packages with volume pricing, dedicated account management, and comprehensive reporting.
              </p>
              <Link
                href="/enterprise"
                className="mt-6 inline-block rounded-xl bg-teal-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Contact Sales
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-center font-display text-3xl font-bold text-warm-900">Feature Comparison</h2>
          </AnimateIn>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-warm-200">
                  <th className="py-3 text-left text-sm font-semibold text-warm-700">Feature</th>
                  <th className="py-3 text-center text-sm font-semibold text-warm-700">Casual</th>
                  <th className="py-3 text-center text-sm font-semibold text-teal-700">Committed</th>
                  <th className="py-3 text-center text-sm font-semibold text-warm-700">Unlimited</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row) => (
                  <tr key={row.feature} className="border-b border-warm-100">
                    <td className="py-3 text-sm text-warm-600">{row.feature}</td>
                    <td className="py-3 text-center">
                      <ComparisonCell value={row.casual} />
                    </td>
                    <td className="py-3 text-center bg-teal-50/30">
                      <ComparisonCell value={row.committed} />
                    </td>
                    <td className="py-3 text-center">
                      <ComparisonCell value={row.unlimited} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-warm-200/60 bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="text-center font-display text-3xl font-bold text-warm-900">
              Frequently Asked Questions
            </h2>
          </AnimateIn>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <AnimateIn key={i} delay={i * 50}>
                <div className="rounded-xl border border-warm-200 bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-warm-900">{faq.q}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`shrink-0 text-warm-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-warm-100 px-5 py-4">
                      <p className="text-sm leading-relaxed text-warm-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <svg className="mx-auto h-5 w-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (value === false) {
    return <span className="text-warm-300">--</span>;
  }
  return <span className="text-sm text-warm-600">{value}</span>;
}
