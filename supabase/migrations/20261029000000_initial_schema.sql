-- 20261029000000_initial_schema.sql
-- Surabaya Drive — skema awal admin dashboard (Supabase / PostgreSQL).
-- Review & uji di environment development sebelum dipakai production.

create extension if not exists pgcrypto;

-- ============ ENUMS ============
create type public.vehicle_status as enum ('draft', 'active', 'maintenance', 'archived');
create type public.service_type as enum ('self_drive', 'with_driver');
create type public.booking_status as enum (
  'new', 'contacted', 'confirmed', 'in_progress', 'completed', 'rejected', 'cancelled'
);

-- ============ PROFILES (allowlist admin) ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'staff' check (role in ('staff', 'admin', 'owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ VEHICLES ============
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null default '',
  model text not null default '',
  category text,
  year smallint,
  transmission text not null default '',
  passenger_capacity integer not null check (passenger_capacity > 0),
  luggage_capacity integer check (luggage_capacity is null or luggage_capacity >= 0),
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  color text,
  image_url text,
  daily_price_without_driver numeric(12,2) check (
    daily_price_without_driver is null or daily_price_without_driver >= 0
  ),
  daily_price_with_driver numeric(12,2) check (
    daily_price_with_driver is null or daily_price_with_driver >= 0
  ),
  status public.vehicle_status not null default 'draft',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_status_sort_idx on public.vehicles(status, sort_order);
create index vehicles_slug_idx on public.vehicles(slug);

-- ============ SERVICES ============
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null default '',
  description text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ BOOKINGS ============
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  service_type public.service_type not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  pickup_location text not null,
  customer_notes text,
  status public.booking_status not null default 'new',
  admin_notes text,
  quoted_total numeric(12,2) check (quoted_total is null or quoted_total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_valid_period check (end_at > start_at)
);

create index bookings_status_created_idx on public.bookings(status, created_at desc);
create index bookings_vehicle_period_idx on public.bookings(vehicle_id, start_at, end_at);
create index bookings_code_idx on public.bookings(booking_code);

-- ============ FAQS ============
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ SITE SETTINGS (single row) ============
create table public.site_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'Surabaya Drive',
  whatsapp_number text,
  email text,
  service_area text,
  logo_url text,
  website_url text,
  site_mode text not null default 'demo' check (site_mode in ('demo', 'live')),
  footer_text text,
  default_seo_title text,
  default_seo_description text,
  og_image_url text,
  updated_at timestamptz not null default now()
);

-- ============ SITE CONTENT ============
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  content_value jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ============ BOOKING STATUS HISTORY ============
create table public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete restrict,
  old_status public.booking_status,
  new_status public.booking_status not null,
  changed_by uuid,
  note text,
  created_at timestamptz not null default now()
);

-- ============ ADMIN ACTIVITY LOG ============
create table public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============ TRIGGER updated_at ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger trg_vehicles_updated before update on public.vehicles
  for each row execute procedure public.set_updated_at();
create trigger trg_services_updated before update on public.services
  for each row execute procedure public.set_updated_at();
create trigger trg_bookings_updated before update on public.bookings
  for each row execute procedure public.set_updated_at();
create trigger trg_faqs_updated before update on public.faqs
  for each row execute procedure public.set_updated_at();
create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute procedure public.set_updated_at();
create trigger trg_site_content_updated before update on public.site_content
  for each row execute procedure public.set_updated_at();

-- ============ RLS HELPERS ============
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'owner')
  );
$$;

-- Auto-profil saat user baru terdaftar (default role 'staff')
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'staff')
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============ AKTIFKAN RLS ============
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.booking_status_history enable row level security;
alter table public.admin_activity_log enable row level security;

-- ============ POLICIES ============

-- profiles: baca sendiri; admin baca semua. Tidak ada insert/update dari client
-- (role hanya diubah lewat service_role / prosedur terdokumentasi).
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin());

-- vehicles: publik baca yang active; admin kelola penuh
create policy "vehicles_select_active_public" on public.vehicles
  for select using (status = 'active');
create policy "vehicles_admin_all" on public.vehicles
  for all using (public.is_admin()) with check (public.is_admin());

-- services: publik baca yang published; admin kelola penuh
create policy "services_select_published_public" on public.services
  for select using (status = 'published');
create policy "services_admin_all" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- faqs: publik baca yang published; admin kelola penuh
create policy "faqs_select_published_public" on public.faqs
  for select using (is_published = true);
create policy "faqs_admin_all" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

-- bookings: anon TIDAK punya akses langsung; admin kelola penuh.
-- Insert publik dilakukan lewat RPC tervalidasi (Fase 5).
create policy "bookings_admin_all" on public.bookings
  for all using (public.is_admin()) with check (public.is_admin());

-- site_settings: baris publik (kontak/SEO), admin boleh update.
create policy "site_settings_select_public" on public.site_settings
  for select using (true);
create policy "site_settings_admin_update" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- site_content: publik baca yang published; admin kelola penuh
create policy "site_content_select_published" on public.site_content
  for select using (is_published = true);
create policy "site_content_admin_all" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

-- booking_status_history: admin only
create policy "bsh_admin_all" on public.booking_status_history
  for all using (public.is_admin()) with check (public.is_admin());

-- admin_activity_log: admin only
create policy "aal_admin_all" on public.admin_activity_log
  for all using (public.is_admin()) with check (public.is_admin());
