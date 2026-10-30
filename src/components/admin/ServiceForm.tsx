"use client";

import { useActionState } from "react";
import Link from "next/link";

import type { ServiceActionState } from "@/app/admin/(dashboard)/services/actions";
import type { ServiceRow } from "@/lib/db/types";

type FormAction = (
  prev: ServiceActionState,
  formData: FormData,
) => Promise<ServiceActionState>;

const inputClass =
  "block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

export function ServiceForm({
  action,
  initial,
}: {
  action: FormAction;
  initial?: ServiceRow | null;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  const name = initial?.name ?? "";
  const slug = initial?.slug ?? "";
  const shortName = initial?.short_name ?? "";
  const sortOrder = initial?.sort_order ?? 0;
  const description = initial?.description ?? "";
  const benefits = initial?.benefits ?? [];
  const isActive = initial ? initial.status === "published" : true;

  return (
    <form action={formAction} className="mt-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Nama *</span>
          <input name="name" required defaultValue={name} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Slug *</span>
          <input name="slug" required defaultValue={slug} className={inputClass + " mt-1.5"} placeholder="layanan-baru" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Nama singkat *</span>
          <input name="short_name" required defaultValue={shortName} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Urutan tampil</span>
          <input name="sort_order" type="number" defaultValue={sortOrder} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Deskripsi *</span>
          <textarea name="description" required rows={2} defaultValue={description} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Poin manfaat (satu per baris) *</span>
          <textarea name="benefits" required rows={4} defaultValue={benefits.join("\n")} className={inputClass + " mt-1.5"} />
        </label>

        <div className="flex items-center gap-4 pt-1">
          <label className="relative inline-flex cursor-pointer items-center gap-3">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={isActive}
              className="peer sr-only"
            />
            <span className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white dark:bg-slate-800 after:transition-transform peer-checked:bg-teal-600 peer-checked:after:translate-x-5" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Aktif</span>
          </label>
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        <Link href="/admin/services" className="rounded-full border border-slate-300 dark:border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
          Batal
        </Link>
      </div>
    </form>
  );
}
