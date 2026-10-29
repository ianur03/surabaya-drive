"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";
import { serviceSchema } from "@/lib/validators/service";

export type ServiceActionState = { error?: string };

export async function updateService(
  id: string,
  _prev: ServiceActionState,
  formData: FormData,
): Promise<ServiceActionState> {
  const parsed = serviceSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    short_name: formData.get("short_name"),
    description: formData.get("description"),
    benefits: String(formData.get("benefits") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    status: formData.get("status"),
    sort_order: formData.get("sort_order") ?? "0",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("services")
    .update(parsed.data, {})
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai. Gunakan slug lain." };
    }
    return { error: "Gagal menyimpan layanan." };
  }

  revalidateTag("public-services", { expire: 0 });
  redirect("/admin/services");
}
