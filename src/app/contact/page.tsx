"use client";

import { useState } from "react";
import { AnimateIn } from "@/components/animate-in";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      if (res.ok) {
        setStatus("sent");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-warm-900">Contact Us</h1>
          <p className="mt-2 text-warm-500">Have a question or need help? We would love to hear from you.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <AnimateIn>
              <div>
                {status === "sent" ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <h2 className="mt-4 font-display text-xl font-bold text-warm-900">Message Sent</h2>
                    <p className="mt-2 text-warm-600">
                      Thank you for reaching out. We will get back to you within one business day.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-6 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-warm-700">Full Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-warm-700">Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-warm-700">Phone (optional)</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400"
                          placeholder="04XX XXX XXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-warm-700">Subject</label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Enquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="booking">Booking Issue</option>
                          <option value="trainer">Trainer Application</option>
                          <option value="gym">Gym Partnership</option>
                          <option value="enterprise">Enterprise / Corporate</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-warm-700">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 placeholder:text-warm-400"
                        placeholder="How can we help?"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="rounded-xl bg-teal-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </AnimateIn>

            {/* Sidebar */}
            <AnimateIn delay={150}>
              <div className="space-y-6">
                <div className="rounded-2xl border border-warm-200 bg-white p-6">
                  <h3 className="font-display text-lg font-bold text-warm-900">Contact Information</h3>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-warm-900">Email</p>
                        <p className="text-sm text-warm-500">hello@anywherept.com.au</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-warm-900">Phone</p>
                        <p className="text-sm text-warm-500">1300 APT AUS</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-warm-900">Address</p>
                        <p className="text-sm text-warm-500">Sydney, NSW, Australia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-warm-200 bg-white p-6">
                  <h3 className="font-display text-lg font-bold text-warm-900">Response Time</h3>
                  <p className="mt-2 text-sm text-warm-500">
                    We typically respond within one business day. For urgent booking issues, please call our support line.
                  </p>
                </div>

                <div className="rounded-2xl border border-warm-200 bg-white p-6">
                  <h3 className="font-display text-lg font-bold text-warm-900">FAQ</h3>
                  <p className="mt-2 text-sm text-warm-500">
                    Many common questions are already answered in our FAQ section.
                  </p>
                  <a href="/faq" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                    Visit FAQ
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
