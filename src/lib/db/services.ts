import { cacheTag } from "next/cache";

import { getPublicSupabase } from "@/lib/supabase/public";

import type { ServiceRow } from "@/lib/db/types";

/** Layanan untuk publik: hanya yang berstatus `published`. */
export async function getPublicServices(): Promise<ServiceRow[]> {
  "use cache";
  cacheTag("public-services");

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
