"use client";

import { CarIllustration } from "@/components/VehicleIllustration";
import { buttonClass } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";
import { formatRupiah } from "@/lib/utils";

import type { Vehicle } from "@/types/vehicle";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { startBooking } = useBooking();

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            {vehicle.category}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {vehicle.transmission}
          </span>
        </div>
        <CarIllustration
          color={vehicle.color}
          label={`Ilustrasi ${vehicle.name}`}
          className="mt-4 w-full"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-slate-900">{vehicle.name}</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>Kapasitas {vehicle.capacity} penumpang</li>
          <li>Transmisi {vehicle.transmission}</li>
          <li>Bahan bakar {vehicle.fuelType}</li>
          {vehicle.driverServiceAvailable && <li>Sopir tersedia</li>}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-xs text-slate-500">Contoh harga</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatRupiah(vehicle.pricePerDay)}
              <span className="text-sm font-normal text-slate-500">/hari</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => startBooking({ vehicleId: vehicle.id })}
            className={buttonClass("primary")}
          >
            Pilih Mobil
          </button>
        </div>
      </div>
    </article>
  );
}
