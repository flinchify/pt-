"use client";

interface DataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  label: string;
  unit: string;
}

export function ProgressChart({ data, label, unit }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-warm-200 bg-white text-sm text-warm-400">
        No data yet
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 400;
  const height = 180;
  const padX = 48;
  const padY = 24;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padY + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - padY} L ${points[0].x.toFixed(1)} ${height - padY} Z`;

  const yTicks = 4;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
    const val = minVal + (range / yTicks) * i;
    return {
      val: Math.round(val * 10) / 10,
      y: padY + chartH - (i / yTicks) * chartH,
    };
  });

  return (
    <div className="rounded-xl border border-warm-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-warm-800">{label}</h4>
        <span className="text-xs text-warm-500">{unit}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yLabels.map((tick) => (
          <g key={tick.val}>
            <line
              x1={padX}
              y1={tick.y}
              x2={width - padX}
              y2={tick.y}
              stroke="#E2E5EB"
              strokeWidth="0.5"
            />
            <text
              x={padX - 6}
              y={tick.y + 3}
              textAnchor="end"
              fill="#94A3B8"
              fontSize="9"
            >
              {tick.val}
            </text>
          </g>
        ))}

        <path d={areaD} fill="url(#chartGrad)" />
        <path
          d={pathD}
          fill="none"
          stroke="#0D9488"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#fff"
            stroke="#0D9488"
            strokeWidth="1.5"
          />
        ))}

        {points.length <= 12 &&
          points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="8"
            >
              {new Date(p.date).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
              })}
            </text>
          ))}
      </svg>
    </div>
  );
}
