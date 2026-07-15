"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

    //defining data structures for eployees and asset information
    type Employee = {
    _id: string;
    name: string;
    email?: string;
    department?: string;
    };

    type Asset = {
    _id: string;
    assetTag: string;
    deviceType: string;
    manufacturer: string;
    model: string;
    status: "Available" | "Assigned" | "Repair" | "Retired";
    employeeId: string | null;
    employee?: Employee;
    };

    type AssetForm = {
    assetTag: string;
    deviceType: string;
    manufacturer: string;
    model: string;
    status: Asset["status"];
    employeeId: string;
    };

    const emptyForm: AssetForm = {
    assetTag: "",
    deviceType: "",
    manufacturer: "",
    model: "",
    status: "Available",
    employeeId: "",
    };

export default function AssetsPage() {
    //defining variables needed for assets page
    const [assets, setAssets] = useState<Asset[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [form, setForm] = useState<AssetForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

  //load employee and asset data
    async function loadData() {
        try {
        setLoading(true);
        setError("");

        const [assetsResponse, employeesResponse] = await Promise.all([
            fetch("/api/assets", { cache: "no-store" }),
            fetch("/api/employees", { cache: "no-store" }),
        ]);

        if (!assetsResponse.ok) {
            throw new Error("Failed to load assets.");
        }

        if (!employeesResponse.ok) {
            throw new Error("Failed to load employees.");
        }

        const assetsData: Asset[] = await assetsResponse.json();
        const employeesData: Employee[] = await employeesResponse.json();

        setAssets(assetsData);
        setEmployees(employeesData);
        } catch (error) {
        setError(
            error instanceof Error
            ? error.message
            : "Failed to load asset tracker data."
        );
        } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
        loadData();
    }, []);

    //filter assets
    const filteredAssets = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return assets.filter((asset) => {
        const matchesStatus =
            statusFilter === "All" || asset.status === statusFilter;

        const searchableText = [
            asset.assetTag,
            asset.deviceType,
            asset.manufacturer,
            asset.model,
            asset.status,
            asset.employee?.name ?? "",
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            normalizedSearch === "" || searchableText.includes(normalizedSearch);

        return matchesStatus && matchesSearch;
        });
    }, [assets, search, statusFilter]);

    const assetCounts = useMemo(() => {
        return {
        total: assets.length,
        available: assets.filter((asset) => asset.status === "Available").length,
        assigned: assets.filter((asset) => asset.status === "Assigned").length,
        repair: assets.filter((asset) => asset.status === "Repair").length,
        };
    }, [assets]);

    //update the assets 
    function updateField(field: keyof AssetForm, value: string) {
        setForm((current) => ({
        ...current,
        [field]: value,
        }));
    }

    //function to handle the submission of new data or updates
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
        setSaving(true);
        setError("");
        setSuccess("");

        const url = editingId ? `/api/assets/${editingId}` : "/api/assets";
        const method = editingId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to save asset.");
        }

        setSuccess(
            editingId
            ? "Asset updated successfully."
            : "Asset added successfully."
        );

        setForm(emptyForm);
        setEditingId(null);

        await loadData();
        } catch (error) {
        setError(
            error instanceof Error ? error.message : "Failed to save asset."
        );
        } finally {
        setSaving(false);
        }
    }

    //function to handle edits to assets
    function handleEdit(asset: Asset) {
        setEditingId(asset._id);
        setError("");
        setSuccess("");

        setForm({
        assetTag: asset.assetTag,
        deviceType: asset.deviceType,
        manufacturer: asset.manufacturer,
        model: asset.model,
        status: asset.status,
        employeeId: asset.employeeId?.toString() ?? "",
        });

        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setSuccess("");
    }

    //function to handle asset deletes
    async function handleDelete(id: string) {
        const confirmed = window.confirm(
        "Are you sure you want to delete this asset?"
        );

        if (!confirmed) {
        return;
        }

        try {
        setError("");
        setSuccess("");

        const response = await fetch(`/api/assets/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to delete asset.");
        }

        if (editingId === id) {
            cancelEdit();
        }

        setSuccess("Asset deleted successfully.");
        await loadData();
        } catch (error) {
        setError(
            error instanceof Error ? error.message : "Failed to delete asset."
        );
        }
    }

    //function to handle the status of an asset
    function getStatusClasses(status: Asset["status"]) {
        switch (status) {
        case "Available":
            return "bg-emerald-100 text-emerald-700";
        case "Assigned":
            return "bg-blue-100 text-blue-700";
        case "Repair":
            return "bg-amber-100 text-amber-700";
        case "Retired":
            return "bg-slate-200 text-slate-700";
        default:
            return "bg-slate-100 text-slate-700";
        }
    }

    //page content
    return (
        <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
            <section className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
            <div className="p-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Asset Management
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Company Assets
                </h1>

                <p className="mt-3 max-w-2xl text-slate-300">
                Track company equipment, update its status, and assign it to
                employees.
                </p>
            </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Total Assets</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                {assetCounts.total}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Available</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                {assetCounts.available}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Assigned</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                {assetCounts.assigned}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">In Repair</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">
                {assetCounts.repair}
                </p>
            </div>
            </section>

            {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
                {error}
            </div>
            )}

            {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700 shadow-sm">
                {success}
            </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {editingId ? "Update Record" : "New Record"}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {editingId ? "Edit asset" : "Add an asset"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                Enter the equipment details and optionally assign it to an
                employee.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
                <div>
                <label
                    htmlFor="assetTag"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Asset Tag
                </label>

                <input
                    id="assetTag"
                    type="text"
                    value={form.assetTag}
                    onChange={(event) =>
                    updateField("assetTag", event.target.value)
                    }
                    required
                    placeholder="LT-1001"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                </div>

                <div>
                <label
                    htmlFor="deviceType"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Device Type
                </label>

                <select
                    id="deviceType"
                    value={form.deviceType}
                    onChange={(event) =>
                    updateField("deviceType", event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                    <option value="">Select a type</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Phone">Phone</option>
                    <option value="Printer">Printer</option>
                    <option value="Other">Other</option>
                </select>
                </div>

                <div>
                <label
                    htmlFor="manufacturer"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Manufacturer
                </label>

                <input
                    id="manufacturer"
                    type="text"
                    value={form.manufacturer}
                    onChange={(event) =>
                    updateField("manufacturer", event.target.value)
                    }
                    required
                    placeholder="Dell"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                </div>

                <div>
                <label
                    htmlFor="model"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Model
                </label>

                <input
                    id="model"
                    type="text"
                    value={form.model}
                    onChange={(event) => updateField("model", event.target.value)}
                    required
                    placeholder="Latitude 5540"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                </div>

                <div>
                <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Status
                </label>

                <select
                    id="status"
                    value={form.status}
                    onChange={(event) =>
                    updateField("status", event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Repair">Repair</option>
                    <option value="Retired">Retired</option>
                </select>
                </div>

                <div>
                <label
                    htmlFor="employeeId"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Assigned Employee
                </label>

                <select
                    id="employeeId"
                    value={form.employeeId}
                    onChange={(event) =>
                    updateField("employeeId", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                    <option value="">Unassigned</option>

                    {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                        {employee.name}
                    </option>
                    ))}
                </select>
                </div>

                <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-3">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-w-40 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving
                    ? "Saving..."
                    : editingId
                        ? "Update Asset"
                        : "Add Asset"}
                </button>

                {editingId && (
                    <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                    Cancel
                    </button>
                )}
                </div>
            </form>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                    Asset Inventory
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                    Search, filter, edit, or remove equipment records.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                    <label
                        htmlFor="search"
                        className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                        Search
                    </label>

                    <input
                        id="search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Tag, model, employee..."
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    </div>

                    <div>
                    <label
                        htmlFor="statusFilter"
                        className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                        Status
                    </label>

                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="All">All statuses</option>
                        <option value="Available">Available</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Repair">Repair</option>
                        <option value="Retired">Retired</option>
                    </select>
                    </div>
                </div>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center">
                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                <p className="text-sm font-medium text-slate-500">
                    Loading assets...
                </p>
                </div>
            ) : filteredAssets.length === 0 ? (
                <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-500">
                    0
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                    No matching assets
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                    Add an asset or adjust your search and filter.
                </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse">
                    <thead>
                    <tr className="bg-slate-50 text-left">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Asset
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Device Type
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Manufacturer
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Model
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Assigned To
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {filteredAssets.map((asset) => (
                        <tr
                        key={asset._id}
                        className="transition hover:bg-blue-50/50"
                        >
                        <td className="px-6 py-4">
                            <div>
                            <p className="font-semibold text-slate-900">
                                {asset.assetTag}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Asset record
                            </p>
                            </div>
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                            {asset.deviceType}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                            {asset.manufacturer}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                            {asset.model}
                        </td>

                        <td className="px-6 py-4">
                            <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                                asset.status
                            )}`}
                            >
                            {asset.status}
                            </span>
                        </td>

                        <td className="px-6 py-4">
                            {asset.employee ? (
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                {asset.employee.name}
                                </p>

                                {asset.employee.department && (
                                <p className="mt-1 text-xs text-slate-500">
                                    {asset.employee.department}
                                </p>
                                )}
                            </div>
                            ) : (
                            <span className="text-sm text-slate-400">
                                Unassigned
                            </span>
                            )}
                        </td>

                        <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => handleEdit(asset)}
                                className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(asset._id)}
                                className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                            >
                                Delete
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}

            {!loading && assets.length > 0 && (
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
                Showing {filteredAssets.length} of {assets.length} assets
                </div>
            )}
            </section>
        </div>
        </main>
    );
}