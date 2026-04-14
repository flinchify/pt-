"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/components/toast";

const AMENITIES = [
  "Parking",
  "Showers",
  "Lockers",
  "Towels",
  "WiFi",
  "Air Conditioning",
  "Sauna",
  "Pool",
  "Cafe",
  "Personal Training Area",
  "Group Fitness Studio",
  "Outdoor Area",
  "Boxing Ring",
  "Childcare",
  "Disability Access",
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface OperatingHours {
  day: string;
  open: string;
  close: string;
}

interface GymProfile {
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  amenities: string[];
  operating_hours: OperatingHours[];
  photos: string[];
}

export default function GymSettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GymProfile>({
    name: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    phone: "",
    email: "",
    website: "",
    amenities: [],
    operating_hours: DAYS_OF_WEEK.map((d) => ({ day: d, open: "06:00", close: "21:00" })),
    photos: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/gyms/${user!.user_id}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile({
          name: data.name || "",
          address: data.address || "",
          suburb: data.suburb || "",
          state: data.state || "",
          postcode: data.postcode || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          amenities: data.amenities || [],
          operating_hours: data.operating_hours || DAYS_OF_WEEK.map((d) => ({ day: d, open: "06:00", close: "21:00" })),
          photos: data.photos || [],
        });
      } catch {
        toast("Failed to load gym profile.", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  function toggleAmenity(amenity: string) {
    setProfile((p) => ({
      ...p,
      amenities: p.amenities.includes(amenity)
        ? p.amenities.filter((a) => a !== amenity)
        : [...p.amenities, amenity],
    }));
  }

  function updateHours(index: number, field: "open" | "close", value: string) {
    setProfile((p) => ({
      ...p,
      operating_hours: p.operating_hours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/gyms/${user.user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast("Gym profile updated!", "success");
    } catch {
      toast("Failed to save gym profile.", "error");
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
        <h1 className="text-2xl font-bold text-warm-900">Gym Settings</h1>
        <p className="mt-1 text-sm text-warm-500">Update your gym profile and operating hours.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Basic Info */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-warm-700">Gym Name</span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-warm-700">Address</span>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Suburb</span>
              <input
                type="text"
                value={profile.suburb}
                onChange={(e) => setProfile({ ...profile, suburb: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">State</span>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                >
                  <option value="">Select...</option>
                  {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">Postcode</span>
                <input
                  type="text"
                  value={profile.postcode}
                  onChange={(e) => setProfile({ ...profile, postcode: e.target.value })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  maxLength={4}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Phone</span>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-sm font-medium text-warm-700">Website</span>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="https://"
              />
            </label>
          </div>
        </section>

        {/* Amenities */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  profile.amenities.includes(amenity)
                    ? "bg-teal-600 text-white"
                    : "border border-warm-300 text-warm-600 hover:bg-warm-50"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </section>

        {/* Operating Hours */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Operating Hours</h2>
          <div className="space-y-3">
            {profile.operating_hours.map((h, i) => (
              <div key={h.day} className="grid grid-cols-[120px_1fr_1fr] items-center gap-3">
                <span className="text-sm font-medium text-warm-700">{h.day}</span>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => updateHours(i, "open", e.target.value)}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                />
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => updateHours(i, "close", e.target.value)}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Photos */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Photos</h2>
          <div className="space-y-3">
            {profile.photos.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src={url} alt={`Photo ${i + 1}`} className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1 truncate text-sm text-warm-600">{url}</span>
                <button
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, photos: p.photos.filter((_, idx) => idx !== i) }))}
                  className="rounded p-1 text-warm-400 hover:text-red-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Photo URL"
                className="flex-1 rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
              <button
                type="button"
                onClick={() => {
                  if (newPhotoUrl.trim()) {
                    setProfile((p) => ({ ...p, photos: [...p.photos, newPhotoUrl.trim()] }));
                    setNewPhotoUrl("");
                  }
                }}
                className="rounded-lg bg-warm-100 px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-200"
              >
                Add
              </button>
            </div>
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
      </form>
    </div>
  );
}
