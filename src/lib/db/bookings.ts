import { createServerSupabase } from "@/lib/supabase/server";

import type { BookingRow } from "@/lib/db/types";

export type BookingWithVehicle = BookingRow & {
  vehicles: { name: string } | null;
};

/** Semua booking (admin), terbaru dulu. */
export async function adminListBookings(): Promise<BookingWithVehicle[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BookingWithVehicle[];
}

/** Satu booking (admin) beserta nama kendaraan. */
export async function adminGetBooking(
  id: string,
): Promise<BookingWithVehicle | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, vehicles(name)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BookingWithVehicle;
}
