"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";

interface Booking {
  id: number;
  client_name: string;
  trainer_name: string;
  date: string;
  status: string;
  amount_cents: number;
}

const STATUS_OPTIONS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [trainerSearch, setTrainerSearch] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (trainerSearch) params.set("trainer", trainerSearch);
      const qs = params.toString() ? `?${params.toString()}` : "";

      const res = await fetch(`/api/admin/bookings${qs}`);
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFrom, dateTo, trainerSearch]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Bookings</h1>
        <p className="mt-1 text-sm text-navy-400">View and filter all platform bookings.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-sm capitalize text-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white"
          placeholder="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white"
          placeholder="To date"
        />
        <input
          type="text"
          value={trainerSearch}
          onChange={(e) => setTrainerSearch(e.target.value)}
          placeholder="Filter by trainer..."
          className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white placeholder-navy-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-8 text-center text-sm text-navy-400">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-700 bg-navy-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="px-4 py-3 text-left font-semibold text-navy-300">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Client</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Trainer</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-navy-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-navy-800 last:border-0">
                  <td className="px-4 py-3 text-navy-400">#{b.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{b.client_name}</td>
                  <td className="px-4 py-3 text-navy-300">{b.trainer_name}</td>
                  <td className="px-4 py-3 text-navy-300">
                    {new Date(b.date).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-right font-medium text-white">
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
