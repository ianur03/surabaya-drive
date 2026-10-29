import { cacheTag } from "next/cache";

import { getPublicSupabase } from "@/lib/supabase/public";
import { createServerSupabase } from "@/lib/supabase/server";

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

/** Semua FAQ (admin). */
export async function adminListFaqs(): Promise<FaqRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Satu FAQ (admin). */
export async function adminGetFaq(id: string): Promise<FaqRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
