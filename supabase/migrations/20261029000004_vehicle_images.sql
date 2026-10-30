-- 20261029000004_vehicle_images.sql
-- FR-01 — Gambar kendaraan: galeri (vehicle_images) + bucket storage publik + policy.

-- ============ GALERI GAMBAR KENDARAAN ============
create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  image_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicle_images_vehicle_idx on public.vehicle_images(vehicle_id);

create trigger trg_vehicle_images_updated before update on public.vehicle_images
  for each row execute procedure public.set_updated_at();

-- ============ RLS GALERI ============
alter table public.vehicle_images enable row level security;

-- Publik boleh baca (URL bucket publik); admin kelola penuh.
create policy "vehicle_images_select_public" on public.vehicle_images
  for select using (true);
create policy "vehicle_images_admin_all" on public.vehicle_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ============ BUCKET STORAGE PUBLIK ============
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

-- Publik boleh baca objek di bucket; admin boleh upload/hapus.
create policy "public_assets_select" on storage.objects
  for select using (bucket_id = 'public-assets');
create policy "public_assets_admin_insert" on storage.objects
  for insert with check (bucket_id = 'public-assets' and public.is_admin());
create policy "public_assets_admin_update" on storage.objects
  for update using (bucket_id = 'public-assets' and public.is_admin());
create policy "public_assets_admin_delete" on storage.objects
  for delete using (bucket_id = 'public-assets' and public.is_admin());