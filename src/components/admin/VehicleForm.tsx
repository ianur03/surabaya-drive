"use client";

import { useActionState } from "react";
import Link from "next/link";

import { FUEL_TYPES } from "@/lib/validators/vehicle";
import type { VehicleActionState } from "@/app/admin/(dashboard)/vehicles/actions";
import type { VehicleRow } from "@/lib/db/types";

type FormAction = (
  prev: VehicleActionState,
  formData: FormData,
) => Promise<VehicleActionState>;

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

const categories = ["MPV", "City Car", "Sedan", "SUV"];
const transmissions = ["Manual", "Automatic"];
const statuses = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Aktif" },
  { value: "maintenance", label: "Perawatan" },
  { value: "archived", label: "Arsip" },
];

export function VehicleForm({
  action,
  initial,
  submitLabel,
}: {
  action: FormAction;
  initial?: VehicleRow | null;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Nama *</span>
          <input name="name" required defaultValue={initial?.name ?? ""} className={inputClass + " mt-1.5"} placeholder="Toyota Avanza" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Slug *</span>
          <input name="slug" required defaultValue={initial?.slug ?? ""} className={inputClass + " mt-1.5"} placeholder="toyota-avanza" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Brand *</span>
          <input name="brand" required defaultValue={initial?.brand ?? ""} className={inputClass + " mt-1.5"} placeholder="Toyota" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Model</span>
          <input name="model" defaultValue={initial?.model ?? ""} className={inputClass + " mt-1.5"} placeholder="Avanza" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Kategori *</span>
          <select name="category" required defaultValue={initial?.category ?? "MPV"} className={inputClass + " mt-1.5"}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Transmisi *</span>
          <select name="transmission" required defaultValue={initial?.transmission ?? "Manual"} className={inputClass + " mt-1.5"}>
            {transmissions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Bahan bakar *</span>
          <select name="fuel_type" defaultValue={initial?.fuel_type ?? "Bensin"} className={inputClass + " mt-1.5"}>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 pt-6">
          <input name="driver_service_available" type="checkbox" defaultChecked={initial?.driver_service_available ?? false} className="h-4 w-4 accent-teal-700" />
          <span className="text-sm font-medium text-slate-800">Layanan sopir tersedia</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Kapasitas penumpang *</span>
          <input name="passenger_capacity" type="number" min={1} required defaultValue={initial?.passenger_capacity ?? 5} className={inputClass + " mt-1.5"} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Warna ilustrasi</span>
          <input name="color" type="color" defaultValue={initial?.color ?? "#0f766e"} className="mt-1.5 h-10 w-16 rounded border border-slate-300" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Harga lepas kunci/hari (Rp) *</span>
          <input name="daily_price_without_driver" type="number" min={0} required defaultValue={initial?.daily_price_without_driver ?? ""} className={inputClass + " mt-1.5"} placeholder="350000" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Harga dengan sopir/hari (Rp)</span>
          <input name="daily_price_with_driver" type="number" min={0} defaultValue={initial?.daily_price_with_driver ?? ""} className={inputClass + " mt-1.5"} placeholder="Kosongkan bila belum ada" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Status *</span>
          <select name="status" required defaultValue={initial?.status ?? "draft"} className={inputClass + " mt-1.5"}>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 pt-6">
          <input name="is_featured" type="checkbox" defaultChecked={initial?.is_featured ?? false} className="h-4 w-4 accent-teal-700" />
          <span className="text-sm font-medium text-slate-800">Tampil unggulan</span>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">Deskripsi</span>
          <textarea name="description" rows={3} defaultValue={initial?.description ?? ""} className={inputClass + " mt-1.5"} />
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : submitLabel}
        </button>
        <Link href="/admin/vehicles" className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Batal
        </Link>
      </div>
    </form>
  );
}
