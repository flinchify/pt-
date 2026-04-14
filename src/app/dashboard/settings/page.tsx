"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/components/toast";

const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Flexibility",
  "Endurance",
  "Strength",
  "Rehabilitation",
  "Sports Performance",
  "General Fitness",
  "Stress Relief",
  "Posture Improvement",
];

interface Profile {
  full_name: string;
  phone: string;
  fitness_goals: string[];
  medical_notes: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
}

export default function ClientSettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    fitness_goals: [],
    medical_notes: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/clients/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          fitness_goals: data.fitness_goals || [],
          medical_notes: data.medical_notes || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          emergency_contact_relationship: data.emergency_contact_relationship || "",
        });
      } catch {
        toast("Failed to load profile.", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleGoal(goal: string) {
    setProfile((prev) => ({
      ...prev,
      fitness_goals: prev.fitness_goals.includes(goal)
        ? prev.fitness_goals.filter((g) => g !== goal)
        : [...prev.fitness_goals, goal],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/clients/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      toast("Profile updated successfully!", "success");
    } catch {
      toast("Failed to save profile.", "error");
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-bold text-warm-900">Settings</h1>
        <p className="mt-1 text-sm text-warm-500">Manage your profile and preferences.</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-8"
      >
        {/* Personal Info */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Personal Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Full Name</span>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Phone</span>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="04XX XXX XXX"
              />
            </label>
          </div>
        </section>

        {/* Fitness Goals */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Fitness Goals</h2>
          <div className="flex flex-wrap gap-2">
            {FITNESS_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  profile.fitness_goals.includes(goal)
                    ? "bg-teal-600 text-white"
                    : "border border-warm-300 text-warm-600 hover:bg-warm-50"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </section>

        {/* Medical Notes */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Medical Notes</h2>
          <textarea
            value={profile.medical_notes}
            onChange={(e) => setProfile({ ...profile, medical_notes: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
            placeholder="Any injuries, conditions, or important medical information for your trainer..."
          />
        </section>

        {/* Emergency Contact */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Emergency Contact</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Name</span>
              <input
                type="text"
                value={profile.emergency_contact_name}
                onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Phone</span>
              <input
                type="tel"
                value={profile.emergency_contact_phone}
                onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="04XX XXX XXX"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Relationship</span>
              <select
                value={profile.emergency_contact_relationship}
                onChange={(e) => setProfile({ ...profile, emergency_contact_relationship: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              >
                <option value="">Select...</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
