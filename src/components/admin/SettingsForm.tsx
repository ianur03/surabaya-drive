"use client";

import { useActionState } from "react";

import type { SettingsActionState } from "@/app/admin/(dashboard)/settings/business/actions";
import type { SiteSettingsRow } from "@/lib/db/types";

type FormAction = (
  prev: SettingsActionState,
  formData: FormData,
) => Promise<SettingsActionState>;

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

export function SettingsForm({
  action,
  initial,
}: {
  action: FormAction;
  initial: SiteSettingsRow | null;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">Nama bisnis *</span>
          <input name="business_name" required defaultValue={initial?.business_name ?? "Surabaya Drive"} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Nomor WhatsApp</span>
          <input name="whatsapp_number" defaultValue={initial?.whatsapp_number ?? ""} className={inputClass + " mt-1.5"} placeholder="6281234567890" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Email</span>
          <input name="email" type="email" defaultValue={initial?.email ?? ""} className={inputClass + " mt-1.5"} placeholder="halo@contoh.com" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Wilayah layanan</span>
          <input name="service_area" defaultValue={initial?.service_area ?? ""} className={inputClass + " mt-1.5"} placeholder="Surabaya" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">URL website</span>
          <input name="website_url" defaultValue={initial?.website_url ?? ""} className={inputClass + " mt-1.5"} placeholder="https://…" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Mode website *</span>
          <select name="site_mode" defaultValue={initial?.site_mode ?? "demo"} className={inputClass + " mt-1.5"}>
            <option value="demo">Demo (label demo tampil)</option>
            <option value="live">Live (bisnis aktif)</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Teks footer</span>
          <input name="footer_text" defaultValue={initial?.footer_text ?? ""} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">SEO — Default title</span>
          <input name="default_seo_title" defaultValue={initial?.default_seo_title ?? ""} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">SEO — Meta description</span>
          <textarea name="default_seo_description" rows={2} defaultValue={initial?.default_seo_description ?? ""} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">SEO — OG image URL</span>
          <input name="og_image_url" defaultValue={initial?.og_image_url ?? ""} className={inputClass + " mt-1.5"} placeholder="https://…" />
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-6">
        <button type="submit" disabled={pending} className="rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
          {pending ? "Menyimpan…" : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
