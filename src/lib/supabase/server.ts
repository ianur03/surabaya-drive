import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

/** Supabase client untuk server (Server Components, Route Handlers, Server Actions). */
export async function createServerSupabase() {
  // Paksa render request-time: session Supabase memakai `Date.now()` internal,
  // yang kalau dipanggil saat prerender memicu error Next 16.
  await connection();

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari Server Component — cookie hanya bisa diset lewat
            // middleware / route handler / server action.
          }
        },
      },
    },
  );
}
