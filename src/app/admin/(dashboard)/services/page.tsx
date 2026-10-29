import Link from "next/link";

import { adminListServices } from "@/lib/db/services";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Terbit",
  archived: "Arsip",
};

export default async function ServicesPage() {
  const services = await adminListServices();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Layanan</h1>
      <p className="mt-1 text-sm text-slate-600">
        Kelola deskripsi dan status publikasi layanan rental.
      </p>

      {services.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
          Belum ada layanan.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">{s.name}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {statusLabels[s.status] ?? s.status}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{s.description}</p>
              <Link
                href={`/admin/services/${s.id}`}
                className="mt-4 inline-block rounded-lg px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
