"use client";

import { useRouter } from "next/navigation";

import { deleteService } from "@/app/admin/(dashboard)/services/actions";

export function DeleteServiceButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    const ok = window.confirm(
      `Hapus layanan "${name}" secara permanen? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!ok) return;

    const res = await deleteService(id);
    if (res.error) {
      window.alert(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Hapus
    </button>
  );
}