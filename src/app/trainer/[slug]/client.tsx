"use client";

import { useState } from "react";
import Link from "next/link";
import { ReviewStars } from "@/components/review-stars";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { Modal } from "@/components/modal";
import { AnimateIn } from "@/components/animate-in";

interface TrainerData {
  id: number;
  slug: string;
  name: string;
  email: string;
  avatar_url: string | null;
  photo_url: string | null;
  cover_photo_url: string | null;
  verified: boolean;
  bio: string;
  experience_years: number;
  specialisations: string[];
  session_types: string[];
  certifications: string[];
  hourly_rate: number;
  home_suburb: string;
  state: string;
  avg_rating: number;
  review_count: number;
  gallery: string[];
  created_at: string;
  session_pricing: { type: string; price: number; duration: number; description: string }[];
  reviews: {
    id: number;
    client_name: string;
    rating: number;
    comment: string;
    trainer_reply: string | null;
    created_at: string;
  }[];
  availability: {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    locationType: string;
  }[];
}

export default function TrainerProfileClient({ trainer }: { trainer: TrainerData }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const memberSince = trainer.created_at
    ? new Date(trainer.created_at).toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
      })
    : null;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const sessionPricing = trainer.session_pricing?.length
    ? trainer.session_pricing
    : [
        { type: "1-on-1 Session", price: trainer.hourly_rate, duration: 60, description: "Personal training session tailored to your goals" },
      ];

  const reviews = trainer.reviews || [];
  const gallery = trainer.gallery || [];
  const availability = trainer.availability || [];
  const certifications = trainer.certifications || [];

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="h-48 bg-gradient-to-r from-teal-800 to-teal-600 sm:h-64">
          {trainer.cover_photo_url && (
            <img
              src={trainer.cover_photo_url}
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
          )}
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 flex flex-col items-start gap-6 sm:-mt-20 sm:flex-row sm:items-end">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg sm:h-40 sm:w-40">
              {trainer.avatar_url || trainer.photo_url ? (
                <img
                  src={trainer.avatar_url || trainer.photo_url || ""}
                  alt={trainer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-teal-50">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0A6847" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-warm-900 sm:text-3xl">
                  {trainer.name}
                </h1>
                {trainer.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-warm-500">
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {trainer.home_suburb}, {trainer.state}
                </span>
                {memberSince && (
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Member since {memberSince}
                  </span>
                )}
                <ReviewStars rating={trainer.avg_rating || 0} count={trainer.review_count || 0} size="sm" />
              </div>
            </div>
            <button
              onClick={handleShare}
              className="shrink-0 rounded-lg border border-warm-200 px-4 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50"
            >
              {copied ? "Link Copied" : "Share Profile"}
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {/* Bio */}
            <AnimateIn>
              <section>
                <h2 className="font-display text-xl font-bold text-warm-900">About</h2>
                <p className="mt-4 text-sm leading-relaxed text-warm-600 whitespace-pre-line">
                  {trainer.bio || "No bio available."}
                </p>
                {trainer.experience_years > 0 && (
                  <p className="mt-4 text-sm text-warm-500">
                    {trainer.experience_years} years of training experience
                  </p>
                )}
              </section>
            </AnimateIn>

            {/* Specialisations */}
            {trainer.specialisations?.length > 0 && (
              <AnimateIn>
                <section>
                  <h2 className="font-display text-xl font-bold text-warm-900">Specialisations</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trainer.specialisations.map((s) => (
                      <span key={s} className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              </AnimateIn>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <AnimateIn>
                <section>
                  <h2 className="font-display text-xl font-bold text-warm-900">Gallery</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxImage(img)}
                        className="group aspect-square overflow-hidden rounded-xl bg-warm-100"
                      >
                        <img
                          src={img}
                          alt={`${trainer.name} gallery ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              </AnimateIn>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <AnimateIn>
                <section>
                  <h2 className="font-display text-xl font-bold text-warm-900">Certifications</h2>
                  <ul className="mt-4 space-y-2">
                    {certifications.map((cert) => (
                      <li key={cert} className="flex items-center gap-2 text-sm text-warm-600">
                        <svg className="h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </section>
              </AnimateIn>
            )}

            {/* Session Types & Pricing */}
            <AnimateIn>
              <section>
                <h2 className="font-display text-xl font-bold text-warm-900">Session Types & Pricing</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {sessionPricing.map((session) => (
                    <div key={session.type} className="rounded-xl border border-warm-200 p-5">
                      <h3 className="font-semibold text-warm-900">{session.type}</h3>
                      <p className="mt-1 text-sm text-warm-500">{session.description}</p>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="font-display text-2xl font-bold text-teal-700">${session.price}</span>
                        <span className="text-sm text-warm-400">/ {session.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </AnimateIn>

            {/* Availability */}
            {availability.length > 0 && (
              <AnimateIn>
                <section>
                  <h2 className="font-display text-xl font-bold text-warm-900">Weekly Availability</h2>
                  <div className="mt-4">
                    <AvailabilityCalendar slots={availability} />
                  </div>
                </section>
              </AnimateIn>
            )}

            {/* Reviews */}
            <AnimateIn>
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-warm-900">
                    Reviews {trainer.review_count > 0 && `(${trainer.review_count})`}
                  </h2>
                  {trainer.avg_rating > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl font-bold text-warm-900">{trainer.avg_rating.toFixed(1)}</span>
                      <ReviewStars rating={trainer.avg_rating} size="md" />
                    </div>
                  )}
                </div>

                {reviews.length > 0 ? (
                  <div className="mt-6 space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-warm-100 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-warm-900">{review.client_name}</p>
                            <ReviewStars rating={review.rating} size="sm" />
                          </div>
                          <span className="text-xs text-warm-400">
                            {new Date(review.created_at).toLocaleDateString("en-AU", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-warm-600">{review.comment}</p>
                        {review.trainer_reply && (
                          <div className="mt-3 rounded-lg bg-warm-50 p-3">
                            <p className="text-xs font-semibold text-warm-700">Reply from {trainer.name}</p>
                            <p className="mt-1 text-sm text-warm-600">{review.trainer_reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-warm-500">No reviews yet.</p>
                )}
              </section>
            </AnimateIn>
          </div>

          {/* Sidebar - Book Now */}
          <div className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
              <div className="text-center">
                <span className="font-display text-3xl font-bold text-teal-700">${trainer.hourly_rate}</span>
                <span className="text-warm-500"> /hr</span>
              </div>
              <Link
                href={`/book?trainer=${trainer.slug || trainer.id}`}
                className="mt-4 block w-full rounded-xl bg-coral-500 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-coral-600"
              >
                Book Now
              </Link>
              <p className="mt-3 text-center text-xs text-warm-400">
                Free cancellation up to 24 hours before
              </p>
              <hr className="my-4 border-warm-100" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-warm-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Secure payment via Stripe
                </div>
                <div className="flex items-center gap-2 text-warm-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Verified and insured
                </div>
                <div className="flex items-center gap-2 text-warm-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Flexible scheduling
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky Book Now bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-warm-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-xl font-bold text-teal-700">${trainer.hourly_rate}</span>
            <span className="text-sm text-warm-500"> /hr</span>
          </div>
          <Link
            href={`/book?trainer=${trainer.slug || trainer.id}`}
            className="rounded-xl bg-coral-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal open={!!lightboxImage} onClose={() => setLightboxImage(null)} maxWidth="max-w-3xl">
        {lightboxImage && (
          <div className="p-2">
            <img src={lightboxImage} alt="Gallery" className="w-full rounded-xl" />
          </div>
        )}
      </Modal>
    </>
  );
}
