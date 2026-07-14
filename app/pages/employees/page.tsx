"use client";

import { FormEvent, useEffect, useState } from "react";

type Employee = {
  _id: string;
  name: string;
  email: string;
  department: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/employees");

      if (!response.ok) {
        throw new Error("Failed to load employees.");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          department,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create employee.");
      }

      setName("");
      setEmail("");
      setDepartment("");

      await loadEmployees();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create employee."
      );
    } finally {
      setSaving(false);
    }
  }

  function getInitials(employeeName: string) {
    return employeeName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
          <div className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Asset Management
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Employees
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Add and manage employees who can be assigned company assets.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur">
              <p className="text-sm text-slate-300">Total Employees</p>
              <p className="mt-1 text-3xl font-bold">{employees.length}</p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              New Employee
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Add an employee
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter the employee&apos;s contact and department information.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-3"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="John Smith"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="john.smith@example.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Department
              </label>

              <input
                id="department"
                type="text"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                required
                placeholder="Information Technology"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-40 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Adding Employee..." : "Add Employee"}
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Employee Directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employees available for asset assignment.
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {employees.length} total
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="text-sm font-medium text-slate-500">
                Loading employees...
              </p>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-500">
                0
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No employees yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first employee using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Department
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="transition hover:bg-blue-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {getInitials(employee.name)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {employee.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              Employee record
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${employee.email}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {employee.email}
                        </a>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                          {employee.department}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}