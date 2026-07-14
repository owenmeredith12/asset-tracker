import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-16">

        <section className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="p-10 md:p-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              CSE 310 • Cloud Database Project
            </p>

            <h1 className="text-5xl font-bold tracking-tight">
              Cloud Asset Tracker
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              The Cloud Asset Tracker is a web application built with
              <span className="font-semibold text-white"> Next.js </span>
              and
              <span className="font-semibold text-white"> MongoDB Atlas </span>
              that allows an organization to keep track of company equipment.
              Users can create, update, view, and delete asset records while
              assigning assets to employees.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/assets"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                View Assets
              </Link>

              <Link
                href="/employees"
                className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Manage Employees
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">💻</div>

            <h2 className="text-xl font-bold">
              Track Assets
            </h2>

            <p className="mt-3 text-slate-600">
              Store information about laptops, desktops, monitors, phones,
              printers, and other company devices in a cloud database.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">👥</div>

            <h2 className="text-xl font-bold">
              Manage Employees
            </h2>

            <p className="mt-3 text-slate-600">
              Create employee records and assign company equipment to individual
              employees for easy tracking.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">☁️</div>

            <h2 className="text-xl font-bold">
              Cloud Database
            </h2>

            <p className="mt-3 text-slate-600">
              All information is stored securely in MongoDB Atlas, demonstrating
              full Create, Read, Update, and Delete (CRUD) functionality.
            </p>
          </div>

        </section>

        <section className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Features
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="font-semibold">✔ Asset Management</h3>
              <p className="mt-2 text-slate-600">
                Add, edit, delete, and view company assets.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="font-semibold">✔ Employee Management</h3>
              <p className="mt-2 text-slate-600">
                Maintain employee records for assigning equipment.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="font-semibold">✔ Asset Assignment</h3>
              <p className="mt-2 text-slate-600">
                Link assets to employees using related MongoDB collections.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <h3 className="font-semibold">✔ MongoDB Atlas</h3>
              <p className="mt-2 text-slate-600">
                Uses a cloud-hosted NoSQL database with REST API endpoints for
                CRUD operations.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}