"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";

interface Booking {
  id: number;
  client_name: string;
  trainer_name: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  status: string;
  amount_cents: number;
}

export default function GymBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("");

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateFilter) params.set("date", dateFilter);
      if (trainerFilter) params.set("trainer", trainerFilter);
      const qs = params.toString() ? `?${params.toString()}` : "";

      const res = await fetch(`/api/gyms/${user.user_id}/bookings${qs}`);
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [user, dateFilter, trainerFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const trainerNames = [...new Set(bookings.map((b) => b.trainer_name))];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Bookings</h1>
        <p className="mt-1 text-sm text-warm-500">Sessions booked at your gym.</p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm text-warm-700">
          Date
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-warm-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-warm-700">
          Trainer
          <select
            value={trainerFilter}
            onChange={(e) => setTrainerFilter(e.target.value)}
            className="rounded-lg border border-warm-300 px-3 py-2 text-sm"
          >
            <option value="">All trainers</option>
            {trainerNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200 bg-warm-50">
                <th className="px-4 py-3 text-left font-semibold text-warm-700">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Client</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Trainer</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Time</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-warm-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-warm-100 last:border-0">
                  <td className="px-4 py-3 text-warm-500">#{b.id}</td>
                  <td className="px-4 py-3 font-medium text-warm-800">{b.client_name}</td>
                  <td className="px-4 py-3 text-warm-600">{b.trainer_name}</td>
                  <td className="px-4 py-3 text-warm-600">
                    {new Date(b.date).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3 text-warm-600">{b.start_time} - {b.end_time}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-right font-medium text-warm-800">
                    ${(b.amount_cents / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
