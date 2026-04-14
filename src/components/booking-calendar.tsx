"use client";

import { useState, useMemo } from "react";

interface TimeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
}

interface BookingCalendarProps {
  availableSlots: TimeSlot[];
  selectedDate: string | null;
  onSelect: (date: string, startTime: string, endTime: string) => void;
}

export function BookingCalendar({
  availableSlots,
  selectedDate,
  onSelect,
}: BookingCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const availableDates = useMemo(
    () => new Set(availableSlots.map((s) => s.date)),
    [availableSlots]
  );

  const slotsForDate = useMemo(
    () =>
      selectedDate
        ? availableSlots.filter((s) => s.date === selectedDate)
        : [],
    [availableSlots, selectedDate]
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Shift to Monday start

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = currentMonth.toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () =>
    setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(year, month + 1, 1));

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hr = parseInt(h, 10);
    const ampm = hr >= 12 ? "pm" : "am";
    const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
    return `${hr12}:${m}${ampm}`;
  };

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  return (
    <div className="rounded-xl border border-warm-200 bg-white">
      <div className="flex items-center justify-between border-b border-warm-100 px-4 py-3">
        <button
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-500 transition-colors hover:bg-warm-100"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-warm-800">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-warm-500 transition-colors hover:bg-warm-100"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[11px] font-medium text-warm-400"
            >
              {d}
            </div>
          ))}

          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const dateStr = formatDate(day);
            const isAvailable = availableDates.has(dateStr);
            const isSelected = selectedDate === dateStr;
            const past = isPast(day);

            return (
              <button
                key={i}
                disabled={!isAvailable || past}
                onClick={() => {
                  if (isAvailable && !past) {
                    const firstSlot = availableSlots.find(
                      (s) => s.date === dateStr
                    );
                    if (firstSlot) {
                      onSelect(dateStr, firstSlot.startTime, firstSlot.endTime);
                    }
                  }
                }}
                className={`flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors ${
                  isSelected
                    ? "bg-teal-600 font-semibold text-white"
                    : isAvailable && !past
                    ? "font-medium text-teal-700 hover:bg-teal-50"
                    : "text-warm-300"
                }`}
              >
                {day}
                {isAvailable && !past && !isSelected && (
                  <span className="absolute mt-5 h-1 w-1 rounded-full bg-teal-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && slotsForDate.length > 0 && (
        <div className="border-t border-warm-100 p-3">
          <p className="mb-2 text-xs font-semibold text-warm-600">
            Available times for{" "}
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-AU", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </p>
          <div className="flex flex-wrap gap-2">
            {slotsForDate.map((slot, i) => (
              <button
                key={i}
                onClick={() =>
                  onSelect(slot.date, slot.startTime, slot.endTime)
                }
                className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
              >
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
