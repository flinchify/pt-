"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ProgressChart } from "@/components/progress-chart";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/components/toast";

interface ProgressEntry {
  id: number;
  weight_kg: number | null;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  arms_cm: number | null;
  thighs_cm: number | null;
  notes: string | null;
  recorded_at: string;
}

export default function ClientProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    weight_kg: "",
    body_fat_pct: "",
    chest_cm: "",
    waist_cm: "",
    hips_cm: "",
    arms_cm: "",
    thighs_cm: "",
    notes: "",
  });

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/clients/me/progress");
      if (!res.ok) throw new Error("Failed to load progress data");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setError("Could not load progress data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {};
      if (form.weight_kg) body.weight_kg = parseFloat(form.weight_kg);
      if (form.body_fat_pct) body.body_fat_pct = parseFloat(form.body_fat_pct);
      if (form.chest_cm) body.chest_cm = parseFloat(form.chest_cm);
      if (form.waist_cm) body.waist_cm = parseFloat(form.waist_cm);
      if (form.hips_cm) body.hips_cm = parseFloat(form.hips_cm);
      if (form.arms_cm) body.arms_cm = parseFloat(form.arms_cm);
      if (form.thighs_cm) body.thighs_cm = parseFloat(form.thighs_cm);
      if (form.notes) body.notes = form.notes;

      const res = await fetch("/api/clients/me/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      toast("Progress entry saved!", "success");
      setShowForm(false);
      setForm({ weight_kg: "", body_fat_pct: "", chest_cm: "", waist_cm: "", hips_cm: "", arms_cm: "", thighs_cm: "", notes: "" });
      fetchEntries();
    } catch {
      toast("Failed to save progress entry.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const weightData = entries
    .filter((e) => e.weight_kg !== null)
    .map((e) => ({ date: e.recorded_at, value: e.weight_kg! }))
    .reverse();

  const bodyFatData = entries
    .filter((e) => e.body_fat_pct !== null)
    .map((e) => ({ date: e.recorded_at, value: e.body_fat_pct! }))
    .reverse();

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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Progress Tracking</h1>
          <p className="mt-1 text-sm text-warm-500">Track your fitness journey over time.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          {showForm ? "Cancel" : "Add Entry"}
        </button>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Add Entry Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="rounded-xl border border-warm-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-warm-900">New Progress Entry</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "weight_kg", label: "Weight (kg)" },
              { key: "body_fat_pct", label: "Body Fat (%)" },
              { key: "chest_cm", label: "Chest (cm)" },
              { key: "waist_cm", label: "Waist (cm)" },
              { key: "hips_cm", label: "Hips (cm)" },
              { key: "arms_cm", label: "Arms (cm)" },
              { key: "thighs_cm", label: "Thighs (cm)" },
            ].map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">{label}</span>
                <input
                  type="number"
                  step="0.1"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  placeholder="0.0"
                />
              </label>
            ))}
          </div>
          <label className="mt-4 flex flex-col gap-1">
            <span className="text-sm font-medium text-warm-700">Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              placeholder="How are you feeling? Any observations..."
            />
          </label>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </motion.form>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProgressChart data={weightData} label="Weight" unit="kg" />
        <ProgressChart data={bodyFatData} label="Body Fat" unit="%" />
      </div>

      {/* Body Measurements */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-warm-900">Body Measurements</h2>
        {entries.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No entries yet. Add your first progress entry above.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 bg-warm-50">
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Weight</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Body Fat</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Chest</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Waist</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Hips</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Arms</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Thighs</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-warm-100 last:border-0">
                    <td className="px-4 py-3 text-warm-700">
                      {new Date(entry.recorded_at).toLocaleDateString("en-AU")}
                    </td>
                    <td className="px-4 py-3 text-right text-warm-800">
                      {entry.weight_kg ? `${entry.weight_kg} kg` : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-warm-800">
                      {entry.body_fat_pct ? `${entry.body_fat_pct}%` : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-warm-800">
                      {entry.chest_cm ? `${entry.chest_cm}` : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-warm-800">
                      {entry.waist_cm ? `${entry.waist_cm}` : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-warm-800">
                      {entry.hips_cm ? `${entry.hips_cm}` : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-warm-800">
                      {entry.arms_cm ? `${entry.arms_cm}` : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-warm-800">
                      {entry.thighs_cm ? `${entry.thighs_cm}` : "--"}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-warm-600">
                      {entry.notes || "--"}
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
