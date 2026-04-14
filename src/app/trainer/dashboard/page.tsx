"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { BookingCard } from "@/components/booking-card";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Stats {
  earnings_this_month: number;
  pending_bookings: number;
  average_rating: number;
  total_reviews: number;
}

interface Booking {
  id: number;
  client_name: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  location_address: string;
  status: string;
  amount_cents: number;
}

export default function TrainerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const [sRes, bRes] = await Promise.all([
          fetch(`/api/trainers/${user!.user_id}/stats`),
          fetch(`/api/trainers/${user!.user_id}/bookings?date=${today}`),
        ]);

        if (sRes.ok) {
          const data = await sRes.json();
          setStats(data);
        }
        if (bRes.ok) {
          const data = await bRes.json();
          setTodayBookings(data.bookings || []);
        }
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

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

  const statCards = [
    {
      label: "Earnings This Month",
      value: stats ? `$${(stats.earnings_this_month / 100).toFixed(2)}` : "$0.00",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Pending Bookings",
      value: stats?.pending_bookings ?? 0,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    {
      label: "Average Rating",
      value: stats?.average_rating ? stats.average_rating.toFixed(1) : "--",
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      label: "Total Reviews",
      value: stats?.total_reviews ?? 0,
      color: "bg-navy-50 text-navy-700 border-navy-200",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Dashboard</h1>
        <p className="mt-1 text-sm text-warm-500">Welcome back, {user?.name}.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`rounded-xl border p-5 ${card.color}`}
          >
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Today's Schedule */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-warm-900">Today&apos;s Schedule</h2>
        {todayBookings.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No sessions scheduled for today.
          </div>
        ) : (
          <div className="space-y-3">
            {todayBookings.map((b) => (
              <BookingCard
                key={b.id}
                id={b.id}
                trainerName={b.client_name}
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
      </section>
    </div>
  );
}
