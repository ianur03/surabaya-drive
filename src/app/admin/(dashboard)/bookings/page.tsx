import Link from "next/link";

import { adminListBookings } from "@/lib/db/bookings";

const statusLabels: Record<string, string> = {
  new: "Baru",
  contacted: "Dihubungi",
  confirmed: "Dikonfirmasi",
  in_progress: "Berlangsung",
  completed: "Selesai",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

const serviceLabels: Record<string, string> = {
  self_drive: "Lepas kunci",
  with_driver: "Dengan sopir",
};

function fmtDate(iso: string): string {
  const d = iso.slice(0, 10);
  const [y, m, day] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${day} ${months[Number(m) - 1]} ${y}`;
}

export default async function BookingsPage() {
  const bookings = await adminListBookings();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Booking</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Permintaan pemesanan dari formulir publik.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-8 text-sm text-slate-600 dark:text-slate-300">
          Belum ada permintaan booking.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Kode</th>
                <th className="px-4 py-3 font-medium">Pelanggan</th>
                <th className="px-4 py-3 font-medium">Mobil</th>
                <th className="px-4 py-3 font-medium">Layanan</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="font-mono font-medium text-teal-700 dark:text-teal-400 hover:underline">
                      {b.booking_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white">{b.customer_name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.vehicles?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{serviceLabels[b.service_type] ?? b.service_type}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {fmtDate(b.start_at)} → {fmtDate(b.end_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                      {statusLabels[b.status] ?? b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
