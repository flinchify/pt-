"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";

interface DeptReport {
  department: string;
  session_count: number;
  total_cost_cents: number;
  unique_employees: number;
}

interface ActiveEmployee {
  email: string;
  employee_id: string;
  department: string;
  session_count: number;
}

interface CostBreakdown {
  month: string;
  total_cents: number;
}

export default function EnterpriseReportsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<DeptReport[]>([]);
  const [activeEmployees, setActiveEmployees] = useState<ActiveEmployee[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (dateFrom) params.set("from", dateFrom);
        if (dateTo) params.set("to", dateTo);
        const qs = params.toString() ? `?${params.toString()}` : "";

        const res = await fetch(`/api/enterprise/${user!.user_id}/reports${qs}`);
        if (!res.ok) throw new Error("Failed to load reports");
        const data = await res.json();
        setDepartments(data.departments || []);
        setActiveEmployees(data.active_employees || []);
        setCostBreakdown(data.cost_breakdown || []);
      } catch {
        setError("Could not load reports.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, dateFrom, dateTo]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalCost = departments.reduce((sum, d) => sum + d.total_cost_cents, 0);
  const totalSessions = departments.reduce((sum, d) => sum + d.session_count, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-warm-900">Usage Reports</h1>
        <p className="mt-1 text-sm text-warm-500">Analyse your corporate wellness program usage.</p>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm text-warm-700">
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-warm-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-warm-700">
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-warm-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
          <p className="text-sm font-medium text-teal-700">Total Sessions</p>
          <p className="mt-1 text-2xl font-bold text-teal-800">{totalSessions}</p>
        </div>
        <div className="rounded-xl border border-navy-200 bg-navy-50 p-5">
          <p className="text-sm font-medium text-navy-700">Total Cost</p>
          <p className="mt-1 text-2xl font-bold text-navy-800">${(totalCost / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">Departments Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">{departments.length}</p>
        </div>
      </div>

      {/* Sessions by Department */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-warm-900">Sessions by Department</h2>
        {departments.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No data for the selected period.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 bg-warm-50">
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Department</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Sessions</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Employees</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Cost</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.department} className="border-b border-warm-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-warm-800">{d.department}</td>
                    <td className="px-4 py-3 text-right text-warm-700">{d.session_count}</td>
                    <td className="px-4 py-3 text-right text-warm-700">{d.unique_employees}</td>
                    <td className="px-4 py-3 text-right font-medium text-warm-800">
                      ${(d.total_cost_cents / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Most Active Employees */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-warm-900">Most Active Employees</h2>
        {activeEmployees.length === 0 ? (
          <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
            No active employees in this period.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 bg-warm-50">
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Employee ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Department</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {activeEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="border-b border-warm-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-warm-800">{emp.email}</td>
                    <td className="px-4 py-3 text-warm-600">{emp.employee_id}</td>
                    <td className="px-4 py-3 text-warm-600">{emp.department}</td>
                    <td className="px-4 py-3 text-right font-medium text-warm-800">{emp.session_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Cost Breakdown */}
      {costBreakdown.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-warm-900">Monthly Cost Breakdown</h2>
          <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200 bg-warm-50">
                  <th className="px-4 py-3 text-left font-semibold text-warm-700">Month</th>
                  <th className="px-4 py-3 text-right font-semibold text-warm-700">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {costBreakdown.map((c) => (
                  <tr key={c.month} className="border-b border-warm-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-warm-800">{c.month}</td>
                    <td className="px-4 py-3 text-right font-medium text-warm-800">
                      ${(c.total_cents / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
