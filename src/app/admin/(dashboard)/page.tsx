import { getDashboardMetrics } from "@/lib/db/admin";

const metricLabels: Array<{ key: keyof Awaited<ReturnType<typeof getDashboardMetrics>>; label: string }> = [
  { key: "totalVehicles", label: "Total kendaraan" },
  { key: "activeVehicles", label: "Kendaraan aktif" },
  { key: "newBookings", label: "Booking baru (belum ditinjau)" },
  { key: "activeBookings", label: "Booking aktif (dikonfirmasi)" },
];

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">
        Ringkasan data aktual dari database.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricLabels.map(({ key, label }) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {metrics[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-medium text-slate-900">Pendapatan</p>
        <p className="mt-2 text-sm text-slate-600">
          Belum tersedia — tidak ada data transaksi/pembayaran pada versi ini.
          Total biaya ditetapkan manual oleh admin per booking.
        </p>
      </div>
    </div>
  );
}
