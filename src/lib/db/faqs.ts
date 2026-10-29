import { createServerSupabase } from "@/lib/supabase/server";

import type { FaqRow } from "@/lib/db/types";

/** FAQ untuk publik: hanya yang dipublikasikan. */
export async function getPublishedFaqs(): Promise<FaqRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
