"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/components/toast";

interface EarningsData {
  total_earnings_cents: number;
  pending_payout_cents: number;
  platform_fees_cents: number;
  stripe_connected: boolean;
  monthly_earnings: { month: string; amount_cents: number }[];
  payouts: { id: number; amount_cents: number; status: string; created_at: string }[];
}

export default function TrainerEarningsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connectingStripe, setConnectingStripe] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/trainers/${user!.user_id}/earnings`);
        if (!res.ok) throw new Error("Failed to load earnings");
        const json = await res.json();
        setData(json);
      } catch {
        setError("Could not load earnings data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function connectStripe() {
    if (!user) return;
    setConnectingStripe(true);
    try {
      const res = await fetch(`/api/trainers/${user.user_id}/stripe-connect`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to start Stripe Connect");
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        toast("Stripe Connect initiated.", "success");
      }
    } catch {
      toast("Failed to connect Stripe.", "error");
    } finally {
      setConnectingStripe(false);
    }
  }

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

  const maxMonthly = Math.max(...(data?.monthly_earnings.map((m) => m.amount_cents) || [1]));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Earnings</h1>
        <p className="mt-1 text-sm text-warm-500">Track your income and payouts.</p>
      </motion.div>

      {/* Stripe Connect Banner */}
      {data && !data.stripe_connected && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-800">Stripe Not Connected</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Connect your Stripe account to receive payouts directly to your bank account.
              </p>
            </div>
            <button
              onClick={connectStripe}
              disabled={connectingStripe}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
            >
              {connectingStripe ? "Connecting..." : "Connect Stripe"}
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">Total Earnings</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">
            ${((data?.total_earnings_cents || 0) / 100).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
          <p className="text-sm font-medium text-teal-700">Pending Payouts</p>
          <p className="mt-1 text-2xl font-bold text-teal-800">
            ${((data?.pending_payout_cents || 0) / 100).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-warm-200 bg-warm-50 p-5">
          <p className="text-sm font-medium text-warm-600">Platform Fees Paid</p>
          <p className="mt-1 text-2xl font-bold text-warm-800">
            ${((data?.platform_fees_cents || 0) / 100).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      {data && data.monthly_earnings.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-warm-900">Monthly Earnings</h2>
          <div className="rounded-xl border border-warm-200 bg-white p-6">
            <div className="flex items-end gap-2" style={{ height: 200 }}>
              {data.monthly_earnings.map((m) => {
                const pct = maxMonthly > 0 ? (m.amount_cents / maxMonthly) * 100 : 0;
                return (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-medium text-warm-700">
                      ${(m.amount_cents / 100).toFixed(0)}
                    </span>
                    <div
                      className="w-full max-w-[40px] rounded-t bg-teal-500 transition-all"
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    />
                    <span className="text-[10px] text-warm-500">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Payout History */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-warm-900">Payout History</h2>
        {!data?.payouts || data.payouts.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No payouts yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 bg-warm-50">
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">ID</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.payouts.map((p) => (
                  <tr key={p.id} className="border-b border-warm-100 last:border-0">
                    <td className="px-4 py-3 text-warm-600">#{p.id}</td>
                    <td className="px-4 py-3 text-right font-medium text-warm-800">
                      ${(p.amount_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-warm-600">
                      {new Date(p.created_at).toLocaleDateString("en-AU")}
                    </td>
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
