import type { ServiceRow, VehicleRow } from "@/lib/db/types";
import type {
  Service,
  ServiceType,
  Transmission,
  Vehicle,
  VehicleCategory,
} from "@/types/vehicle";

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
    fuelType: row.fuel_type ?? "Bensin",
    driverServiceAvailable: row.driver_service_available ?? false,
    pricePerDay: row.daily_price_without_driver ?? 0,
    priceWithDriver: row.daily_price_with_driver,
  };
}

/** Petakan baris DB `services` ke bentuk `Service` untuk komponen publik. */
export function mapServiceRow(row: ServiceRow): Service {
  return {
    id: row.slug as ServiceType,
    name: row.name,
    shortName: row.short_name,
    description: row.description,
    points: row.benefits,
  };
}
