import { z } from "zod";

import type { ServiceType, Vehicle } from "@/types/vehicle";
import { formatDateShort, normalizePhoneNumber, todayISO } from "@/lib/utils";

const SERVICE_TYPES: ServiceType[] = ["self-drive", "with-driver"];

/**
 * Skema validasi formulir pemesanan.
 * Menggunakan `.refine` (bukan superRefine) agar perilakunya stabil lintas versi Zod.
 */
export const bookingSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi"),
    phone: z
      .string()
      .trim()
      .min(1, "Nomor WhatsApp wajib diisi")
      .refine(
        (value) => normalizePhoneNumber(value) !== null,
        "Format nomor WhatsApp tidak valid",
      ),
    vehicleId: z.string().min(1, "Pilih mobil terlebih dahulu"),
    service: z
      .string()
      .refine(
        (value): value is ServiceType => SERVICE_TYPES.includes(value as ServiceType),
        "Pilih jenis layanan",
      ),
    startDate: z.string().min(1, "Pilih tanggal mulai"),
    endDate: z.string().min(1, "Pilih tanggal selesai"),
    pickupLocation: z.string().trim().min(1, "Lokasi penjemputan wajib diisi"),
    notes: z.string().trim().optional(),
  })
  .refine(
    (data) => data.startDate === "" || data.startDate >= todayISO(),
    { message: "Tanggal mulai tidak boleh di masa lalu", path: ["startDate"] },
  )
  .refine(
    (data) =>
      data.startDate === "" || data.endDate === "" || data.endDate >= data.startDate,
    {
      message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
      path: ["endDate"],
    },
  );

export type BookingSchema = z.infer<typeof bookingSchema>;
export type BookingSchemaInput = z.input<typeof bookingSchema>;

export type BookingMessageInput = {
  name: string;
  phone: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  notes?: string;
  vehicle: Vehicle;
  serviceName: string;
  bookingCode?: string;
};

export function buildWhatsAppMessage(data: BookingMessageInput): string {
  const lines = [
    "Halo Surabaya Drive, saya ingin menanyakan pemesanan rental mobil.",
    "",
    `Nama: ${data.name}`,
    `Mobil: ${data.vehicle.name}`,
    `Layanan: ${data.serviceName}`,
    `Tanggal mulai: ${formatDateShort(data.startDate)}`,
    `Tanggal selesai: ${formatDateShort(data.endDate)}`,
    `Lokasi penjemputan: ${data.pickupLocation}`,
  ];

  if (data.notes && data.notes.trim()) {
    lines.push(`Catatan: ${data.notes.trim()}`);
  }

  if (data.bookingCode) {
    lines.push(`Kode permintaan: ${data.bookingCode}`);
  }

  lines.push("", "Mohon informasi ketersediaan mobil dan total biaya. Terima kasih.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
