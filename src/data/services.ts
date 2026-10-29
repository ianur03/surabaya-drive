import type { Service } from "@/types/vehicle";

export const services: Service[] = [
  {
    id: "self-drive",
    name: "Rental Lepas Kunci",
    shortName: "Lepas kunci",
    description:
      "Anda mengemudikan mobil sendiri. Cocok untuk yang sudah terbiasa menyetir dan ingin bebas mengatur rute serta jadwal perjalanan.",
    points: [
      "Anda mengemudikan kendaraan sendiri",
      "Cocok untuk perjalanan pribadi maupun keluarga",
      "Syarat, ketentuan, dan deposit dijelaskan langsung saat konfirmasi",
    ],
  },
  {
    id: "with-driver",
    name: "Rental Dengan Sopir",
    shortName: "Dengan sopir",
    description:
      "Sopir mengemudikan mobil untuk Anda. Cocok untuk acara, perjalanan bisnis, atau yang ingin sampai tujuan tanpa memikirkan rute.",
    points: [
      "Sopir yang mengemudikan kendaraan",
      "Cocok untuk acara dan perjalanan bisnis",
      "Tarif sopir dan ketentuan dijelaskan langsung saat konfirmasi",
    ],
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}
