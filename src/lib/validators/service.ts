import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi")
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
  short_name: z.string().trim().min(1, "Nama singkat wajib diisi"),
  description: z.string().trim().min(1, "Deskripsi wajib diisi"),
  benefits: z.array(z.string().trim().min(1)).min(1, "Minimal satu poin manfaat"),
  status: z.enum(["draft", "published", "archived"]),
  sort_order: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

/** Petakan toggle aktif/nonaktif ke status simpan: aktif = published, nonaktif = draft. */
export function serviceStatusFromActive(
  active: boolean,
): "published" | "draft" {
  return active ? "published" : "draft";
}
