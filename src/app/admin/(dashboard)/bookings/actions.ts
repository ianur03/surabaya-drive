"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabase } from "@/lib/supabase/server";

export type BookingActionResult = { error?: string };

/**
 * Perbarui status booking. Untuk `confirmed`, gunakan RPC atomik
 * `confirm_booking` yang memeriksa konflik kendaraan.
 */
export async function updateBookingStatus(
  id: string,
  status: string,
): Promise<BookingActionResult> {
  const supabase = await createServerSupabase();

  if (status === "confirmed") {
    const { error } = await supabase.rpc("confirm_booking", {
      p_booking_id: id,
    });
    if (error) {
      return {
        error:
          "Tidak dapat dikonfirmasi: kendaraan sudah dipesan pada rentang waktu tersebut.",
      };
    }
  } else {
    const { error } = await supabase
      .from("bookings")
      .update({ status }, {})
      .eq("id", id);
    if (error) return { error: "Gagal memperbarui status." };
  }

  revalidatePath("/admin/bookings");
  return {};
}

/** Simpan catatan internal dan total harga (quote) yang ditetapkan admin. */
export async function updateBookingDetails(
  id: string,
  adminNotes: string,
  quotedTotal: string,
): Promise<BookingActionResult> {
  const supabase = await createServerSupabase();

  const parsed = quotedTotal.trim() === "" ? null : Number(quotedTotal);
  if (parsed !== null && (Number.isNaN(parsed) || parsed < 0)) {
    return { error: "Total harga tidak valid." };
  }

  const { error } = await supabase
    .from("bookings")
    .update(
      { admin_notes: adminNotes.trim() || null, quoted_total: parsed },
      {},
    )
    .eq("id", id);

  if (error) return { error: "Gagal menyimpan catatan." };

  revalidatePath(`/admin/bookings/${id}`);
  return {};
}
