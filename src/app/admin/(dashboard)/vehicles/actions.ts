"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";
import { vehicleSchema } from "@/lib/validators/vehicle";

export type VehicleActionState = { error?: string };

function parseVehicle(formData: FormData) {
  return vehicleSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    brand: formData.get("brand"),
    model: formData.get("model") ?? "",
    category: formData.get("category"),
    transmission: formData.get("transmission"),
    fuel_type: formData.get("fuel_type"),
    driver_service_available: formData.get("driver_service_available") === "on",
    passenger_capacity: formData.get("passenger_capacity"),
    color: formData.get("color") ?? "#0f766e",
    daily_price_without_driver: formData.get("daily_price_without_driver"),
    daily_price_with_driver: formData.get("daily_price_with_driver") ?? "",
    description: formData.get("description") ?? "",
    status: formData.get("status"),
    is_featured: formData.get("is_featured") === "on",
  });
}

export async function createVehicle(
  _prev: VehicleActionState,
  formData: FormData,
): Promise<VehicleActionState> {
  const parsed = parseVehicle(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("vehicles").insert(parsed.data, {});

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai. Gunakan slug lain." };
    }
    return { error: "Gagal menyimpan kendaraan. Coba lagi." };
  }

  revalidateTag("public-vehicles", { expire: 0 });
  redirect("/admin/vehicles");
}

export async function updateVehicle(
  id: string,
  _prev: VehicleActionState,
  formData: FormData,
): Promise<VehicleActionState> {
  const parsed = parseVehicle(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("vehicles")
    .update(parsed.data, {})
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Slug sudah dipakai. Gunakan slug lain." };
    }
    return { error: "Gagal memperbarui kendaraan. Coba lagi." };
  }

  revalidateTag("public-vehicles", { expire: 0 });
  redirect("/admin/vehicles");
}

export async function archiveVehicle(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.from("vehicles").update({ status: "archived" }, {}).eq("id", id);
  revalidateTag("public-vehicles", { expire: 0 });
}
