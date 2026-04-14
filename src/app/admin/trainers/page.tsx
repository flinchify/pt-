"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { ReviewStars } from "@/components/review-stars";
import { useToast } from "@/components/toast";

interface Trainer {
  id: number;
  full_name: string;
  email: string;
  suburb: string;
  status: string;
  avg_rating: number;
  review_count: number;
}

const STATUS_OPTIONS = ["all", "active", "pending", "suspended"];

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/trainers${params}`);
      if (!res.ok) throw new Error("Failed to load trainers");
      const data = await res.json();
      setTrainers(data.trainers || []);
    } catch {
      setError("Could not load trainer list.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  async function updateStatus(trainerId: number, newStatus: string) {
    try {
      const res = await fetch("/api/admin/trainers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainer_id: trainerId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update trainer");
      toast(`Trainer ${newStatus === "active" ? "approved" : "suspended"}.`, "success");
      fetchTrainers();
    } catch {
      toast("Failed to update trainer status.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Trainer Management</h1>
        <p className="mt-1 text-sm text-navy-400">Review and manage trainer accounts.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>
      )}

      {/* Status Filter */}
      <div className="flex gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              statusFilter === s
                ? "bg-teal-600 text-white"
                : "border border-navy-600 bg-navy-800 text-navy-300 hover:bg-navy-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-8 text-center text-sm text-navy-400">
          No trainers found for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-700 bg-navy-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Suburb</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Rating</th>
                <th className="px-4 py-3 text-right font-semibold text-navy-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t) => (
                <tr key={t.id} className="border-b border-navy-800 last:border-0">
                  <td className="px-4 py-3 font-medium text-white">{t.full_name}</td>
                  <td className="px-4 py-3 text-navy-300">{t.email}</td>
                  <td className="px-4 py-3 text-navy-300">{t.suburb || "--"}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3">
                    <ReviewStars rating={t.avg_rating || 0} count={t.review_count} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {t.status !== "active" && (
                        <button
                          onClick={() => updateStatus(t.id, "active")}
                          className="rounded-lg bg-emerald-600/20 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
                        >
                          Approve
                        </button>
                      )}
                      {t.status !== "suspended" && (
                        <button
                          onClick={() => updateStatus(t.id, "suspended")}
                          className="rounded-lg bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-600/30"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
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
