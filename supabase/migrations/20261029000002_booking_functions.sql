-- 20261029000002_booking_functions.sql
-- RPC untuk membuat booking request (publik) dan konfirmasi (admin, atomik).

-- Generate booking code unik (server-side, tidak mudah ditebak).
create or replace function public.generate_booking_code()
returns text language plpgsql as $$
declare
  code text;
begin
  loop
    code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (select 1 from public.bookings where booking_code = code);
  end loop;
  return code;
end $$;

-- RPC publik: buat booking request (status 'new'). Validasi di sisi server.
create or replace function public.create_booking_request(
  p_customer_name text,
  p_customer_phone text,
  p_vehicle_id uuid,
  p_service_type public.service_type,
  p_start_at timestamptz,
  p_end_at timestamptz,
  p_pickup_location text,
  p_customer_notes text default null
) returns table (booking_id uuid, booking_code text)
language plpgsql security definer set search_path = public as $$
declare
  v_status public.vehicle_status;
  v_id uuid;
  v_code text;
begin
  -- Kendaraan harus ada dan aktif.
  select status into v_status from public.vehicles where id = p_vehicle_id;
  if v_status is null or v_status <> 'active' then
    raise exception 'Kendaraan tidak tersedia' using errcode = '22023';
  end if;

  -- Periode valid.
  if p_start_at is null or p_end_at is null or p_start_at >= p_end_at then
    raise exception 'Periode tidak valid' using errcode = '22023';
  end if;

  -- Batas panjang field (anti abuse).
  if coalesce(length(p_customer_name), 0) = 0 or length(p_customer_name) > 100
     or coalesce(length(p_customer_phone), 0) = 0 or length(p_customer_phone) > 30
     or length(p_pickup_location) > 200
     or length(coalesce(p_customer_notes, '')) > 1000 then
    raise exception 'Input tidak valid' using errcode = '22023';
  end if;

  v_code := public.generate_booking_code();

  insert into public.bookings
    (booking_code, customer_name, customer_phone, vehicle_id, service_type,
     start_at, end_at, pickup_location, customer_notes, status)
  values
    (v_code, p_customer_name, p_customer_phone, p_vehicle_id, p_service_type,
     p_start_at, p_end_at, p_pickup_location, p_customer_notes, 'new')
  returning id into v_id;

  return query select v_id, v_code;
end $$;

-- RPC admin: konfirmasi booking dengan pemeriksaan overlap ATOMIK.
-- Menolak bila ada booking lain berstatus confirmed/in_progress untuk
-- kendaraan yang sama dengan rentang waktu bertabrakan.
create or replace function public.confirm_booking(
  p_booking_id uuid
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_vehicle_id uuid;
  v_start_at timestamptz;
  v_end_at timestamptz;
  v_conflict boolean;
begin
  if not public.is_admin() then
    raise exception 'Tidak diizinkan' using errcode = '42501';
  end if;

  select vehicle_id, start_at, end_at into v_vehicle_id, v_start_at, v_end_at
  from public.bookings where id = p_booking_id for update;

  if v_vehicle_id is null then
    raise exception 'Booking tidak ditemukan' using errcode = '02000';
  end if;

  -- overlap jika existing.start_at < requested.end_at AND existing.end_at > requested.start_at
  select exists (
    select 1 from public.bookings b
    where b.vehicle_id = v_vehicle_id
      and b.status in ('confirmed', 'in_progress')
      and b.id <> p_booking_id
      and b.start_at < v_end_at
      and b.end_at > v_start_at
  ) into v_conflict;

  if v_conflict then
    raise exception 'Konflik: kendaraan sudah dipesan pada rentang tersebut' using errcode = '22023';
  end if;

  update public.bookings set status = 'confirmed', updated_at = now()
  where id = p_booking_id;
end $$;
