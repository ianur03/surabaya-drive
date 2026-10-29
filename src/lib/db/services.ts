import { cacheTag } from "next/cache";

import { getPublicSupabase } from "@/lib/supabase/public";
import { createServerSupabase } from "@/lib/supabase/server";

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

/** Semua layanan (admin). */
export async function adminListServices(): Promise<ServiceRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Satu layanan (admin). */
export async function adminGetService(id: string): Promise<ServiceRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
