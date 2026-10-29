"use client";

import { useActionState } from "react";
import Link from "next/link";

import type { FaqActionState } from "@/app/admin/(dashboard)/content/faq/actions";
import type { FaqRow } from "@/lib/db/types";

type FormAction = (
  prev: FaqActionState,
  formData: FormData,
) => Promise<FaqActionState>;

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

export function FaqForm({
  action,
  initial,
}: {
  action: FormAction;
  initial?: FaqRow | null;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-6 max-w-2xl">
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Pertanyaan *</span>
          <input name="question" required defaultValue={initial?.question ?? ""} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Jawaban *</span>
          <textarea name="answer" required rows={3} defaultValue={initial?.answer ?? ""} className={inputClass + " mt-1.5"} />
        </label>

        <div className="flex items-end gap-4">
          <label className="block w-40">
            <span className="text-sm font-medium text-slate-800">Urutan tampil</span>
            <input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} className={inputClass + " mt-1.5"} />
          </label>
          <label className="flex items-center gap-2 pb-2">
            <input name="is_published" type="checkbox" defaultChecked={initial?.is_published ?? false} className="h-4 w-4 accent-teal-700" />
            <span className="text-sm font-medium text-slate-800">Terbitkan</span>
          </label>
        </div>
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
        <Link href="/admin/content/faq" className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Batal
        </Link>
      </div>
    </form>
  );
}
