"use client";

import { useCallback, useRef, useEffect, useState } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const pctMin = ((value[0] - min) / (max - min)) * 100;
  const pctMax = ((value[1] - min) / (max - min)) * 100;

  const getValFromX = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return min;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(min + pct * (max - min));
    },
    [min, max]
  );

  const handlePointerDown = useCallback(
    (handle: "min" | "max") => (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(handle);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const val = getValFromX(e.clientX);
      if (dragging === "min") {
        onChange([Math.min(val, value[1] - 5), value[1]]);
      } else {
        onChange([value[0], Math.max(val, value[0] + 5)]);
      }
    },
    [dragging, getValFromX, onChange, value]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-warm-700">
        <span>${value[0]}/hr</span>
        <span>${value[1]}/hr</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-6 select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-warm-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-teal-500"
          style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }}
        />
        <div
          className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-teal-600 bg-white shadow-md transition-shadow hover:shadow-lg ${
            dragging === "min" ? "cursor-grabbing ring-2 ring-teal-300" : ""
          }`}
          style={{ left: `${pctMin}%` }}
          onPointerDown={handlePointerDown("min")}
          role="slider"
          aria-label="Minimum price"
          aria-valuenow={value[0]}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={0}
        />
        <div
          className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-teal-600 bg-white shadow-md transition-shadow hover:shadow-lg ${
            dragging === "max" ? "cursor-grabbing ring-2 ring-teal-300" : ""
          }`}
          style={{ left: `${pctMax}%` }}
          onPointerDown={handlePointerDown("max")}
          role="slider"
          aria-label="Maximum price"
          aria-valuenow={value[1]}
          aria-valuemin={min}
          aria-valuemax={max}
          tabIndex={0}
        />
      </div>
    </div>
  );
}
