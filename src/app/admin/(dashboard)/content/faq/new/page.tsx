import { createFaq } from "../actions";
import { FaqForm } from "@/components/admin/FaqForm";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Tambah FAQ</h1>
      <FaqForm action={createFaq} />
    </div>
  );
}
