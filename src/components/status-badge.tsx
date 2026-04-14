"use client";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  no_show: "bg-warm-100 text-warm-600 border-warm-200",
  active: "bg-green-100 text-green-800 border-green-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
  removed: "bg-warm-100 text-warm-600 border-warm-200",
  past_due: "bg-orange-100 text-orange-800 border-orange-200",
};

function formatLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style =
    statusStyles[status] || "bg-warm-100 text-warm-600 border-warm-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {formatLabel(status)}
    </span>
  );
}
