"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionState } from "react";

import { FUEL_TYPES } from "@/lib/validators/vehicle";
import { MAX_GALLERY_IMAGES, validateImageFile } from "@/lib/uploads";
import type { VehicleActionState } from "@/app/admin/(dashboard)/vehicles/actions";
import type { VehicleImageRow, VehicleRow } from "@/lib/db/types";

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
  existingImages = [],
  submitLabel,
}: {
  action: FormAction;
  initial?: VehicleRow | null;
  existingImages?: VehicleImageRow[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [clientError, setClientError] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<
    Array<{ name: string; url: string }>
  >([]);

  function handleHeroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setHeroPreview(null);
      return;
    }
    const err = validateImageFile(file);
    if (err) {
      setClientError(err);
      e.target.value = "";
      setHeroPreview(null);
      return;
    }
    setClientError(null);
    setHeroPreview(URL.createObjectURL(file));
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > MAX_GALLERY_IMAGES) {
      setClientError(`Maksimal ${MAX_GALLERY_IMAGES} gambar galeri.`);
      e.target.value = "";
      setGalleryPreviews([]);
      return;
    }
    const err = files.map(validateImageFile).find(Boolean);
    if (err) {
      setClientError(err ?? null);
      e.target.value = "";
      setGalleryPreviews([]);
      return;
    }
    setClientError(null);
    setGalleryPreviews(
      files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Backstop: blokir submit bila ada file invalid (agar file tidak hilang).
    const fd = new FormData(e.currentTarget);
    const files = fd
      .getAll("gallery_images")
      .filter((f): f is File => f instanceof File && f.size > 0);
    const hero = fd.get("hero_image");
    if (hero instanceof File && hero.size > 0) files.unshift(hero);
    const err = files.map(validateImageFile).find(Boolean);
    if (err) {
      e.preventDefault();
      setClientError(err ?? null);
    }
  }

  const error = clientError ?? state?.error;

  return (
    <form action={formAction} onSubmit={handleSubmit} className="mt-6 max-w-2xl">
      {/* ===== Gambar ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-900">Gambar</p>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-800">
            Gambar Hero (wajib untuk kendaraan aktif)
          </span>
          <input
            name="hero_image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleHeroChange}
            className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-teal-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-800"
          />
        </label>

        {(heroPreview || initial?.image_url) && (
          <div className="mt-3 flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPreview ?? initial?.image_url ?? ""}
              alt="Preview hero"
              className="h-24 w-36 rounded-lg border border-slate-200 object-cover"
            />
            <p className="text-xs text-slate-500">
              {heroPreview
                ? "Pratinjau gambar baru (belum tersimpan)."
                : "Gambar hero tersimpan. Pilih file baru untuk menggantinya."}
            </p>
          </div>
        )}

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-800">
            Gambar Tambahan / Galeri (maks. {MAX_GALLERY_IMAGES})
          </span>
          <input
            name="gallery_images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleGalleryChange}
            className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
        </label>

        {galleryPreviews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {galleryPreviews.map((g) => (
              <div key={g.url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.url}
                  alt={g.name}
                  className="h-16 w-24 rounded-lg border border-slate-200 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {existingImages.length > 0 && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Galeri tersimpan — centang untuk menghapus
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <label
                  key={img.id}
                  className="relative cursor-pointer rounded-lg border border-slate-200 p-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_path}
                    alt={img.alt_text ?? ""}
                    className="h-16 w-24 rounded-md object-cover"
                  />
                  <span className="absolute right-1 top-1 flex items-center gap-1 rounded bg-white/90 px-1.5 py-0.5 text-xs text-red-600">
                    <input
                      type="checkbox"
                      name="remove_image_id"
                      value={img.id}
                      className="h-3.5 w-3.5 accent-red-600"
                    />
                    Hapus
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== Data ===== */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-800">Nama *</span>
          <input name="name" required defaultValue={initial?.name ?? ""} className={inputClass + " mt-1.5"} placeholder="Toyota Avanza" />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-800">Kode kendaraan (slug) *</span>
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

        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2">
            <input name="driver_service_available" type="checkbox" defaultChecked={initial?.driver_service_available ?? false} className="h-4 w-4 accent-teal-700" />
            <span className="text-sm font-medium text-slate-800">Layanan sopir tersedia</span>
          </label>
          <label className="flex items-center gap-2">
            <input name="is_featured" type="checkbox" defaultChecked={initial?.is_featured ?? false} className="h-4 w-4 accent-teal-700" />
            <span className="text-sm font-medium text-slate-800">Tampil unggulan</span>
          </label>
        </div>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-800">Deskripsi</span>
          <textarea name="description" rows={3} defaultValue={initial?.description ?? ""} className={inputClass + " mt-1.5"} />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
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