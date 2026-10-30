import { cacheTag } from "next/cache";

import { getPublicSupabase } from "@/lib/supabase/public";
import { createServerSupabase } from "@/lib/supabase/server";

import type { VehicleImageRow, VehicleRow } from "@/lib/db/types";

/** Katalog kendaraan untuk publik: hanya yang berstatus `active`. */
export async function getPublicVehicles(): Promise<VehicleRow[]> {
  "use cache";
  cacheTag("public-vehicles");

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Semua kendaraan (admin). */
export async function adminListVehicles(): Promise<VehicleRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Satu kendaraan (admin), null bila tidak ada. */
export async function adminGetVehicle(id: string): Promise<VehicleRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

/** Galeri gambar untuk satu kendaraan (admin), urut berdasarkan sort_order. */
export async function adminListVehicleImages(
  vehicleId: string,
): Promise<VehicleImageRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("vehicle_images")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
