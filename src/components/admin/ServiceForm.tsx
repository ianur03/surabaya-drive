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
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

export function ServiceForm({
  action,
  initial,
}: {
  action: FormAction;
  initial: ServiceRow;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Nama *</span>
          <input name="name" required defaultValue={initial.name} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Slug *</span>
          <input name="slug" required defaultValue={initial.slug} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Nama singkat *</span>
          <input name="short_name" required defaultValue={initial.short_name} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Urutan tampil</span>
          <input name="sort_order" type="number" defaultValue={initial.sort_order} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">Deskripsi *</span>
          <textarea name="description" required rows={2} defaultValue={initial.description} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">Poin manfaat (satu per baris) *</span>
          <textarea name="benefits" required rows={4} defaultValue={initial.benefits.join("\n")} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Status *</span>
          <select name="status" defaultValue={initial.status} className={inputClass + " mt-1.5"}>
            <option value="draft">Draft</option>
            <option value="published">Terbit</option>
            <option value="archived">Arsip</option>
          </select>
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        <Link href="/admin/services" className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Batal
        </Link>
      </div>
    </form>
  );
}
