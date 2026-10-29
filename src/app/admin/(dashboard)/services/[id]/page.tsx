import { notFound } from "next/navigation";

import { adminGetService } from "@/lib/db/services";
import { updateService } from "../actions";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await adminGetService(id);

  if (!service) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Edit Layanan — {service.name}
      </h1>
      <ServiceForm action={updateService.bind(null, id)} initial={service} />
    </div>
  );
}
