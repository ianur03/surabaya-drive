"use client";

import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/booking";
import { formatDateLong } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

import type { BookingFormValues, Service, Vehicle } from "@/types/vehicle";

export function BookingSummary({
  values,
  onBack,
  vehicles,
  services,
  whatsappNumber,
  siteMode,
  bookingCode,
}: {
  values: BookingFormValues;
  onBack: () => void;
  vehicles: Vehicle[];
  services: Service[];
  whatsappNumber: string | null;
  siteMode: "demo" | "live";
  bookingCode: string | null;
}) {
  const vehicle = vehicles.find((v) => v.id === values.vehicleId);
  const service = services.find((s) => s.id === values.service);

  const message =
    vehicle && service
      ? buildWhatsAppMessage({
          name: values.name,
          phone: values.phone,
          startDate: values.startDate,
          endDate: values.endDate,
          pickupLocation: values.pickupLocation,
          notes: values.notes,
          vehicle,
          serviceName: service.shortName,
          bookingCode: bookingCode ?? undefined,
        })
      : "";
  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, message)
    : null;

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-900">
        Permintaan Tercatat
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Permintaan Anda sudah tersimpan. Simpan kode berikut untuk referensi:
      </p>

      {bookingCode && (
        <p className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-center text-lg font-mono font-semibold tracking-widest text-teal-800">
          {bookingCode}
        </p>
      )}

      <dl className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        <SummaryRow label="Nama" value={values.name} />
        <SummaryRow label="Nomor WhatsApp" value={values.phone} />
        <SummaryRow label="Mobil" value={vehicle?.name ?? "-"} />
        <SummaryRow label="Jenis layanan" value={service?.name ?? "-"} />
        <SummaryRow label="Tanggal mulai" value={formatDateLong(values.startDate)} />
        <SummaryRow label="Tanggal selesai" value={formatDateLong(values.endDate)} />
        <SummaryRow label="Lokasi penjemputan" value={values.pickupLocation} />
        {values.notes?.trim() && (
          <SummaryRow label="Catatan tambahan" value={values.notes.trim()} />
        )}
      </dl>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        Permintaan belum terkonfirmasi. Lanjutkan ke WhatsApp untuk memberi tahu
        pengelola, lalu tunggu konfirmasi ketersediaan dan total biaya.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("whatsapp", "lg")}
          >
            Lanjutkan ke WhatsApp
          </a>
        ) : (
          <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Nomor WhatsApp belum dikonfigurasi. Hubungi pengelola untuk
            menyelesaikan pemesanan.
          </div>
        )}
        <button type="button" onClick={onBack} className={buttonClass("ghost", "md")}>
          Kembali ke Formulir
        </button>
      </div>

      {siteMode === "demo" && whatsappNumber && (
        <p className="mt-4 text-xs text-slate-500">
          Website ini masih dalam mode demo. Nomor WhatsApp adalah contoh.
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
