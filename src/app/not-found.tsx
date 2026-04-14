import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto h-40 w-40">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <circle cx="100" cy="100" r="90" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2" />
            <text
              x="100"
              y="95"
              textAnchor="middle"
              dominantBaseline="central"
              className="font-display"
              fontSize="56"
              fontWeight="700"
              fill="#0A6847"
            >
              404
            </text>
            <path
              d="M70 140 Q100 125 130 140"
              stroke="#16A34A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-warm-900">
          Page Not Found
        </h1>
        <p className="mt-3 text-warm-500">
          The page you are looking for does not exist or has been moved. Let us help you get back on track.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Go Home
          </Link>
          <Link
            href="/trainers"
            className="rounded-full border border-warm-200 px-6 py-3 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50"
          >
            Find Trainers
          </Link>
        </div>
      </div>
    </div>
  );
}
