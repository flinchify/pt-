"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/components/toast";

interface AvailabilitySlot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  locationType: string;
}

interface Booking {
  id: number;
  client_name: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  status: string;
  location_address: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TrainerCalendarPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [weekBookings, setWeekBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [aRes, bRes] = await Promise.all([
        fetch(`/api/trainers/${user.user_id}/availability`),
        fetch(`/api/trainers/${user.user_id}/bookings?range=week`),
      ]);

      if (aRes.ok) {
        const data = await aRes.json();
        setSlots(data.slots || []);
      }
      if (bRes.ok) {
        const data = await bRes.json();
        setWeekBookings(data.bookings || []);
      }
    } catch {
      toast("Failed to load calendar data.", "error");
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAddSlot(slot: { day_of_week: number; start_time: string; end_time: string }) {
    if (!user) return;
    try {
      const res = await fetch(`/api/trainers/${user.user_id}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slot),
      });
      if (!res.ok) throw new Error("Failed to add slot");
      toast("Availability slot added.", "success");
      fetchData();
    } catch {
      toast("Failed to add availability slot.", "error");
    }
  }

  async function handleRemoveSlot(slotId: number) {
    if (!user) return;
    try {
      const res = await fetch(`/api/trainers/${user.user_id}/availability/${slotId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove slot");
      toast("Availability slot removed.", "success");
      fetchData();
    } catch {
      toast("Failed to remove availability slot.", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Calendar</h1>
        <p className="mt-1 text-sm text-warm-500">Manage your availability and view bookings.</p>
      </motion.div>

      {/* Availability Calendar */}
      <AvailabilityCalendar
        slots={slots}
        onSlotClick={(slot) => {
          if (slot.id) handleRemoveSlot(slot.id);
        }}
      />

      {/* Add Slot Form */}
      <AddSlotForm onAdd={handleAddSlot} />

      {/* Week Bookings */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-warm-900">This Week&apos;s Bookings</h2>
        {weekBookings.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No bookings this week.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 bg-warm-50">
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Client</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Location</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {weekBookings.map((b) => (
                  <tr key={b.id} className="border-b border-warm-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-warm-800">{b.client_name}</td>
                    <td className="px-4 py-3 text-warm-600">
                      {new Date(b.date).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3 text-warm-600">{b.start_time} - {b.end_time}</td>
                    <td className="px-4 py-3 text-warm-600">{b.session_type}</td>
                    <td className="max-w-[150px] truncate px-4 py-3 text-warm-600">{b.location_address}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function AddSlotForm({ onAdd }: { onAdd: (slot: { day_of_week: number; start_time: string; end_time: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-teal-300 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 w-full"
      >
        + Add Availability Slot
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-warm-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm text-warm-700">
          Day
          <select
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value, 10))}
            className="rounded-lg border border-warm-300 px-3 py-2 text-sm"
          >
            {DAYS.map((d, i) => (
              <option key={d} value={i}>{d}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-warm-700">
          Start Time
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-lg border border-warm-300 px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-warm-700">
          End Time
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-lg border border-warm-300 px-3 py-2 text-sm" />
        </label>
        <button
          onClick={() => { onAdd({ day_of_week: day, start_time: start, end_time: end }); setOpen(false); }}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Save
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-warm-300 px-4 py-2 text-sm font-medium text-warm-600 hover:bg-warm-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
