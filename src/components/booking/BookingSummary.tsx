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
}: {
  values: BookingFormValues;
  onBack: () => void;
  vehicles: Vehicle[];
  services: Service[];
  whatsappNumber: string | null;
  siteMode: "demo" | "live";
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
        })
      : "";
  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, message)
    : null;

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-900">
        Periksa Kembali Pemesanan Anda
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Pastikan data di bawah sudah benar sebelum membuka WhatsApp.
      </p>

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
        Membuka WhatsApp tidak berarti pesan sudah terkirim atau pemesanan
        terkonfirmasi. Anda tetap perlu menekan tombol kirim, lalu menunggu
        konfirmasi ketersediaan dan total biaya dari pengelola.
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
