import { notFound } from "next/navigation";

import { adminGetVehicle, adminListVehicleImages } from "@/lib/db/vehicles";
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

  const images = await adminListVehicleImages(id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
        Edit Kendaraan — {vehicle.name}
      </h1>
      <VehicleForm
        action={updateVehicle.bind(null, id)}
        initial={vehicle}
        existingImages={images}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
