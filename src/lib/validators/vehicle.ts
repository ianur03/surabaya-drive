import { z } from "zod";

/**
 * Skema validasi kendaraan (admin). Dipakai di server action (bukan hanya form).
 */
export const vehicleSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
  brand: z.string().trim().min(1, "Brand wajib diisi"),
  model: z.string().trim().default(""),
  category: z.enum(["MPV", "City Car", "Sedan", "SUV"]),
  transmission: z.enum(["Manual", "Automatic"]),
  passenger_capacity: z.coerce
    .number()
    .int("Kapasitas harus bilangan bulat")
    .positive("Kapasitas harus lebih dari 0"),
  color: z.string().trim().min(1, "Warna wajib diisi").default("#0f766e"),
  daily_price_without_driver: z.coerce
    .number()
    .min(0, "Harga tidak boleh negatif"),
  daily_price_with_driver: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : v),
    z.coerce.number().min(0, "Harga tidak boleh negatif").nullable(),
  ),
  description: z.string().trim().default(""),
  status: z.enum(["draft", "active", "maintenance", "archived"]),
  is_featured: z.boolean().default(false),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
