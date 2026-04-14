"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookingCard } from "@/components/booking-card";
import { GoalProgressBar } from "@/components/goal-progress-bar";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Booking {
  id: number;
  trainer_name: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  location_address: string;
  status: string;
  amount_cents: number;
}

interface ProgressEntry {
  weight_kg: number;
  recorded_at: string;
}

interface Goal {
  id: number;
  title: string;
  current_value: number;
  target_value: number;
  unit: string;
  target_date: string;
}

export default function ClientDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [progress, setProgress] = useState<ProgressEntry | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [bRes, pRes, gRes] = await Promise.all([
          fetch("/api/clients/me/bookings?status=confirmed&limit=3"),
          fetch("/api/clients/me/progress?limit=1"),
          fetch("/api/clients/me/goals"),
        ]);

        if (bRes.ok) {
          const data = await bRes.json();
          setBookings(data.bookings || []);
        }
        if (pRes.ok) {
          const data = await pRes.json();
          setProgress(data.entries?.[0] || null);
        }
        if (gRes.ok) {
          const data = await gRes.json();
          setGoals(data.goals || []);
        }
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Dashboard</h1>
        <p className="mt-1 text-sm text-warm-500">Welcome back. Here is your overview.</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {[
          { label: "Book a Session", href: "/trainers", color: "bg-teal-600 hover:bg-teal-700" },
          { label: "Log Progress", href: "/dashboard/progress", color: "bg-coral-500 hover:bg-coral-600" },
          { label: "View Goals", href: "/dashboard/goals", color: "bg-navy-800 hover:bg-navy-900" },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center justify-center rounded-xl px-4 py-4 text-sm font-semibold text-white shadow-sm transition-colors ${action.color}`}
          >
            {action.label}
          </Link>
        ))}
      </motion.div>

      {/* Upcoming Sessions */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-warm-900">Upcoming Sessions</h2>
          <Link href="/dashboard/bookings" className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View all
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No upcoming sessions. Book a trainer to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                id={b.id}
                trainerName={b.trainer_name}
                date={b.date}
                startTime={b.start_time}
                endTime={b.end_time}
                sessionType={b.session_type}
                locationAddress={b.location_address}
                status={b.status}
                amountCents={b.amount_cents}
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* Progress Snapshot */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-warm-900">Progress Snapshot</h2>
          <Link href="/dashboard/progress" className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View details
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-warm-200 bg-white p-5">
            <p className="text-sm text-warm-500">Latest Weight</p>
            <p className="mt-1 text-2xl font-bold text-warm-900">
              {progress ? `${progress.weight_kg} kg` : "--"}
            </p>
            {progress && (
              <p className="mt-1 text-xs text-warm-400">
                Recorded {new Date(progress.recorded_at).toLocaleDateString("en-AU")}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-warm-200 bg-white p-5">
            <p className="text-sm text-warm-500">Active Goals</p>
            <p className="mt-1 text-2xl font-bold text-warm-900">{goals.length}</p>
          </div>
        </div>
      </motion.section>

      {/* Goal Progress */}
      {goals.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-warm-900">Goal Progress</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.slice(0, 4).map((g) => (
              <GoalProgressBar
                key={g.id}
                title={g.title}
                current={g.current_value}
                target={g.target_value}
                unit={g.unit}
                targetDate={g.target_date ? new Date(g.target_date).toLocaleDateString("en-AU") : undefined}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
