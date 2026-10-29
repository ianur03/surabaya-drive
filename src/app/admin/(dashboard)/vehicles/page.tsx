import Link from "next/link";

import { adminListVehicles } from "@/lib/db/vehicles";
import { ArchiveButton } from "@/components/admin/ArchiveButton";
import { formatRupiah } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  active: "Aktif",
  maintenance: "Perawatan",
  archived: "Arsip",
};

export default async function VehiclesPage() {
  const vehicles = await adminListVehicles();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Kendaraan</h1>
        <Link
          href="/admin/vehicles/new"
          className="rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + Tambah Kendaraan
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
          Belum ada kendaraan. Tambahkan yang pertama.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Transmisi</th>
                <th className="px-4 py-3 font-medium">Kapasitas</th>
                <th className="px-4 py-3 font-medium">Harga/hari</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{v.name}</td>
                  <td className="px-4 py-3 text-slate-600">{v.category ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{v.transmission}</td>
                  <td className="px-4 py-3 text-slate-600">{v.passenger_capacity}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {v.daily_price_without_driver != null
                      ? formatRupiah(Number(v.daily_price_without_driver))
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {statusLabels[v.status] ?? v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/vehicles/${v.id}`}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
                      >
                        Edit
                      </Link>
                      {v.status !== "archived" && (
                        <ArchiveButton id={v.id} name={v.name} />
                      )}
                    </div>
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
