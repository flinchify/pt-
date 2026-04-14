"use client";

import Link from "next/link";
import { ReviewStars } from "./review-stars";

const PLACEHOLDER_PHOTOS = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=450&fit=crop",
];

interface TrainerCardProps {
  slug: string;
  name: string;
  photoUrl?: string;
  verified: boolean;
  specialisations: string[];
  avgRating: number;
  reviewCount: number;
  hourlyRate: number;
  suburb: string;
  state: string;
}

function getPlaceholderPhoto(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_PHOTOS[Math.abs(hash) % PLACEHOLDER_PHOTOS.length];
}

export function TrainerCard({
  slug,
  name,
  photoUrl,
  verified,
  specialisations,
  avgRating,
  reviewCount,
  hourlyRate,
  suburb,
  state,
}: TrainerCardProps) {
  const displayPhoto = photoUrl || getPlaceholderPhoto(name);

  return (
    <div className="card-hover-glow group overflow-hidden rounded-2xl border border-warm-200 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
        <img
          src={displayPhoto}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {verified && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-700 backdrop-blur-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#0A6847"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verified
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-warm-900">{name}</h3>

        <div className="mt-1 flex items-center gap-1 text-sm text-warm-500">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {suburb}, {state}
        </div>

        <div className="mt-2">
          <ReviewStars rating={avgRating} count={reviewCount} size="sm" />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {specialisations.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700"
            >
              {s}
            </span>
          ))}
          {specialisations.length > 3 && (
            <span className="rounded-full bg-warm-100 px-2 py-0.5 text-xs text-warm-500">
              +{specialisations.length - 3}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-warm-100 pt-3">
          <span className="text-lg font-bold text-teal-900">
            ${hourlyRate}
            <span className="text-sm font-normal text-warm-500">/hr</span>
          </span>
          <Link
            href={`/trainers/${slug}`}
            className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-600"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
