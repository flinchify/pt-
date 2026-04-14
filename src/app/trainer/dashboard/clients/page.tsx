"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";

interface ClientSummary {
  client_id: number;
  client_name: string;
  client_email: string;
  session_count: number;
  last_session_date: string;
  total_spent_cents: number;
}

export default function TrainerClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/trainers/${user!.user_id}/clients`);
        if (!res.ok) throw new Error("Failed to load clients");
        const data = await res.json();
        setClients(data.clients || []);
      } catch {
        setError("Could not load client list.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filtered = clients.filter(
    (c) =>
      c.client_name.toLowerCase().includes(search.toLowerCase()) ||
      c.client_email.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-warm-900">Clients</h1>
        <p className="mt-1 text-sm text-warm-500">View your client list and session history.</p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full max-w-sm rounded-lg border border-warm-300 px-4 py-2 text-sm text-warm-800 placeholder-warm-400"
        />
        <span className="text-sm text-warm-500">{filtered.length} client{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
          No clients found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200 bg-warm-50">
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Email</th>
                <th className="px-4 py-3 text-right font-semibold text-warm-700">Sessions</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Last Session</th>
                <th className="px-4 py-3 text-right font-semibold text-warm-700">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.client_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-warm-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-warm-800">{c.client_name}</td>
                  <td className="px-4 py-3 text-warm-600">{c.client_email}</td>
                  <td className="px-4 py-3 text-right text-warm-800">{c.session_count}</td>
                  <td className="px-4 py-3 text-warm-600">
                    {c.last_session_date
                      ? new Date(c.last_session_date).toLocaleDateString("en-AU")
                      : "--"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-warm-800">
                    ${(c.total_spent_cents / 100).toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
