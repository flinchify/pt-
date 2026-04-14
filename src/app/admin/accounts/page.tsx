"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusBadge } from "@/components/status-badge";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

const ROLE_OPTIONS = ["all", "client", "trainer", "gym", "enterprise"];

export default function AdminAccountsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/accounts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load accounts");
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.total_pages || 1);
    } catch {
      setError("Could not load user accounts.");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Accounts</h1>
        <p className="mt-1 text-sm text-navy-400">Manage all platform users.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full max-w-sm rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-white placeholder-navy-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-sm capitalize text-white"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r === "all" ? "All Roles" : r}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-8 text-center text-sm text-navy-400">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy-700 bg-navy-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="px-4 py-3 text-left font-semibold text-navy-300">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-navy-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-navy-800 last:border-0">
                  <td className="px-4 py-3 text-navy-400">#{u.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{u.full_name}</td>
                  <td className="px-4 py-3 text-navy-300">{u.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.role} /></td>
                  <td className="px-4 py-3 text-navy-400">
                    {new Date(u.created_at).toLocaleDateString("en-AU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-1.5 text-sm text-navy-300 hover:bg-navy-700 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-navy-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-1.5 text-sm text-navy-300 hover:bg-navy-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
