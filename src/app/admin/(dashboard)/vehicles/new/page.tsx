import { createVehicle } from "../actions";
import { VehicleForm } from "@/components/admin/VehicleForm";

export default function NewVehiclePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Tambah Kendaraan</h1>
      <VehicleForm action={createVehicle} submitLabel="Simpan" />
    </div>
  );
}
