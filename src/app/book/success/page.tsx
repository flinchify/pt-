import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your session has been successfully booked through AnywherePT.",
};

export default function BookingSuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-scale-entrance"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-warm-900">
          Booking Confirmed
        </h1>
        <p className="mt-3 text-warm-500">
          Your session has been booked successfully. You will receive a confirmation email shortly with all the details.
        </p>

        <div className="mt-8 rounded-xl border border-warm-200 bg-cream p-5">
          <h2 className="text-sm font-semibold text-warm-700">What happens next?</h2>
          <ul className="mt-3 space-y-2 text-left text-sm text-warm-600">
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Your trainer will be notified of your booking.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              You will receive an email with session details and location info.
            </li>
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free cancellation up to 24 hours before your session.
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/trainers"
            className="rounded-xl border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50"
          >
            Browse More Trainers
          </Link>
        </div>
      </div>
    </div>
  );
}
