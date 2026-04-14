"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/components/toast";

interface CompanySettings {
  company_name: string;
  abn: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  stripe_subscription_status: string;
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Government",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Construction",
  "Professional Services",
  "Mining",
  "Agriculture",
  "Other",
];

export default function EnterpriseSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: "",
    abn: "",
    industry: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    stripe_subscription_status: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/enterprise/${user!.user_id}/settings`);
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings({
          company_name: data.company_name || "",
          abn: data.abn || "",
          industry: data.industry || "",
          contact_name: data.contact_name || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          stripe_subscription_status: data.stripe_subscription_status || "inactive",
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
      const res = await fetch(`/api/enterprise/${user.user_id}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast("Company settings updated!", "success");
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
        <h1 className="text-2xl font-bold text-warm-900">Company Settings</h1>
        <p className="mt-1 text-sm text-warm-500">Manage your company profile and billing.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Company Info */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Company Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-warm-700">Company Name</span>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">ABN</span>
              <input
                type="text"
                value={settings.abn}
                onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="XX XXX XXX XXX"
                maxLength={14}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Industry</span>
              <select
                value={settings.industry}
                onChange={(e) => setSettings({ ...settings, industry: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* Contact Info */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Contact Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Contact Name</span>
              <input
                type="text"
                value={settings.contact_name}
                onChange={(e) => setSettings({ ...settings, contact_name: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Contact Email</span>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-warm-700">Contact Phone</span>
              <input
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="04XX XXX XXX"
              />
            </label>
          </div>
        </section>

        {/* Billing */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Billing</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-warm-700">Stripe Subscription Status:</span>
            <StatusBadge status={settings.stripe_subscription_status || "inactive"} />
          </div>
          <p className="mt-2 text-sm text-warm-500">
            To manage your subscription and billing details, visit your Stripe customer portal.
          </p>
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
      </form>
    </div>
  );
}
