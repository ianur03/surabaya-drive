import { notFound } from "next/navigation";

import { adminGetBooking } from "@/lib/db/bookings";
import { BookingActions } from "@/components/admin/BookingActions";

const serviceLabels: Record<string, string> = {
  self_drive: "Lepas kunci",
  with_driver: "Dengan sopir",
};

function fmtDateTime(iso: string): string {
  const d = iso.slice(0, 10);
  const [y, m, day] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${day} ${months[Number(m) - 1]} ${y}`;
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await adminGetBooking(id);

  if (!booking) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Booking {booking.booking_code}
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Detail Permintaan
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="Nama" value={booking.customer_name} />
            <DetailRow label="Nomor WhatsApp" value={booking.customer_phone} />
            <DetailRow label="Mobil" value={booking.vehicles?.name ?? "-"} />
            <DetailRow label="Layanan" value={serviceLabels[booking.service_type] ?? booking.service_type} />
            <DetailRow label="Tanggal mulai" value={fmtDateTime(booking.start_at)} />
            <DetailRow label="Tanggal selesai" value={fmtDateTime(booking.end_at)} />
            <DetailRow label="Lokasi penjemputan" value={booking.pickup_location} />
            {booking.customer_notes && (
              <DetailRow label="Catatan pelanggan" value={booking.customer_notes} />
            )}
          </dl>
        </div>

        <BookingActions booking={booking} />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  );
}
