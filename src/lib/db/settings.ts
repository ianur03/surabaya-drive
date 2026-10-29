import { cacheTag } from "next/cache";

import { getPublicSupabase } from "@/lib/supabase/public";
import { createServerSupabase } from "@/lib/supabase/server";

import type { SiteSettingsRow } from "@/lib/db/types";

/**
 * Pengaturan situs untuk publik. Mengembalikan null bila baris belum ada
 * (fallback ke konten lama di sisi pemanggil).
 */
export async function getPublicSiteSettings(): Promise<SiteSettingsRow | null> {
  "use cache";
  cacheTag("public-settings");

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return null;
  return data;
}

/** Pengaturan situs untuk admin (semua field, termasuk yang privat). */
export async function adminGetSettings(): Promise<SiteSettingsRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return null;
  return data;
}
