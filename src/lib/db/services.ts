import { createServerSupabase } from "@/lib/supabase/server";

import type { ServiceRow } from "@/lib/db/types";

/** Layanan untuk publik: hanya yang berstatus `published`. */
export async function getPublicServices(): Promise<ServiceRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
