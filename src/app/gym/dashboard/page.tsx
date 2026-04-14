"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";

interface GymStats {
  active_trainer_count: number;
  bookings_this_month: number;
  total_bookings: number;
  revenue_this_month_cents: number;
}

export default function GymDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GymStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/gyms/${user!.user_id}/stats`);
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data);
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
    );
  }

  const cards = [
    { label: "Active Trainers", value: stats?.active_trainer_count ?? 0, color: "bg-teal-50 text-teal-700 border-teal-200" },
    { label: "Bookings This Month", value: stats?.bookings_this_month ?? 0, color: "bg-coral-50 text-coral-700 border-coral-200" },
    { label: "Total Bookings", value: stats?.total_bookings ?? 0, color: "bg-navy-50 text-navy-700 border-navy-200" },
    {
      label: "Revenue This Month",
      value: `$${((stats?.revenue_this_month_cents || 0) / 100).toFixed(2)}`,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Gym Dashboard</h1>
        <p className="mt-1 text-sm text-warm-500">Overview of your gym&apos;s activity.</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
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
    </div>
  );
}
