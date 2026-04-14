"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/loading-spinner";

interface RevenueData {
  total_revenue_cents: number;
  total_platform_fees_cents: number;
  total_trainer_payouts_cents: number;
  monthly: { month: string; revenue_cents: number; fees_cents: number; payouts_cents: number }[];
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/revenue");
        if (!res.ok) throw new Error("Failed to load revenue data");
        const json = await res.json();
        setData(json);
      } catch {
        setError("Could not load revenue analytics.");
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
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-6 text-center text-red-400">{error}</div>
    );
  }

  const maxMonthly = Math.max(...(data?.monthly.map((m) => m.revenue_cents) || [1]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
        <p className="mt-1 text-sm text-navy-400">Platform financial overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-700 bg-emerald-900/30 p-5"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">
            ${((data?.total_revenue_cents || 0) / 100).toFixed(2)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-teal-700 bg-teal-900/30 p-5"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-teal-400">Platform Fees</p>
          <p className="mt-2 text-2xl font-bold text-teal-300">
            ${((data?.total_platform_fees_cents || 0) / 100).toFixed(2)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-coral-700 bg-coral-900/30 p-5"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-coral-400">Trainer Payouts</p>
          <p className="mt-2 text-2xl font-bold text-coral-300">
            ${((data?.total_trainer_payouts_cents || 0) / 100).toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Monthly Revenue Chart */}
      {data && data.monthly.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Monthly Revenue</h2>
          <div className="rounded-xl border border-navy-700 bg-navy-900 p-6">
            <div className="flex items-end gap-2" style={{ height: 220 }}>
              {data.monthly.map((m) => {
                const pct = maxMonthly > 0 ? (m.revenue_cents / maxMonthly) * 100 : 0;
                return (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-medium text-navy-300">
                      ${(m.revenue_cents / 100).toFixed(0)}
                    </span>
                    <div
                      className="w-full max-w-[36px] rounded-t bg-teal-500 transition-all"
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    />
                    <span className="text-[10px] text-navy-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Breakdown Table */}
      {data && data.monthly.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Monthly Breakdown</h2>
          <div className="overflow-x-auto rounded-xl border border-navy-700 bg-navy-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="px-4 py-3 text-left font-semibold text-navy-300">Month</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy-300">Revenue</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy-300">Platform Fees</th>
                  <th className="px-4 py-3 text-right font-semibold text-navy-300">Trainer Payouts</th>
                </tr>
              </thead>
              <tbody>
                {data.monthly.map((m) => (
                  <tr key={m.month} className="border-b border-navy-800 last:border-0">
                    <td className="px-4 py-3 font-medium text-white">{m.month}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">
                      ${(m.revenue_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-teal-400">
                      ${(m.fees_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-coral-400">
                      ${(m.payouts_cents / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
