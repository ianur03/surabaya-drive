import { z } from "zod";

const emptyToNull = (v: unknown) =>
  v === "" || v === null || v === undefined ? null : v;

export const settingsSchema = z.object({
  business_name: z.string().trim().min(1, "Nama bisnis wajib diisi"),
  whatsapp_number: z.preprocess(
    emptyToNull,
    z.string().trim().nullable(),
  ),
  email: z.preprocess(emptyToNull, z.string().trim().nullable()),
  service_area: z.preprocess(emptyToNull, z.string().trim().nullable()),
  website_url: z.preprocess(emptyToNull, z.string().trim().nullable()),
  site_mode: z.enum(["demo", "live"]),
  footer_text: z.preprocess(emptyToNull, z.string().trim().nullable()),
  default_seo_title: z.preprocess(emptyToNull, z.string().trim().nullable()),
  default_seo_description: z.preprocess(
    emptyToNull,
    z.string().trim().nullable(),
  ),
  og_image_url: z.preprocess(emptyToNull, z.string().trim().nullable()),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
