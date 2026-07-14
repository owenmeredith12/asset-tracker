import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloud Asset Tracker",
  description:
    "A Next.js and MongoDB Atlas application for tracking company assets and employee assignments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-100 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white shadow-lg backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="group flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold shadow-md transition group-hover:bg-blue-500">
                  AT
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight">
                    Cloud Asset Tracker
                  </p>
                  <p className="text-xs text-slate-400">
                    MongoDB Atlas Project
                  </p>
                </div>
              </Link>

              <nav
                aria-label="Primary navigation"
                className="flex items-center gap-2"
              >
                <Link
                  href="/"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/pages/assets"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Assets
                </Link>

                <Link
                  href="/pages/employees"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  Employees
                </Link>
              </nav>
            </div>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>Cloud Asset Tracker</p>

              <p>
                Built with Next.js, TypeScript, and MongoDB Atlas
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}