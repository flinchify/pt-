import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnimateIn } from "@/components/animate-in";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about AnywherePT's mission to make personal training accessible across Australia. Health is Wealth.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 py-24 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">About AnywherePT</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Making Personal Training Accessible Across Australia
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-teal-100/90">
              We believe that everyone deserves access to quality personal training, regardless of where they live. AnywherePT connects Australians with verified personal trainers in their area, making fitness achievable for all.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimateIn>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">Why We Exist</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">Our Mission</h2>
                <p className="mt-4 text-warm-600 leading-relaxed">
                  AnywherePT was founded with a simple belief: Health is Wealth. We saw that finding a qualified, trustworthy personal trainer was unnecessarily difficult. Rates were opaque, qualifications were hard to verify, and booking was a hassle.
                </p>
                <p className="mt-4 text-warm-600 leading-relaxed">
                  We built AnywherePT to solve these problems. Our platform verifies every trainer, provides transparent pricing, and makes booking as simple as a few taps. Whether you are in Sydney CBD or regional Queensland, you deserve access to a great trainer.
                </p>
                <p className="mt-4 text-warm-600 leading-relaxed">
                  For trainers, we provide a steady stream of clients, easy scheduling tools, and secure payments. For gyms, we bring in additional foot traffic and revenue. For companies, we offer wellness programs that keep employees healthy and productive.
                </p>
              </div>
            </AnimateIn>
            <AnimateIn delay={150}>
              <div className="space-y-4">
                <div className="relative h-64 w-full overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
                    alt="Personal trainer working with a client during a fitness session"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "500+", label: "Verified Trainers" },
                    { value: "10,000+", label: "Sessions Completed" },
                    { value: "30+", label: "Cities" },
                    { value: "4.8", label: "Average Rating" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-warm-100 bg-cream p-6 text-center">
                      <p className="font-display text-3xl font-bold text-teal-700">{s.value}</p>
                      <p className="mt-1 text-sm text-warm-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-warm-200/60 bg-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">What Drives Us</p>
              <h2 className="mt-3 text-center font-display text-3xl font-bold text-warm-900 sm:text-4xl">Our Values</h2>
            </div>
          </AnimateIn>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Trust & Safety",
                desc: "Every trainer is verified through comprehensive background checks and credential verification. Your safety is our priority.",
              },
              {
                title: "Accessibility",
                desc: "Personal training should be available to everyone. We connect trainers and clients across all of Australia, not just major cities.",
              },
              {
                title: "Transparency",
                desc: "No hidden fees, no surprises. Prices are listed upfront, reviews are genuine, and our platform fee is clear and fair.",
              },
              {
                title: "Quality",
                desc: "We maintain high standards for every trainer on our platform. Ongoing review monitoring ensures consistent service quality.",
              },
            ].map((v, i) => (
              <AnimateIn key={v.title} delay={i * 100}>
                <div className="rounded-2xl border border-warm-100 bg-white p-6">
                  <h3 className="font-display text-lg font-bold text-warm-900">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-500">{v.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Image Strip */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
                  alt="Gym interior with modern equipment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80"
                  alt="Group fitness class in progress"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80"
                  alt="Outdoor training session at a park"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-warm-200/60 bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-600">The People Behind It</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-warm-900 sm:text-4xl">Our Team</h2>
              <p className="mt-4 text-warm-500">
                A passionate team of fitness enthusiasts, technologists, and business leaders working to transform the fitness industry in Australia.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Alex Morgan", role: "Founder & CEO", bio: "Former personal trainer with 10 years experience. Built AnywherePT to solve problems they experienced first-hand." },
              { name: "Sam Taylor", role: "CTO", bio: "Full-stack engineer passionate about building products that make a real difference in people's lives." },
              { name: "Jordan Lee", role: "Head of Operations", bio: "Background in marketplace operations. Ensures every trainer and client has a seamless experience." },
              { name: "Casey Rivera", role: "Head of Trainer Success", bio: "Certified strength coach who supports trainers in building successful businesses on the platform." },
            ].map((member, i) => (
              <AnimateIn key={member.name} delay={i * 100}>
                <div className="rounded-2xl border border-warm-100 bg-white p-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A6847" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-semibold text-warm-900">{member.name}</h3>
                  <p className="text-sm font-medium text-teal-600">{member.role}</p>
                  <p className="mt-3 text-sm text-warm-500">{member.bio}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">Get Started Today</p>
              <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                Join the AnywherePT Community
              </h2>
              <p className="mt-3 text-teal-200/80">
                Whether you are looking for a trainer, are a trainer, or own a gym, there is a place for you.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/trainers" className="rounded-full bg-coral-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-600">
                  Find a Trainer
                </Link>
                <Link href="/for-trainers" className="rounded-full border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60">
                  Join as Trainer
                </Link>
                <Link href="/contact" className="rounded-full border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60">
                  Contact Us
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
