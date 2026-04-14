"use client";

import { StatusBadge } from "./status-badge";

interface BookingCardProps {
  id: number;
  trainerName: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  locationAddress: string;
  status: string;
  amountCents: number;
  onReview?: (bookingId: number) => void;
}

export function BookingCard({
  id,
  trainerName,
  date,
  startTime,
  endTime,
  sessionType,
  locationAddress,
  status,
  amountCents,
  onReview,
}: BookingCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? "pm" : "am";
    const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    return `${hr12}:${m}${ampm}`;
  };

  return (
    <div className="rounded-xl border border-warm-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-base font-semibold text-warm-900">
              {trainerName}
            </h4>
            <StatusBadge status={status} />
          </div>

          <div className="mt-2 space-y-1 text-sm text-warm-600">
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>
                {formattedDate} -- {formatTime(startTime)} - {formatTime(endTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
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
              <span className="truncate">{locationAddress}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
              <span>{sessionType}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-lg font-bold text-teal-900">
            ${(amountCents / 100).toFixed(2)}
          </span>
          {status === "completed" && onReview && (
            <button
              onClick={() => onReview(id)}
              className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"
            >
              Leave Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
