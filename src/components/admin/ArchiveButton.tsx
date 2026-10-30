"use client";

import { useRouter } from "next/navigation";

import { archiveVehicle } from "@/app/admin/(dashboard)/vehicles/actions";

export function ArchiveButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleArchive() {
    if (!window.confirm(`Arsipkan "${name}"? Kendaraan tidak akan tampil di katalog publik.`)) {
      return;
    }
    await archiveVehicle(id);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleArchive}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
    >
      Arsipkan
    </button>
  );
}
