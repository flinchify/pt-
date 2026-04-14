"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";

interface EnterpriseStats {
  active_employees: number;
  sessions_this_month: number;
  budget_used_cents: number;
  budget_total_cents: number;
}

export default function EnterpriseDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<EnterpriseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/enterprise/${user!.user_id}/stats`);
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

  const budgetPct =
    stats && stats.budget_total_cents > 0
      ? Math.round((stats.budget_used_cents / stats.budget_total_cents) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Enterprise Dashboard</h1>
        <p className="mt-1 text-sm text-warm-500">Manage your corporate wellness program.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-teal-200 bg-teal-50 p-5"
        >
          <p className="text-sm font-medium text-teal-700">Active Employees</p>
          <p className="mt-1 text-2xl font-bold text-teal-800">{stats?.active_employees ?? 0}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-xl border border-coral-200 bg-coral-50 p-5"
        >
          <p className="text-sm font-medium text-coral-700">Sessions This Month</p>
          <p className="mt-1 text-2xl font-bold text-coral-800">{stats?.sessions_this_month ?? 0}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-navy-200 bg-navy-50 p-5"
        >
          <p className="text-sm font-medium text-navy-700">Budget Used</p>
          <p className="mt-1 text-2xl font-bold text-navy-800">
            ${((stats?.budget_used_cents || 0) / 100).toFixed(0)} / ${((stats?.budget_total_cents || 0) / 100).toFixed(0)}
          </p>
        </motion.div>
      </div>

      {/* Budget Usage Bar */}
      <section className="rounded-xl border border-warm-200 bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-warm-900">Budget Usage</h2>
          <span className="text-sm font-medium text-warm-500">{budgetPct}%</span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-warm-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPct >= 90 ? "bg-red-500" : budgetPct >= 70 ? "bg-yellow-500" : "bg-teal-500"
            }`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-warm-500">
          ${((stats?.budget_used_cents || 0) / 100).toFixed(2)} of ${((stats?.budget_total_cents || 0) / 100).toFixed(2)} budget used this period.
        </p>
      </section>
    </div>
  );
}
