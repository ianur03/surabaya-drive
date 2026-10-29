import type { Vehicle } from "@/types/vehicle";

/**
 * Data armada FALLBACK (demo) — dipakai hanya jika database belum tersedia/terisi.
 * Bukan sumber kebenaran produksi. Harga dan kendaraan adalah contoh.
 */
export const vehicles: Vehicle[] = [
  {
    id: "toyota-avanza",
    slug: "toyota-avanza",
    name: "Toyota Avanza",
    category: "MPV",
    color: "#0f766e",
    capacity: 7,
    transmission: "Manual",
    pricePerDay: 350_000,
    priceWithDriver: null,
  },
  {
    id: "honda-brio",
    slug: "honda-brio",
    name: "Honda Brio",
    category: "City Car",
    color: "#2563eb",
    capacity: 5,
    transmission: "Automatic",
    pricePerDay: 300_000,
    priceWithDriver: null,
  },
  {
    id: "toyota-innova",
    slug: "toyota-innova",
    name: "Toyota Innova",
    category: "MPV",
    color: "#7c3aed",
    capacity: 7,
    transmission: "Automatic",
    pricePerDay: 550_000,
    priceWithDriver: null,
  },
  {
    id: "honda-crv",
    slug: "honda-crv",
    name: "Honda CR-V",
    category: "SUV",
    color: "#b45309",
    capacity: 5,
    transmission: "Automatic",
    pricePerDay: 750_000,
    priceWithDriver: null,
  },
  {
    id: "daihatsu-xenia",
    slug: "daihatsu-xenia",
    name: "Daihatsu Xenia",
    category: "MPV",
    color: "#0d9488",
    capacity: 7,
    transmission: "Manual",
    pricePerDay: 325_000,
    priceWithDriver: null,
  },
  {
    id: "toyota-camry",
    slug: "toyota-camry",
    name: "Toyota Camry",
    category: "Sedan",
    color: "#334155",
    capacity: 5,
    transmission: "Automatic",
    pricePerDay: 850_000,
    priceWithDriver: null,
  },
];

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.id === id);
}
