"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validators/settings";

export type SettingsActionState = { error?: string };

export async function updateSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = settingsSchema.safeParse({
    business_name: formData.get("business_name"),
    whatsapp_number: formData.get("whatsapp_number") ?? "",
    email: formData.get("email") ?? "",
    service_area: formData.get("service_area") ?? "",
    website_url: formData.get("website_url") ?? "",
    site_mode: formData.get("site_mode"),
    footer_text: formData.get("footer_text") ?? "",
    default_seo_title: formData.get("default_seo_title") ?? "",
    default_seo_description: formData.get("default_seo_description") ?? "",
    og_image_url: formData.get("og_image_url") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("site_settings")
    .update(parsed.data, {})
    .eq("id", 1);

  if (error) {
    return { error: "Gagal menyimpan pengaturan." };
  }

  revalidateTag("public-settings", { expire: 0 });
  redirect("/admin/settings/business");
}
