"use client";

interface AvailabilitySlot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  locationType: string;
}

interface AvailabilityCalendarProps {
  slots: AvailabilitySlot[];
  onSlotClick?: (slot: AvailabilitySlot) => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6am to 7pm

function formatHour(h: number): string {
  const ampm = h >= 12 ? "pm" : "am";
  const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hr}${ampm}`;
}

function parseHour(time: string): number {
  return parseInt(time.split(":")[0], 10);
}

export function AvailabilityCalendar({
  slots,
  onSlotClick,
}: AvailabilityCalendarProps) {
  const getSlotForCell = (day: number, hour: number) => {
    return slots.find((s) => {
      const start = parseHour(s.startTime);
      const end = parseHour(s.endTime);
      // dayOfWeek: 0=Sun,1=Mon,...6=Sat => remap to Mon=0 display
      const displayDay = s.dayOfWeek === 0 ? 6 : s.dayOfWeek - 1;
      return displayDay === day && hour >= start && hour < end;
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
      <div className="min-w-[560px]">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-warm-200">
          <div className="p-2" />
          {DAYS.map((d) => (
            <div
              key={d}
              className="border-l border-warm-100 p-2 text-center text-xs font-semibold text-warm-700"
            >
              {d}
            </div>
          ))}
        </div>

        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-warm-50 last:border-b-0"
          >
            <div className="flex items-center justify-end pr-2 text-[11px] text-warm-400">
              {formatHour(hour)}
            </div>
            {DAYS.map((_, dayIdx) => {
              const slot = getSlotForCell(dayIdx, hour);
              const isAvailable = !!slot;
              return (
                <button
                  key={dayIdx}
                  onClick={() => slot && onSlotClick?.(slot)}
                  disabled={!isAvailable && !onSlotClick}
                  className={`h-8 border-l border-warm-50 transition-colors ${
                    isAvailable
                      ? "cursor-pointer bg-teal-100 hover:bg-teal-200"
                      : "bg-white"
                  }`}
                  title={
                    slot
                      ? `${slot.startTime} - ${slot.endTime} (${slot.locationType})`
                      : undefined
                  }
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 border-t border-warm-200 px-4 py-2">
        <div className="flex items-center gap-1.5 text-xs text-warm-500">
          <div className="h-3 w-3 rounded bg-teal-100" />
          Available
        </div>
        <div className="flex items-center gap-1.5 text-xs text-warm-500">
          <div className="h-3 w-3 rounded bg-white border border-warm-200" />
          Unavailable
        </div>
      </div>
    </div>
  );
}
