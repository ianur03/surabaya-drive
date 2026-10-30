import Link from "next/link";

import { adminListServices } from "@/lib/db/services";
import { DeleteServiceButton } from "@/components/admin/DeleteServiceButton";

const statusLabels: Record<string, string> = {
  draft: "Nonaktif",
  published: "Aktif",
  archived: "Arsip",
};

export default async function ServicesPage() {
  const services = await adminListServices();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Layanan</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Kelola deskripsi dan status publikasi layanan rental.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + Tambah Layanan
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-8 text-sm text-slate-600 dark:text-slate-300">
          Belum ada layanan. Tambahkan yang pertama.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white">{s.name}</h2>
                <span
                  className={
                    s.status === "published"
                      ? "rounded-full bg-teal-50 dark:bg-teal-900/40 px-2 py-1 text-xs font-medium text-teal-700 dark:text-teal-400"
                      : "rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                  }
                >
                  {statusLabels[s.status] ?? s.status}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{s.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/admin/services/${s.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/40"
                >
                  Edit
                </Link>
                <DeleteServiceButton id={s.id} name={s.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}