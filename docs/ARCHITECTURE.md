# Surabaya Drive — Arsitektur

## 1. Arsitektur saat ini (sebelum admin)

```
Browser ──> Vercel (Next.js 16 App Router, static) ──> HTML
                    │
                    └── data hard-coded (src/data/*.ts)
                        form booking = client-only, buka wa.me (TIDAK menyimpan)
```

Tidak ada backend, database, auth, atau API route. Semua halaman prerendered statis.

## 2. Arsitektur target

```
Browser
  ├── Halaman publik (/)  ──> Server Components ──> Supabase (anon key, RLS: baca data terpublikasi)
  ├── Form booking publik ──> RPC create_booking_request (SECURITY DEFINER, rate-limit) ──> tabel bookings
  └── Dashboard /admin/*  ──> Supabase Auth session (cookie) ──> RLS: admin CRUD
                                    │
                              Supabase (PostgreSQL + Auth + Storage + RLS)
```

Komponen utama:

- **Supabase** = PostgreSQL + Auth (admin) + Storage (foto kendaraan/logo) + RLS.
- **Supabase JS client** (`@supabase/supabase-js`) di client untuk operasi yang aman dengan RLS.
- **`@supabase/ssr` `createServerClient`** di Server Components / Route Handlers untuk baca-data
  publik dan pengecekan sesi admin (cookie-based).
- **RPC/route handler server-side** untuk operasi sensitif: konfirmasi booking (cek konflik
  atomik), operasi yang butuh `service_role` (jarang).

## 3. Lapisan data (data-access layer)

Satu modul per domain di `src/lib/db/`:

```
src/lib/db/
├── client.ts            # createBrowserClient (client) + createServerClient (server)
├── vehicles.ts          # getPublicVehicles, adminListVehicles, adminCreateVehicle, ...
├── services.ts
├── faqs.ts
├── content.ts           # site_content + site_settings publik
├── bookings.ts          # createBookingRequest, adminListBookings, adminUpdateBookingStatus, ...
└── admin.ts             # profil/role, dashboard metrics, activity log
```

Prinsip: UI tidak menyentuh Supabase langsung; semua lewat lapisan ini. Validasi di batas
server/database, bukan hanya form.

## 4. Autentikasi & otorisasi

- **Auth**: Supabase Auth (email/password), sesi disimpan di cookie oleh `@supabase/ssr`.
- **Role**: tabel `profiles` (`id uuid references auth.users`, `role text`). MVP = satu role
  `admin`, tapi skema tidak mengikat seluruh sistem ke "semua user = admin".
- **Allowlist aman**: pengguna **tidak bisa** mengeset role dirinya sendiri — insert/update role
  hanya lewat `service_role`/prosedur terdokumentasi, bukan lewat RLS policy yang bisa dieksploitasi.
- **Proteksi**: layout admin mengecek sesi (server) → redirect ke `/admin/login`. Operasi server
  juga mengecek role, bukan hanya UI.
- Pesan error login generik (tidak membocorkan apakah email terdaftar). Tanpa pendaftaran publik.

## 5. RLS (garis besar)

- Anonim boleh `SELECT`: `vehicles` berstatus `active`, `services` `published`, `faqs`
  `is_published`, `site_content`/`site_settings` yang aman-publik.
- Anonim boleh `INSERT` booking hanya lewat RPC tervalidasi (bukan insert langsung ke tabel).
- Anonim **tidak boleh** baca booking orang lain, `admin_notes`, riwayat status, activity log.
- Admin (role `admin` di `profiles`) boleh CRUD domain admin.
- Tidak ada policy `using (true)` pada tabel sensitif.

## 6. Alur booking (target)

```
1. Form publik divalidasi (client + server).
2. RPC create_booking_request: cek kendaraan active, tanggal valid, generate booking_code unik,
   insert status 'new'. Return booking_code.
3. UI tampil sukses + kode; tombol WhatsApp = langkah lanjutan (tidak mengubah status).
4. Admin melihat daftar; update status/quote/catatan (ditulis ke booking_status_history + log).
5. Status -> 'confirmed' memicu cek overlap atomik:
   overlap jika existing.start_at < requested.end_at AND existing.end_at > requested.start_at
   terhadap booking 'confirmed'/'in_progress' kendaraan yang sama; tolak bila konflik.
```

## 7. Integrasi publik (bertahap)

1. Adapter baca data dari DB, fallback ke `src/data/*` (label demo) selama DB kosong.
2. Section publik (Fleet, Services, FAQ, kontak, SEO) baca lewat adapter.
3. Hapus data hard-coded hanya setelah pengganti teruji dan data DB siap.

## 8. Penyimpanan gambar

- Bucket Supabase Storage `public-assets` untuk foto yang memang publik.
- Validasi MIME + ukuran; nama file di-normalisasi (UUID); tidak menyimpan base64 besar.
- Fallback: ilustrasi SVG lokal yang sudah ada tetap jadi default bila `image_url` kosong.
