"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/components/toast";

interface GymTrainer {
  id: number;
  trainer_name: string;
  trainer_email: string;
  status: string;
  joined_at: string;
}

export default function GymTrainersPage() {
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<GymTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const { toast } = useToast();

  const fetchTrainers = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/gyms/${user.user_id}/trainers`);
      if (!res.ok) throw new Error("Failed to load trainers");
      const data = await res.json();
      setTrainers(data.trainers || []);
    } catch {
      setError("Could not load trainer list.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  async function inviteTrainer(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch(`/api/gyms/${user.user_id}/trainers/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      if (!res.ok) throw new Error("Failed to invite trainer");
      toast("Invitation sent!", "success");
      setInviteEmail("");
      fetchTrainers();
    } catch {
      toast("Failed to send invitation.", "error");
    } finally {
      setInviting(false);
    }
  }

  async function removeTrainer(trainerId: number) {
    if (!user) return;
    if (!confirm("Are you sure you want to remove this trainer?")) return;
    try {
      const res = await fetch(`/api/gyms/${user.user_id}/trainers/${trainerId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove trainer");
      toast("Trainer removed.", "success");
      fetchTrainers();
    } catch {
      toast("Failed to remove trainer.", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Manage Trainers</h1>
        <p className="mt-1 text-sm text-warm-500">Invite and manage trainers at your gym.</p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Invite Form */}
      <form onSubmit={inviteTrainer} className="rounded-xl border border-warm-200 bg-white p-5">
        <h3 className="mb-3 text-base font-semibold text-warm-900">Invite Trainer</h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="trainer@example.com"
            className="flex-1 rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
            required
          />
          <button
            type="submit"
            disabled={inviting}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {inviting ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </form>

      {/* Trainers List */}
      {trainers.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
          No trainers registered at your gym yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200 bg-warm-50">
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Joined</th>
                <th className="px-4 py-3 text-right font-semibold text-warm-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t) => (
                <tr key={t.id} className="border-b border-warm-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-warm-800">{t.trainer_name}</td>
                  <td className="px-4 py-3 text-warm-600">{t.trainer_email}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-warm-600">
                    {new Date(t.joined_at).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeTrainer(t.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
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
