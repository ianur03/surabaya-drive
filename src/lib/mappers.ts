import type { VehicleRow } from "@/lib/db/types";
import type { Transmission, Vehicle, VehicleCategory } from "@/types/vehicle";

/** Petakan baris DB `vehicles` ke bentuk `Vehicle` yang dipakai komponen publik. */
export function mapVehicleRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: (row.category as VehicleCategory) ?? "MPV",
    color: row.color ?? "#0f766e",
    capacity: row.passenger_capacity,
    transmission: (row.transmission as Transmission) ?? "Manual",
    pricePerDay: row.daily_price_without_driver ?? 0,
    priceWithDriver: row.daily_price_with_driver,
  };
}
