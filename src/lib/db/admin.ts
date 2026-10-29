import { createServerSupabase } from "@/lib/supabase/server";

export type DashboardMetrics = {
  totalVehicles: number;
  activeVehicles: number;
  newBookings: number;
  activeBookings: number;
};

/** Metrik dashboard dari database (bukan data contoh). */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createServerSupabase();

  const [v1, v2, b1, b2] = await Promise.all([
    supabase.from("vehicles").select("id", { count: "exact", head: true }),
    supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("status", ["confirmed", "in_progress"]),
  ]);

  if (v1.error) throw v1.error;
  if (v2.error) throw v2.error;
  if (b1.error) throw b1.error;
  if (b2.error) throw b2.error;

  return {
    totalVehicles: v1.count ?? 0,
    activeVehicles: v2.count ?? 0,
    newBookings: b1.count ?? 0,
    activeBookings: b2.count ?? 0,
  };
}

export type AdminProfile = { role: string };

/** Cek apakah pengguna saat ini admin/owner (dipakai di layout admin). */
export async function getAdminProfile(): Promise<AdminProfile | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data ?? null;
}
