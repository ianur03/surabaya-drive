"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  updateBookingDetails,
  updateBookingStatus,
} from "@/app/admin/(dashboard)/bookings/actions";

import type { BookingWithVehicle } from "@/lib/db/bookings";

const statusOptions = [
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "in_progress", label: "Berlangsung" },
  { value: "completed", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
  { value: "cancelled", label: "Dibatalkan" },
];

export function BookingActions({ booking }: { booking: BookingWithVehicle }) {
  const router = useRouter();
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusPending, setStatusPending] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailPending, setDetailPending] = useState(false);

  async function handleStatus(formData: FormData) {
    setStatusPending(true);
    setStatusError(null);
    const status = String(formData.get("status"));
    const res = await updateBookingStatus(booking.id, status);
    setStatusPending(false);
    if (res.error) {
      setStatusError(res.error);
      return;
    }
    router.refresh();
  }

  async function handleDetails(formData: FormData) {
    setDetailPending(true);
    setDetailError(null);
    const notes = String(formData.get("admin_notes") ?? "");
    const quote = String(formData.get("quoted_total") ?? "");
    const res = await updateBookingDetails(booking.id, notes, quote);
    setDetailPending(false);
    if (res.error) {
      setDetailError(res.error);
      return;
    }
    router.refresh();
  }

  const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Status
        </h2>
        <form action={handleStatus} className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="status" className="block text-xs text-slate-500">
              Ubah status
            </label>
            <select id="status" name="status" defaultValue={booking.status} className={inputClass + " mt-1"}>
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={statusPending}
            className="rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {statusPending ? "Menyimpan…" : "Simpan Status"}
          </button>
        </form>
        {statusError && (
          <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {statusError}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Catatan Internal & Harga
        </h2>
        <form action={handleDetails} className="mt-4 space-y-4">
          <label className="block">
            <span className="text-xs text-slate-500">Catatan admin (tidak terlihat pelanggan)</span>
            <textarea name="admin_notes" rows={3} defaultValue={booking.admin_notes ?? ""} className={inputClass + " mt-1"} />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Total harga (Rp)</span>
            <input name="quoted_total" type="number" min={0} defaultValue={booking.quoted_total ?? ""} className={inputClass + " mt-1"} placeholder="Ditentukan manual oleh admin" />
          </label>
          <button
            type="submit"
            disabled={detailPending}
            className="rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {detailPending ? "Menyimpan…" : "Simpan Catatan & Harga"}
          </button>
        </form>
        {detailError && (
          <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {detailError}
          </p>
        )}
      </div>
    </div>
  );
}
