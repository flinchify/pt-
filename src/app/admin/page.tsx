"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/loading-spinner";

interface AdminStats {
  total_users: number;
  trainers_active: number;
  trainers_pending: number;
  total_gyms: number;
  bookings_confirmed: number;
  bookings_completed: number;
  bookings_cancelled: number;
  bookings_pending: number;
  revenue_total_cents: number;
  revenue_this_month_cents: number;
}

function isAdminAuthenticated(): boolean {
  if (typeof document === "undefined") return false;
  const cookies = document.cookie.split(";").map((c) => c.trim());
  return cookies.some((c) => c.startsWith("admin_session="));
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid secret");
      }
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-teal-400">Anywhere</span>PT Admin
          </h1>
          <p className="mt-1 text-sm text-navy-400">Enter the admin secret to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-navy-700 bg-navy-900 p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-900/30 border border-red-800/50 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-navy-300">Admin Secret</span>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2.5 text-sm text-white placeholder-navy-500 focus:border-teal-500"
              placeholder="Enter secret..."
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data);
      } catch {
        setError("Failed to load admin dashboard data.");
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
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.total_users ?? 0, color: "border-teal-700 bg-teal-900/30 text-teal-300" },
    { label: "Trainers (Active)", value: stats?.trainers_active ?? 0, color: "border-emerald-700 bg-emerald-900/30 text-emerald-300" },
    { label: "Trainers (Pending)", value: stats?.trainers_pending ?? 0, color: "border-yellow-700 bg-yellow-900/30 text-yellow-300" },
    { label: "Gyms", value: stats?.total_gyms ?? 0, color: "border-navy-600 bg-navy-800 text-navy-200" },
    { label: "Bookings (Confirmed)", value: stats?.bookings_confirmed ?? 0, color: "border-blue-700 bg-blue-900/30 text-blue-300" },
    { label: "Bookings (Completed)", value: stats?.bookings_completed ?? 0, color: "border-green-700 bg-green-900/30 text-green-300" },
    { label: "Bookings (Pending)", value: stats?.bookings_pending ?? 0, color: "border-yellow-700 bg-yellow-900/30 text-yellow-300" },
    { label: "Bookings (Cancelled)", value: stats?.bookings_cancelled ?? 0, color: "border-red-700 bg-red-900/30 text-red-300" },
    {
      label: "Total Revenue",
      value: `$${((stats?.revenue_total_cents || 0) / 100).toFixed(0)}`,
      color: "border-coral-700 bg-coral-900/30 text-coral-300",
    },
    {
      label: "Revenue This Month",
      value: `$${((stats?.revenue_this_month_cents || 0) / 100).toFixed(0)}`,
      color: "border-teal-700 bg-teal-900/30 text-teal-300",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="mt-1 text-sm text-navy-400">Platform statistics at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className={`rounded-xl border p-5 ${card.color}`}
          >
            <p className="text-xs font-medium uppercase tracking-wider opacity-70">{card.label}</p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
