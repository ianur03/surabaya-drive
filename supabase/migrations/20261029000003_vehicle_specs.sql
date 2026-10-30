-- 20261029000003_vehicle_specs.sql
-- FR-02 — Spesifikasi kendaraan: bahan bakar + layanan sopir.
-- Additif (non-destruktif): menambah kolom dengan default, tidak mengubah data existing.

alter table public.vehicles
  add column if not exists fuel_type text not null default 'Bensin'
    check (fuel_type in ('Bensin', 'Diesel', 'Hybrid', 'Listrik'));

alter table public.vehicles
  add column if not exists driver_service_available boolean not null default false;