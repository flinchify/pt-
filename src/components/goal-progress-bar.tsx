"use client";

interface GoalProgressBarProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  targetDate?: string;
}

export function GoalProgressBar({
  title,
  current,
  target,
  unit,
  targetDate,
}: GoalProgressBarProps) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

  let barColor = "bg-teal-500";
  if (pct >= 100) barColor = "bg-emerald-500";
  else if (pct >= 75) barColor = "bg-teal-500";
  else if (pct >= 50) barColor = "bg-yellow-500";
  else barColor = "bg-coral-500";

  return (
    <div className="rounded-xl border border-warm-200 bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-warm-800">{title}</h4>
        <span className="text-xs font-medium text-warm-500">{pct}%</span>
      </div>
      <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-warm-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-warm-500">
        <span>
          {current} / {target} {unit}
        </span>
        {targetDate && <span>Target: {targetDate}</span>}
      </div>
    </div>
  );
}
