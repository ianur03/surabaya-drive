import { normalizePhoneNumber } from "@/lib/utils";

const DEFAULT_DEMO_WHATSAPP = "6281234567890";

export const siteConfig = {
  name: "Surabaya Drive",
  shortDescription: "Rental mobil di Surabaya — lepas kunci atau dengan sopir.",
  description:
    "Surabaya Drive adalah proyek website demo untuk layanan rental mobil di Surabaya. Pilih mobil, isi formulir permintaan, lalu kirim lewat WhatsApp untuk konfirmasi manual.",
  // Domain produksi HARUS diatur eksplisit lewat NEXT_PUBLIC_SITE_URL saat deploy.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  ),
  whatsappDisplay: "0812-3456-7890 (contoh)",
} as const;

/** Nomor WhatsApp ternormalisasi (62…), atau null jika tidak dikonfigurasi. */
export function getWhatsAppNumber(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_DEMO_WHATSAPP;
  return normalizePhoneNumber(raw);
}

/** True jika sedang memakai nomor demo bawaan (belum dikonfigurasi pengguna). */
export function isDemoWhatsAppNumber(): boolean {
  return !process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
}
