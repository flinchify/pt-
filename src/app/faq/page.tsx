"use client";

import { useState } from "react";
import { AnimateIn } from "@/components/animate-in";
import Link from "next/link";

const FAQ_CATEGORIES = [
  {
    name: "General",
    questions: [
      { q: "What is AnywherePT?", a: "AnywherePT is Australia's marketplace for verified personal trainers. We connect individuals with qualified, background-checked personal trainers across all major cities and regions. Our platform handles discovery, booking, and secure payment so you can focus on your fitness goals." },
      { q: "Is AnywherePT available across all of Australia?", a: "We currently have trainers in all major Australian capital cities (Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Darwin, and Canberra) as well as many regional areas. We are continuously expanding our trainer network to cover more locations. Enter your suburb on the trainers page to check availability in your area." },
      { q: "How does AnywherePT verify trainers?", a: "Every trainer on AnywherePT goes through a comprehensive verification process that includes identity verification, certification validation (Cert III and IV in Fitness or equivalent), professional indemnity and public liability insurance checks, a national police background check, and a Working with Children Check where applicable." },
      { q: "Is there a mobile app?", a: "We are currently developing native mobile apps for iOS and Android. In the meantime, our website is fully responsive and works seamlessly on all mobile devices. You can add it to your home screen for a native app-like experience." },
      { q: "How do I create an account?", a: "Click the 'Sign Up' button in the top right corner of the page. You can sign up with your email address or through Google. The process takes less than a minute, and you can start browsing trainers immediately." },
    ],
  },
  {
    name: "For Clients",
    questions: [
      { q: "How do I find a trainer near me?", a: "Visit the Find Trainers page and enter your suburb or postcode. You can filter results by specialisation, price range, session type, rating, and availability. Each trainer profile includes their location, qualifications, reviews, and pricing." },
      { q: "Can I book a trial session?", a: "Many trainers on our platform offer discounted introductory sessions. Look for the 'Intro Session' option on trainer profiles. This allows you to try a session before committing to ongoing training." },
      { q: "What if I need to cancel or reschedule?", a: "You can cancel or reschedule a booking free of charge up to 24 hours before the scheduled session time. Cancellations made less than 24 hours before may incur a cancellation fee of up to 50% of the session price. You can manage your bookings from your dashboard." },
      { q: "Where can sessions take place?", a: "Sessions can be held at various locations depending on the trainer's offerings. Options may include the trainer's gym, a partner gym near you, an outdoor park, your home, or online via video call. Location options are displayed on each trainer's profile." },
      { q: "How do reviews work?", a: "After each completed session, you will receive an invitation to leave a review. Reviews include a star rating (1-5) and an optional written comment. Only clients who have completed a verified session can leave reviews, ensuring authenticity. Trainers may also respond to reviews." },
      { q: "What if I have a health condition?", a: "We recommend discussing any health conditions, injuries, or medical concerns with your trainer before your first session. Qualified trainers can modify exercises to accommodate most conditions. If you have a serious medical condition, please obtain clearance from your doctor before beginning a training program." },
    ],
  },
  {
    name: "For Trainers",
    questions: [
      { q: "How do I join AnywherePT as a trainer?", a: "Click 'For Trainers' in the navigation menu and then 'Apply to Join'. You will need to provide your qualifications, experience details, insurance information, and consent to a background check. The application process typically takes 5-10 business days." },
      { q: "What qualifications do I need?", a: "You need a minimum of a Certificate III in Fitness (or equivalent) to join as a trainer. We also accept Certificate IV in Fitness, Bachelor or Master degrees in Exercise Science, and equivalent international qualifications. Current first aid certification is also required." },
      { q: "What is the platform fee?", a: "AnywherePT charges a 15% platform fee on each completed session. This fee covers client acquisition, payment processing, booking management, customer support, insurance administration, and your professional profile page. There are no monthly fees or sign-up costs." },
      { q: "How and when do I get paid?", a: "Payments are processed weekly via direct deposit to your nominated Australian bank account. Session fees (minus the platform fee) are transferred every Monday for sessions completed in the previous week. You can track your earnings in your trainer dashboard." },
      { q: "Can I set my own rates?", a: "Yes, you have full control over your pricing. You set your hourly rate and can create different pricing tiers for various session types (1-on-1, group, online, etc.). We recommend researching local market rates to stay competitive." },
      { q: "What insurance do I need?", a: "You must hold current professional indemnity insurance and public liability insurance (minimum $10 million). Many industry bodies offer insurance packages for personal trainers. We can provide recommendations if needed." },
    ],
  },
  {
    name: "For Gyms",
    questions: [
      { q: "How does the gym partnership work?", a: "Gyms can register as partner venues on AnywherePT. Verified trainers on the platform can then list your gym as an available training location. When sessions are conducted at your gym, you earn a venue fee for each session." },
      { q: "Is there a cost to partner with AnywherePT?", a: "No, there is no cost to register your gym or to become a partner. You earn additional revenue from sessions conducted at your venue with no upfront investment required." },
      { q: "Can I control which trainers use my gym?", a: "Yes, you have full control over trainer access. You can review and approve or deny any trainer who requests to use your facility. You can also set capacity limits and operating hour restrictions." },
      { q: "How much can my gym earn?", a: "Earnings depend on the number of sessions conducted at your facility. On average, partner gyms earn $2,000-$3,000 per month in additional revenue. You also benefit from increased foot traffic, which can lead to new membership sign-ups." },
      { q: "What equipment is needed?", a: "Standard gym equipment is sufficient for most personal training sessions. Trainers will confirm that your facility has the equipment they need before listing your gym as a training location." },
    ],
  },
  {
    name: "Payments",
    questions: [
      { q: "What payment methods are accepted?", a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) processed through Stripe. We also support Apple Pay and Google Pay for supported devices. All payments are in Australian Dollars (AUD)." },
      { q: "Is my payment information secure?", a: "Yes, all payment information is processed by Stripe, a PCI DSS Level 1 certified payment processor. We never store your full credit card details on our servers. All transactions are encrypted using industry-standard TLS encryption." },
      { q: "When am I charged for a session?", a: "For pay-per-session bookings, your card is charged at the time of booking. For subscription plans, you are billed at the start of each billing cycle (monthly or annually). Session credits are available immediately upon payment." },
      { q: "How do refunds work?", a: "If you cancel a session more than 24 hours before the scheduled time, you receive a full refund. Refunds are processed back to your original payment method and typically appear within 5-10 business days. If a trainer cancels, you always receive a full refund." },
      { q: "Do prices include GST?", a: "Yes, all prices displayed on the Platform are inclusive of GST where applicable. Invoices and receipts with GST breakdowns are available in your account dashboard." },
    ],
  },
  {
    name: "Enterprise",
    questions: [
      { q: "What is AnywherePT Enterprise?", a: "AnywherePT Enterprise is our corporate wellness solution. It allows companies to provide their employees with access to personal training sessions through the AnywherePT platform, with centralised billing, reporting, and account management." },
      { q: "How does billing work for enterprise accounts?", a: "Enterprise accounts are billed monthly based on your selected plan. You receive a single consolidated invoice covering all employee usage. We can accommodate various billing arrangements including purchase orders and departmental cost allocation." },
      { q: "Can we customise the program for our company?", a: "Yes, enterprise plans can be customised to suit your company's needs. This includes custom branding, specific trainer requirements, on-site sessions, team challenges, and tailored reporting. Contact our enterprise sales team to discuss your requirements." },
      { q: "What reporting is available?", a: "Enterprise dashboards provide insights into employee participation rates, session completion metrics, popular training types, and overall program engagement. Growth and Enterprise plans include quarterly wellness reports with detailed analytics." },
      { q: "Is there a minimum company size?", a: "Our Starter enterprise plan is designed for companies with as few as 10 employees. We have plans suitable for organisations of all sizes, from small businesses to large corporations with thousands of employees." },
    ],
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const currentCategory = FAQ_CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <>
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-warm-900">Frequently Asked Questions</h1>
          <p className="mt-2 text-warm-500">
            Find answers to common questions about AnywherePT.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setOpenQuestion(null);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.name
                    ? "bg-teal-600 text-white"
                    : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="mt-8 space-y-3">
            {currentCategory?.questions.map((faq, i) => (
              <AnimateIn key={`${activeCategory}-${i}`} delay={i * 50}>
                <div className="rounded-xl border border-warm-200 bg-white">
                  <button
                    onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="pr-4 text-sm font-semibold text-warm-900">{faq.q}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`shrink-0 text-warm-400 transition-transform ${openQuestion === i ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {openQuestion === i && (
                    <div className="border-t border-warm-100 px-5 py-4">
                      <p className="text-sm leading-relaxed text-warm-600">{faq.a}</p>
                    </div>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Still have questions */}
          <AnimateIn>
            <div className="mt-14 rounded-2xl bg-cream p-8 text-center">
              <h2 className="font-display text-xl font-bold text-warm-900">Still have questions?</h2>
              <p className="mt-2 text-sm text-warm-500">
                Our support team is here to help. Reach out and we will get back to you within one business day.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Contact Support
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
