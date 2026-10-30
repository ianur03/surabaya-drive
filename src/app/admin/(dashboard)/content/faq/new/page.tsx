import { createFaq } from "../actions";
import { FaqForm } from "@/components/admin/FaqForm";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Tambah FAQ</h1>
      <FaqForm action={createFaq} />
    </div>
  );
}
