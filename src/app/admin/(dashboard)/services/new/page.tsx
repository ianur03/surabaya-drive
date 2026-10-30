import { createService } from "../actions";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Tambah Layanan</h1>
      <ServiceForm action={createService} />
    </div>
  );
}