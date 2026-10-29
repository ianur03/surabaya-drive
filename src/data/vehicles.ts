import type { Vehicle } from "@/types/vehicle";

/**
 * Data armada (contoh / demo).
 * Harga dan kendaraan di bawah adalah data dummy untuk keperluan portofolio,
 * bukan penawaran bisnis nyata.
 */
export const vehicles: Vehicle[] = [
  {
    id: "toyota-avanza",
    name: "Toyota Avanza",
    category: "MPV",
    color: "#0f766e",
    capacity: 7,
    transmission: "Manual",
    pricePerDay: 350_000,
  },
  {
    id: "honda-brio",
    name: "Honda Brio",
    category: "City Car",
    color: "#2563eb",
    capacity: 5,
    transmission: "Automatic",
    pricePerDay: 300_000,
  },
  {
    id: "toyota-innova",
    name: "Toyota Innova",
    category: "MPV",
    color: "#7c3aed",
    capacity: 7,
    transmission: "Automatic",
    pricePerDay: 550_000,
  },
  {
    id: "honda-crv",
    name: "Honda CR-V",
    category: "SUV",
    color: "#b45309",
    capacity: 5,
    transmission: "Automatic",
    pricePerDay: 750_000,
  },
  {
    id: "daihatsu-xenia",
    name: "Daihatsu Xenia",
    category: "MPV",
    color: "#0d9488",
    capacity: 7,
    transmission: "Manual",
    pricePerDay: 325_000,
  },
  {
    id: "toyota-camry",
    name: "Toyota Camry",
    category: "Sedan",
    color: "#334155",
    capacity: 5,
    transmission: "Automatic",
    pricePerDay: 850_000,
  },
];

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.id === id);
}
