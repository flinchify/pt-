"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GoalProgressBar } from "@/components/goal-progress-bar";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";

interface Goal {
  id: number;
  title: string;
  description: string;
  current_value: number;
  target_value: number;
  unit: string;
  target_date: string | null;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  target_value: "",
  unit: "",
  target_date: "",
};

export default function ClientGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/clients/me/goals");
      if (!res.ok) throw new Error("Failed to load goals");
      const data = await res.json();
      setGoals(data.goals || []);
    } catch {
      setError("Could not load goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  function openAddModal() {
    setEditingGoal(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEditModal(goal: Goal) {
    setEditingGoal(goal);
    setForm({
      title: goal.title,
      description: goal.description || "",
      target_value: goal.target_value.toString(),
      unit: goal.unit,
      target_date: goal.target_date ? goal.target_date.split("T")[0] : "",
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.target_value || !form.unit) {
      toast("Please fill in all required fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        target_value: parseFloat(form.target_value),
        unit: form.unit,
        target_date: form.target_date || null,
      };

      const url = editingGoal
        ? `/api/clients/me/goals/${editingGoal.id}`
        : "/api/clients/me/goals";
      const method = editingGoal ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save goal");

      toast(editingGoal ? "Goal updated!" : "Goal created!", "success");
      setModalOpen(false);
      fetchGoals();
    } catch {
      toast("Failed to save goal.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteGoal(id: number) {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      const res = await fetch(`/api/clients/me/goals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete goal");
      toast("Goal deleted.", "success");
      fetchGoals();
    } catch {
      toast("Failed to delete goal.", "error");
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Goals</h1>
          <p className="mt-1 text-sm text-warm-500">Set and track your fitness goals.</p>
        </div>
        <button
          onClick={openAddModal}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Add Goal
        </button>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {goals.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
          No goals yet. Add your first fitness goal to start tracking.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="relative">
                <GoalProgressBar
                  title={goal.title}
                  current={goal.current_value}
                  target={goal.target_value}
                  unit={goal.unit}
                  targetDate={
                    goal.target_date
                      ? new Date(goal.target_date).toLocaleDateString("en-AU")
                      : undefined
                  }
                />
                <div className="absolute right-4 top-4 flex gap-1">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="rounded p-1 text-warm-400 hover:bg-warm-100 hover:text-warm-600"
                    title="Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="rounded p-1 text-warm-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="mb-4 text-lg font-bold text-warm-900">
            {editingGoal ? "Edit Goal" : "Add Goal"}
          </h2>
          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Title *</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="e.g. Lose 5kg"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="Describe your goal..."
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">Target Value *</span>
                <input
                  type="number"
                  step="0.1"
                  value={form.target_value}
                  onChange={(e) => setForm({ ...form, target_value: e.target.value })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  placeholder="10"
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">Unit *</span>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  placeholder="kg, sessions, km"
                  required
                />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Target Date</span>
              <input
                type="date"
                value={form.target_date}
                onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-warm-300 px-4 py-2 text-sm font-medium text-warm-600 hover:bg-warm-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
