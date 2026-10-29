import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Supabase client anon untuk baca data PUBLIK (tanpa sesi/cookies).
 * Dipakai oleh halaman publik supaya tetap bisa di-prerender (static).
 */
export function getPublicSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
