import { VehicleCard } from "@/components/fleet/VehicleCard";

import type { Vehicle } from "@/types/vehicle";

export function FleetSection({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section id="armada" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Pilihan Armada
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Bandingkan mobil yang tersedia sesuai kebutuhan perjalanan Anda.
            Harga di bawah adalah contoh untuk keperluan demo, bukan penawaran
            bisnis yang sedang berjalan.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
