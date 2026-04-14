"use client";

import Link from "next/link";

interface GymCardProps {
  slug: string;
  name: string;
  logoUrl?: string;
  photoUrl?: string;
  suburb: string;
  state: string;
  amenities: string[];
  trainerCount: number;
}

export function GymCard({
  slug,
  name,
  logoUrl,
  photoUrl,
  suburb,
  state,
  amenities,
  trainerCount,
}: GymCardProps) {
  return (
    <Link
      href={`/gyms/${slug}`}
      className="card-hover-glow group block overflow-hidden rounded-2xl border border-warm-200 bg-white"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-warm-100">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-teal-50">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A6847"
              strokeWidth="1.5"
            >
              <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
              <path d="M2 20h20" />
              <path d="M14 12h.01" />
            </svg>
          </div>
        )}
        {logoUrl && (
          <img
            src={logoUrl}
            alt=""
            className="absolute bottom-3 left-3 h-10 w-10 rounded-lg border-2 border-white bg-white object-contain shadow-sm"
          />
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

        <div className="mt-3 flex flex-wrap gap-1.5">
          {amenities.slice(0, 4).map((a) => (
            <span
              key={a}
              className="rounded-full bg-warm-50 px-2 py-0.5 text-xs font-medium text-warm-600"
            >
              {a}
            </span>
          ))}
          {amenities.length > 4 && (
            <span className="rounded-full bg-warm-100 px-2 py-0.5 text-xs text-warm-500">
              +{amenities.length - 4}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-sm text-teal-700">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="font-medium">{trainerCount} trainers</span>
        </div>
      </div>
    </Link>
  );
}
