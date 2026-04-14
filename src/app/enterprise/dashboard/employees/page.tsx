"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";

interface Employee {
  id: number;
  email: string;
  employee_id: string;
  department: string;
  booking_limit: number;
  bookings_used: number;
  created_at: string;
}

export default function EnterpriseEmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    email: "",
    employee_id: "",
    department: "",
    booking_limit: "10",
  });

  const fetchEmployees = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/enterprise/${user.user_id}/employees`);
      if (!res.ok) throw new Error("Failed to load employees");
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch {
      setError("Could not load employees.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/enterprise/${user.user_id}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          employee_id: form.employee_id,
          department: form.department,
          booking_limit: parseInt(form.booking_limit, 10),
        }),
      });
      if (!res.ok) throw new Error("Failed to add employee");
      toast("Employee added!", "success");
      setModalOpen(false);
      setForm({ email: "", employee_id: "", department: "", booking_limit: "10" });
      fetchEmployees();
    } catch {
      toast("Failed to add employee.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeEmployee(employeeId: number) {
    if (!user) return;
    if (!confirm("Are you sure you want to remove this employee?")) return;
    try {
      const res = await fetch(`/api/enterprise/${user.user_id}/employees/${employeeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove employee");
      toast("Employee removed.", "success");
      fetchEmployees();
    } catch {
      toast("Failed to remove employee.", "error");
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
          <h1 className="text-2xl font-bold text-warm-900">Employees</h1>
          <p className="mt-1 text-sm text-warm-500">Manage employees in your wellness program.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Add Employee
        </button>
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {employees.length === 0 ? (
        <div className="rounded-xl border border-warm-200 bg-white p-8 text-center text-sm text-warm-500">
          No employees added yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-warm-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200 bg-warm-50">
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Employee ID</th>
                <th className="px-4 py-3 text-left font-semibold text-warm-700">Department</th>
                <th className="px-4 py-3 text-center font-semibold text-warm-700">Bookings Used / Limit</th>
                <th className="px-4 py-3 text-right font-semibold text-warm-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-warm-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-warm-800">{emp.email}</td>
                  <td className="px-4 py-3 text-warm-600">{emp.employee_id}</td>
                  <td className="px-4 py-3 text-warm-600">{emp.department}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-medium ${emp.bookings_used >= emp.booking_limit ? "text-red-600" : "text-warm-800"}`}>
                      {emp.bookings_used}
                    </span>
                    <span className="text-warm-400"> / {emp.booking_limit}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeEmployee(emp.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleAddEmployee} className="p-6">
          <h2 className="mb-4 text-lg font-bold text-warm-900">Add Employee</h2>
          <div className="space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Email *</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Employee ID</span>
              <input
                type="text"
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="EMP-001"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Department</span>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="rounded-lg border border-warm-300 px-3 py-2 text-sm text-warm-800"
                placeholder="Engineering"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-warm-700">Booking Limit (per month)</span>
              <input
                type="number"
                min="1"
                value={form.booking_limit}
                onChange={(e) => setForm({ ...form, booking_limit: e.target.value })}
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
              {submitting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
