import { notFound } from "next/navigation";

import { adminGetFaq } from "@/lib/db/faqs";
import { updateFaq } from "../actions";
import { FaqForm } from "@/components/admin/FaqForm";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await adminGetFaq(id);

  if (!faq) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Edit FAQ</h1>
      <FaqForm action={updateFaq.bind(null, id)} initial={faq} />
    </div>
  );
}
