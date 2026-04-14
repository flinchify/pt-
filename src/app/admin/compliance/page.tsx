"use client";

import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface TrainerCert {
  trainer_id: number;
  trainer_name: string;
  trainer_email: string;
  cert_name: string;
  cert_issuer: string;
  expiry_date: string | null;
}

function getExpiryStatus(expiryDate: string | null): { label: string; className: string } {
  if (!expiryDate) {
    return { label: "No Expiry", className: "text-navy-400" };
  }
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) {
    return { label: "Expired", className: "bg-red-900/30 text-red-400 border border-red-800/50 px-2 py-0.5 rounded-full text-xs font-semibold" };
  }
  if (daysUntil <= 30) {
    return { label: `Expires in ${daysUntil}d`, className: "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50 px-2 py-0.5 rounded-full text-xs font-semibold" };
  }
  return { label: "Valid", className: "bg-green-900/30 text-green-400 border border-green-800/50 px-2 py-0.5 rounded-full text-xs font-semibold" };
}

export default function AdminCompliancePage() {
  const [certs, setCerts] = useState<TrainerCert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/compliance");
        if (!res.ok) throw new Error("Failed to load compliance data");
        const data = await res.json();
        setCerts(data.certifications || []);
      } catch {
        setError("Could not load compliance data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const expired = certs.filter((c) => {
    if (!c.expiry_date) return false;
    return new Date(c.expiry_date) < new Date();
  });

  const expiringSoon = certs.filter((c) => {
    if (!c.expiry_date) return false;
    const expiry = new Date(c.expiry_date);
    const now = new Date();
    const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 30;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Compliance</h1>
        <p className="mt-1 text-sm text-navy-400">Trainer certification tracking and expiry monitoring.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-navy-600 bg-navy-800 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-navy-400">Total Certifications</p>
          <p className="mt-2 text-2xl font-bold text-white">{certs.length}</p>
        </div>
        <div className="rounded-xl border border-red-700 bg-red-900/30 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-red-400">Expired</p>
          <p className="mt-2 text-2xl font-bold text-red-300">{expired.length}</p>
        </div>
        <div className="rounded-xl border border-yellow-700 bg-yellow-900/30 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-yellow-400">Expiring Within 30 Days</p>
          <p className="mt-2 text-2xl font-bold text-yellow-300">{expiringSoon.length}</p>
        </div>
      </div>

      {/* Table */}
      {certs.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-8 text-center text-sm text-navy-400">
          No certification data available.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-700 bg-navy-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Trainer</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Certification</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Issuer</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Expiry Date</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c, i) => {
                const status = getExpiryStatus(c.expiry_date);
                return (
                  <tr key={`${c.trainer_id}-${c.cert_name}-${i}`} className="border-b border-navy-800 last:border-0">
                    <td className="px-4 py-3 font-medium text-white">{c.trainer_name}</td>
                    <td className="px-4 py-3 text-navy-300">{c.trainer_email}</td>
                    <td className="px-4 py-3 text-navy-200">{c.cert_name}</td>
                    <td className="px-4 py-3 text-navy-300">{c.cert_issuer}</td>
                    <td className="px-4 py-3 text-navy-300">
                      {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString("en-AU") : "--"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={status.className}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
