"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/components/toast";

interface Settings {
  full_name: string;
  email: string;
  phone: string;
  notify_new_booking: boolean;
  notify_booking_cancelled: boolean;
  notify_new_review: boolean;
  notify_payout: boolean;
  notify_marketing: boolean;
}

export default function TrainerSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    full_name: "",
    email: "",
    phone: "",
    notify_new_booking: true,
    notify_booking_cancelled: true,
    notify_new_review: true,
    notify_payout: true,
    notify_marketing: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/trainers/${user!.user_id}/settings`);
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          notify_new_booking: data.notify_new_booking ?? true,
          notify_booking_cancelled: data.notify_booking_cancelled ?? true,
          notify_new_review: data.notify_new_review ?? true,
          notify_payout: data.notify_payout ?? true,
          notify_marketing: data.notify_marketing ?? false,
        });
      } catch {
        toast("Failed to load settings.", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/trainers/${user.user_id}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast("Settings updated!", "success");
    } catch {
      toast("Failed to save settings.", "error");
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
        <p className="mt-1 text-sm text-warm-500">Manage your account and notification preferences.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Account Info */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Account Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Full Name</span>
              <input
                type="text"
                value={settings.full_name}
                onChange={(e) => setSettings({ ...settings, full_name: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Email</span>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-warm-700">Phone</span>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="04XX XXX XXX"
              />
            </label>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Notification Preferences</h2>
          <div className="space-y-3">
            {[
              { key: "notify_new_booking", label: "New booking notifications" },
              { key: "notify_booking_cancelled", label: "Booking cancellation notifications" },
              { key: "notify_new_review", label: "New review notifications" },
              { key: "notify_payout", label: "Payout notifications" },
              { key: "notify_marketing", label: "Marketing and promotional emails" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key as keyof Settings] as boolean}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="h-4 w-4 rounded border-warm-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-warm-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
