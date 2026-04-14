import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Cancelled",
  description: "Your booking was not completed.",
};

export default function BookingCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warm-100">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-warm-900">
          Booking Cancelled
        </h1>
        <p className="mt-3 text-warm-500">
          Your booking was not completed and you have not been charged. If this was a mistake, you can try booking again.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/trainers"
            className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Browse Trainers
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
