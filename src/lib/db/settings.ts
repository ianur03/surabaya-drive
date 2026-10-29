import { createServerSupabase } from "@/lib/supabase/server";

import type { SiteSettingsRow } from "@/lib/db/types";

/**
 * Pengaturan situs untuk publik. Mengembalikan null bila baris belum ada
 * (fallback ke konten lama di sisi pemanggil).
 */
export async function getPublicSiteSettings(): Promise<SiteSettingsRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) return null;
  return data;
}
