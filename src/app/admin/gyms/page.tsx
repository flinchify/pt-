"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/components/toast";

interface Gym {
  id: number;
  name: string;
  suburb: string;
  verified: boolean;
  trainer_count: number;
}

export default function AdminGymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const fetchGyms = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gyms");
      if (!res.ok) throw new Error("Failed to load gyms");
      const data = await res.json();
      setGyms(data.gyms || []);
    } catch {
      setError("Could not load gym list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  async function toggleVerification(gymId: number, verified: boolean) {
    try {
      const res = await fetch("/api/admin/gyms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gym_id: gymId, verified }),
      });
      if (!res.ok) throw new Error("Failed to update gym");
      toast(`Gym ${verified ? "verified" : "unverified"}.`, "success");
      fetchGyms();
    } catch {
      toast("Failed to update gym status.", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gym Management</h1>
        <p className="mt-1 text-sm text-navy-400">Review and verify gym registrations.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : gyms.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-8 text-center text-sm text-navy-400">
          No gyms registered.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-700 bg-navy-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Suburb</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Verified</th>
                <th className="px-4 py-3 text-right font-semibold text-navy-300">Trainers</th>
                <th className="px-4 py-3 text-right font-semibold text-navy-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gyms.map((g) => (
                <tr key={g.id} className="border-b border-navy-800 last:border-0">
                  <td className="px-4 py-3 font-medium text-white">{g.name}</td>
                  <td className="px-4 py-3 text-navy-300">{g.suburb || "--"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={g.verified ? "active" : "pending"} />
                  </td>
                  <td className="px-4 py-3 text-right text-navy-300">{g.trainer_count}</td>
                  <td className="px-4 py-3 text-right">
                    {g.verified ? (
                      <button
                        onClick={() => toggleVerification(g.id, false)}
                        className="rounded-lg bg-red-600/20 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-600/30"
                      >
                        Unverify
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleVerification(g.id, true)}
                        className="rounded-lg bg-emerald-600/20 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-600/30"
                      >
                        Verify
                      </button>
                    )}
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
