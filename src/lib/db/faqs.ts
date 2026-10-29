import { cacheTag } from "next/cache";

import { getPublicSupabase } from "@/lib/supabase/public";

import type { FaqRow } from "@/lib/db/types";

/** FAQ untuk publik: hanya yang dipublikasikan. */
export async function getPublishedFaqs(): Promise<FaqRow[]> {
  "use cache";
  cacheTag("public-faqs");

  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
