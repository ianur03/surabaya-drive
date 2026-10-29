"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";
import { faqSchema } from "@/lib/validators/faq";

export type FaqActionState = { error?: string };

function parseFaq(formData: FormData) {
  return faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    sort_order: formData.get("sort_order") ?? "0",
    is_published: formData.get("is_published") === "on",
  });
}

export async function createFaq(
  _prev: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  const parsed = parseFaq(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("faqs").insert(parsed.data, {});

  if (error) {
    return { error: "Gagal menyimpan FAQ." };
  }

  revalidateTag("public-faqs", { expire: 0 });
  redirect("/admin/content/faq");
}

export async function updateFaq(
  id: string,
  _prev: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  const parsed = parseFaq(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("faqs")
    .update(parsed.data, {})
    .eq("id", id);

  if (error) {
    return { error: "Gagal memperbarui FAQ." };
  }

  revalidateTag("public-faqs", { expire: 0 });
  redirect("/admin/content/faq");
}

export async function toggleFaqPublish(id: string, formData: FormData) {
  const current = formData.get("is_published") === "true";
  const supabase = await createServerSupabase();
  await supabase
    .from("faqs")
    .update({ is_published: !current }, {})
    .eq("id", id);
  revalidateTag("public-faqs", { expire: 0 });
}
