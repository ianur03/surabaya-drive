"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/vehicles", label: "Kendaraan" },
  { href: "/admin/bookings", label: "Booking" },
  { href: "/admin/services", label: "Layanan" },
  { href: "/admin/content/homepage", label: "Konten Beranda" },
  { href: "/admin/content/faq", label: "FAQ" },
  { href: "/admin/settings/business", label: "Pengaturan Bisnis" },
  { href: "/admin/settings/seo", label: "SEO" },
  { href: "/admin/settings/account", label: "Akun" },
];

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigasi admin">
      {navItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium",
              active
                ? "bg-teal-700 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-700">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-700 text-sm font-bold text-white">
            SD
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Surabaya Drive</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
          </div>
        </div>
        {sidebar}
        <div className="border-t border-slate-200 p-3 dark:border-slate-700">
          <div className="mb-2 flex items-center justify-between">
            <div className="truncate px-3 text-xs text-slate-500 dark:text-slate-400">
              {userEmail}
            </div>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile header + drawer */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800 lg:hidden">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Surabaya Drive</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Buka menu admin"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="flex h-full w-64 flex-col bg-white dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-700">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-700 text-sm font-bold text-white">SD</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Surabaya Drive</p>
            </div>
            {sidebar}
            <div className="border-t border-slate-200 p-3 dark:border-slate-700">
              <button type="button" onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konten */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}