"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/components/toast";

const SPECIALISATIONS = [
  "Weight Loss",
  "Muscle Building",
  "HIIT",
  "Yoga",
  "Pilates",
  "Boxing",
  "Strength Training",
  "CrossFit",
  "Rehabilitation",
  "Pre/Post Natal",
  "Sports Performance",
  "Functional Training",
  "Flexibility & Mobility",
  "Nutrition Coaching",
  "Group Fitness",
  "Senior Fitness",
];

const SESSION_TYPES = ["in_person", "online", "outdoor", "home_visit", "gym"];

const AUSTRALIAN_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface TrainerProfile {
  bio: string;
  specialisations: string[];
  experience_years: number;
  hourly_rate_cents: number;
  session_types: string[];
  travel_radius_km: number;
  home_suburb: string;
  state: string;
  photo_url: string;
  gallery_urls: string[];
  certifications: Certification[];
}

export default function TrainerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TrainerProfile>({
    bio: "",
    specialisations: [],
    experience_years: 0,
    hourly_rate_cents: 0,
    session_types: [],
    travel_radius_km: 10,
    home_suburb: "",
    state: "",
    photo_url: "",
    gallery_urls: [],
    certifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/trainers/${user!.user_id}`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile({
          bio: data.bio || "",
          specialisations: data.specialisations || [],
          experience_years: data.experience_years || 0,
          hourly_rate_cents: data.hourly_rate_cents || 0,
          session_types: data.session_types || [],
          travel_radius_km: data.travel_radius_km || 10,
          home_suburb: data.home_suburb || "",
          state: data.state || "",
          photo_url: data.photo_url || "",
          gallery_urls: data.gallery_urls || [],
          certifications: data.certifications || [],
        });
      } catch {
        toast("Failed to load profile.", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  function toggleSpec(spec: string) {
    setProfile((p) => ({
      ...p,
      specialisations: p.specialisations.includes(spec)
        ? p.specialisations.filter((s) => s !== spec)
        : [...p.specialisations, spec],
    }));
  }

  function toggleSessionType(type: string) {
    setProfile((p) => ({
      ...p,
      session_types: p.session_types.includes(type)
        ? p.session_types.filter((t) => t !== type)
        : [...p.session_types, type],
    }));
  }

  function addGalleryUrl() {
    if (!newGalleryUrl.trim()) return;
    setProfile((p) => ({ ...p, gallery_urls: [...p.gallery_urls, newGalleryUrl.trim()] }));
    setNewGalleryUrl("");
  }

  function removeGalleryUrl(idx: number) {
    setProfile((p) => ({ ...p, gallery_urls: p.gallery_urls.filter((_, i) => i !== idx) }));
  }

  function addCertification() {
    setProfile((p) => ({
      ...p,
      certifications: [...p.certifications, { name: "", issuer: "", year: "" }],
    }));
  }

  function updateCertification(idx: number, field: keyof Certification, value: string) {
    setProfile((p) => ({
      ...p,
      certifications: p.certifications.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    }));
  }

  function removeCertification(idx: number) {
    setProfile((p) => ({ ...p, certifications: p.certifications.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/trainers/${user.user_id}`, {
        method: "PATCH",
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
        <h1 className="text-2xl font-bold text-warm-900">Edit Profile</h1>
        <p className="mt-1 text-sm text-warm-500">Keep your profile up to date to attract more clients.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Photo */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Profile Photo</h2>
          <div className="flex items-center gap-4">
            {profile.photo_url && (
              <img
                src={profile.photo_url}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border-2 border-warm-200"
              />
            )}
            <input
              type="url"
              value={profile.photo_url}
              onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
              className="flex-1 rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              placeholder="Photo URL"
            />
          </div>
        </section>

        {/* Bio & Experience */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">About</h2>
          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Bio</span>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="Tell clients about yourself..."
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">Experience (years)</span>
                <input
                  type="number"
                  min="0"
                  value={profile.experience_years}
                  onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value, 10) || 0 })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">Hourly Rate ($AUD)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={(profile.hourly_rate_cents / 100).toFixed(0)}
                  onChange={(e) => setProfile({ ...profile, hourly_rate_cents: parseInt(e.target.value, 10) * 100 || 0 })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">Travel Radius (km)</span>
                <input
                  type="number"
                  min="0"
                  value={profile.travel_radius_km}
                  onChange={(e) => setProfile({ ...profile, travel_radius_km: parseInt(e.target.value, 10) || 0 })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">Home Suburb</span>
                <input
                  type="text"
                  value={profile.home_suburb}
                  onChange={(e) => setProfile({ ...profile, home_suburb: e.target.value })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  placeholder="e.g. Bondi"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-warm-700">State</span>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                >
                  <option value="">Select state...</option>
                  {AUSTRALIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        {/* Specialisations */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Specialisations</h2>
          <div className="flex flex-wrap gap-2">
            {SPECIALISATIONS.map((spec) => (
              <button
                key={spec}
                type="button"
                onClick={() => toggleSpec(spec)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  profile.specialisations.includes(spec)
                    ? "bg-teal-600 text-white"
                    : "border border-warm-300 text-warm-600 hover:bg-warm-50"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </section>

        {/* Session Types */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Session Types</h2>
          <div className="flex flex-wrap gap-2">
            {SESSION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleSessionType(type)}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  profile.session_types.includes(type)
                    ? "bg-coral-500 text-white"
                    : "border border-warm-300 text-warm-600 hover:bg-warm-50"
                }`}
              >
                {type.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-warm-900">Gallery</h2>
          <div className="space-y-3">
            {profile.gallery_urls.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <img src={url} alt={`Gallery ${i + 1}`} className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1 truncate text-sm text-warm-600">{url}</span>
                <button
                  type="button"
                  onClick={() => removeGalleryUrl(i)}
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
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Image URL"
                className="flex-1 rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
              />
              <button
                type="button"
                onClick={addGalleryUrl}
                className="rounded-lg bg-warm-100 px-4 py-2 text-sm font-medium text-warm-700 hover:bg-warm-200"
              >
                Add
              </button>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="rounded-xl border border-warm-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-warm-900">Certifications</h2>
            <button
              type="button"
              onClick={addCertification}
              className="rounded-lg bg-warm-100 px-3 py-1.5 text-sm font-medium text-warm-700 hover:bg-warm-200"
            >
              + Add Certification
            </button>
          </div>
          <div className="space-y-3">
            {profile.certifications.map((cert, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-warm-100 bg-warm-50 p-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(i, "name", e.target.value)}
                    placeholder="Certification name"
                    className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(i, "issuer", e.target.value)}
                    placeholder="Issuer"
                    className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  />
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => updateCertification(i, "year", e.target.value)}
                    placeholder="Year"
                    className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(i)}
                  className="rounded p-1.5 text-warm-400 hover:text-red-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {profile.certifications.length === 0 && (
              <p className="text-sm text-warm-500">No certifications added yet.</p>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
