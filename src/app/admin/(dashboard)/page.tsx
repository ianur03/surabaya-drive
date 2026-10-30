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
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Ringkasan data aktual dari database.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricLabels.map(({ key, label }) => (
          <div key={key} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {metrics[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
        <p className="text-sm font-medium text-slate-900 dark:text-white">Pendapatan</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Belum tersedia — tidak ada data transaksi/pembayaran pada versi ini.
          Total biaya ditetapkan manual oleh admin per booking.
        </p>
      </div>
    </div>
  );
}
