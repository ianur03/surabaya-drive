import { createServerSupabase } from "@/lib/supabase/server";

import type { VehicleRow } from "@/lib/db/types";

/** Katalog kendaraan untuk publik: hanya yang berstatus `active`. */
export async function getPublicVehicles(): Promise<VehicleRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
