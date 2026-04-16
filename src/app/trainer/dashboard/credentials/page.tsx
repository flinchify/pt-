"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";

const DOCUMENT_TYPES = [
  { value: "cert_iii_fitness", label: "Certificate III in Fitness (SIS30321)", required: true },
  { value: "cert_iv_fitness", label: "Certificate IV in Fitness (SIS40221)", required: false },
  { value: "first_aid", label: "First Aid Certificate (HLTAID011)", required: true },
  { value: "cpr", label: "CPR Certificate (HLTAID009)", required: true },
  { value: "wwcc", label: "Working With Children Check", required: false },
  { value: "police_check", label: "National Police Check", required: false },
  { value: "insurance", label: "Professional Indemnity Insurance", required: false },
  { value: "ausactive", label: "AUSactive Registration", required: false },
];

interface Credential {
  id: number;
  document_type: string;
  document_number: string | null;
  issuing_authority: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  ai_status: "pending" | "verified" | "rejected" | "expired";
  ai_notes: string | null;
  verified_at: string | null;
  created_at: string;
}

export default function CredentialsPage() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [trainerVerified, setTrainerVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{ status: string; notes: string } | null>(null);
  const [trainerId, setTrainerId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    async function loadTrainer() {
      try {
        // Get trainer ID from user
        const res = await fetch(`/api/trainers?limit=100`);
        if (res.ok) {
          const data = await res.json();
          const myTrainer = data.trainers?.find((t: { user_id?: number }) => t.user_id === user!.user_id);
          if (myTrainer) {
            setTrainerId(myTrainer.id);
            await loadCredentials(myTrainer.id);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadTrainer();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadCredentials(tid: number) {
    const res = await fetch(`/api/trainers/${tid}/credentials`);
    if (res.ok) {
      const data = await res.json();
      setCredentials(data.credentials || []);
      setTrainerVerified(data.trainer_verified || false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile || !selectedType || !trainerId) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("document_type", selectedType);

    try {
      const res = await fetch(`/api/trainers/${trainerId}/verify-credential`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadResult({ status: data.status, notes: data.notes || "" });
      setSelectedFile(null);
      setSelectedType("");
      await loadCredentials(trainerId);
    } catch {
      setUploadResult({ status: "error", notes: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  const getDocLabel = (type: string) =>
    DOCUMENT_TYPES.find((d) => d.value === type)?.label || type;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-red-50 text-red-700 border-red-200";
      case "expired": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default: return "bg-warm-50 text-warm-600 border-warm-200";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Check which required docs are verified
  const verifiedTypes = new Set(
    credentials.filter((c) => c.ai_status === "verified").map((c) => c.document_type)
  );
  const hasFitnessCert = verifiedTypes.has("cert_iii_fitness") || verifiedTypes.has("cert_iv_fitness");
  const hasFirstAid = verifiedTypes.has("first_aid");
  const hasCpr = verifiedTypes.has("cpr");

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Credentials & Verification</h1>
        <p className="mt-1 text-sm text-warm-500">
          Upload your credentials to get verified on AnywherePT.
        </p>
      </motion.div>

      {/* Verification Status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className={`rounded-xl border p-5 ${
          trainerVerified
            ? "border-emerald-200 bg-emerald-50"
            : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className="flex items-center gap-3">
          {trainerVerified ? (
            <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <div>
            <p className={`font-semibold ${trainerVerified ? "text-emerald-800" : "text-yellow-800"}`}>
              {trainerVerified ? "Profile Verified" : "Verification Incomplete"}
            </p>
            <p className={`text-sm ${trainerVerified ? "text-emerald-600" : "text-yellow-700"}`}>
              {trainerVerified
                ? "Your profile displays a verified badge to clients."
                : "Upload the required documents below to earn your verified badge."
              }
            </p>
          </div>
        </div>

        {!trainerVerified && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-800">Required for verification:</p>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${hasFitnessCert ? "border-emerald-300 bg-emerald-100 text-emerald-700" : "border-yellow-300 bg-yellow-100 text-yellow-700"}`}>
                {hasFitnessCert ? "Cert III/IV" : "Cert III/IV (needed)"}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${hasFirstAid ? "border-emerald-300 bg-emerald-100 text-emerald-700" : "border-yellow-300 bg-yellow-100 text-yellow-700"}`}>
                {hasFirstAid ? "First Aid" : "First Aid (needed)"}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${hasCpr ? "border-emerald-300 bg-emerald-100 text-emerald-700" : "border-yellow-300 bg-yellow-100 text-yellow-700"}`}>
                {hasCpr ? "CPR" : "CPR (needed)"}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-warm-200 bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-warm-900">Upload Document</h2>
        <form onSubmit={handleUpload} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              required
              className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800"
            >
              <option value="">Select document type</option>
              {DOCUMENT_TYPES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}{d.required ? " *" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-warm-700">Document File</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
              className="w-full rounded-lg border border-warm-200 px-4 py-3 text-sm text-warm-800 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
            />
            <p className="mt-1 text-xs text-warm-400">Accepted: JPG, PNG, PDF. Max 10MB.</p>
          </div>
          <button
            type="submit"
            disabled={uploading || !selectedFile || !selectedType}
            className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
          >
            {uploading ? "Verifying..." : "Upload & Verify"}
          </button>
        </form>

        {uploadResult && (
          <div className={`mt-4 rounded-lg border p-4 ${
            uploadResult.status === "verified"
              ? "border-emerald-200 bg-emerald-50"
              : uploadResult.status === "rejected"
              ? "border-red-200 bg-red-50"
              : "border-yellow-200 bg-yellow-50"
          }`}>
            <p className={`text-sm font-semibold ${
              uploadResult.status === "verified" ? "text-emerald-700" :
              uploadResult.status === "rejected" ? "text-red-700" : "text-yellow-700"
            }`}>
              {uploadResult.status === "verified" ? "Document Verified" :
               uploadResult.status === "rejected" ? "Document Rejected" : "Pending Review"}
            </p>
            {uploadResult.notes && (
              <p className="mt-1 text-sm text-warm-600">{uploadResult.notes}</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Existing Credentials */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-warm-900">Your Documents</h2>
        {credentials.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No documents uploaded yet. Upload your first credential above.
          </div>
        ) : (
          <div className="space-y-3">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="flex items-center justify-between rounded-xl border border-warm-200 bg-white p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-warm-900">{getDocLabel(cred.document_type)}</p>
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(cred.ai_status)}`}>
                      {cred.ai_status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-warm-500">
                    {cred.document_number && <span>No: {cred.document_number}</span>}
                    {cred.issuing_authority && <span>Issuer: {cred.issuing_authority}</span>}
                    {cred.expiry_date && (
                      <span>Expires: {new Date(cred.expiry_date).toLocaleDateString("en-AU")}</span>
                    )}
                    <span>Uploaded: {new Date(cred.created_at).toLocaleDateString("en-AU")}</span>
                  </div>
                  {cred.ai_notes && cred.ai_status === "rejected" && (
                    <p className="mt-1 text-xs text-red-600">{cred.ai_notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
