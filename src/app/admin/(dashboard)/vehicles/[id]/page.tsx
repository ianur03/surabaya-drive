import { notFound } from "next/navigation";

import { adminGetVehicle } from "@/lib/db/vehicles";
import { updateVehicle } from "../actions";
import { VehicleForm } from "@/components/admin/VehicleForm";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await adminGetVehicle(id);

  if (!vehicle) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Edit Kendaraan — {vehicle.name}
      </h1>
      <VehicleForm
        action={updateVehicle.bind(null, id)}
        initial={vehicle}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
