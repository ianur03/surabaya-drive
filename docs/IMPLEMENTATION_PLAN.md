# Surabaya Drive — Rencana Implementasi (Fase 0)

Dokumen ini adalah hasil **audit repository aktual** (bukan tebakan dari website publik).
Dibuat sebelum menulis kode apa pun.

## 1. Ringkasan audit

| Aspek | Kondisi aktual |
|---|---|
| Framework | Next.js **16.4.3** (App Router, Turbopack) |
| Bahasa | TypeScript **5.x** (strict: `true`) |
| Styling | Tailwind CSS **v4** (CSS-first, `@theme`) |
| Package manager | npm (ada `package-lock.json`) |
| Form | react-hook-form 7 + zod 4 (`@hookform/resolvers` 6) |
| Lint | ESLint 9 (`eslint-config-next`) |
| Test runner | **belum ada** (tidak ada jest/vitest/playwright) |
| Backend/API | **tidak ada** (0 route handler) |
| Database | **tidak ada** |
| Auth | **tidak ada** |
| Penyimpanan gambar | **tidak ada** — ilustrasi SVG inline (komponen React) |
| Deployment | Vercel (production: `https://surabaya-drive.vercel.app`), terhubung GitHub |
| Git | branch `main`, remote `github.com/ianur03/surabaya-drive.git` |

### Struktur proyek (intisari)

```
src/
├── app/            # layout.tsx, page.tsx, robots.ts, sitemap.ts, icon.svg, opengraph-image.tsx
├── components/
│   ├── booking/    # BookingForm, BookingSummary, BookingProvider (state pemesanan)
│   ├── fleet/      # VehicleCard
│   ├── layout/     # Header, Footer, CopyrightYear
│   ├── sections/   # Hero, Fleet, Services, HowItWorks, Booking, About, FAQ
│   └── ui/         # button.ts (buttonClass)
├── data/           # vehicles.ts (6 mobil hard-coded), services.ts (2 layanan hard-coded)
├── lib/            # booking.ts (skema zod + builder pesan WA), site.ts, utils.ts
└── types/          # vehicle.ts
```

### Sumber data saat ini

- **Katalog kendaraan**: `src/data/vehicles.ts` — array `Vehicle[]` hard-coded (6 mobil:
  Avanza, Brio, Innova, CR-V, Xenia, Camry). Field: `id, name, category, color, capacity,
  transmission, pricePerDay`.
- **Layanan**: `src/data/services.ts` — array `Service[]` hard-coded (lepas kunci, dengan sopir).
- **Kontak/WhatsApp**: `src/lib/site.ts` — dari env `NEXT_PUBLIC_WHATSAPP_NUMBER`, fallback dummy.
- **Konten statis** (hero, tentang, FAQ, cara pesan): hard-coded langsung di komponen section.
- **Form booking**: `src/components/booking/*` — validasi client (zod) → ringkasan → buka `wa.me`.
  **Tidak menyimpan apa pun ke database.** Tidak ada booking code, tidak ada status.

### Kondisi awal (baseline)

- `npx tsc --noEmit` → PASS
- `npm run lint` → PASS
- `npm run build` → PASS (semua route static)
- Test otomatis → **belum ada** (NOT RUN / belum dikonfigurasi)

### Temuan pembersihan (non-blok, dikerjakan di Fase 1)

- `src/app/favicon.ico` adalah logo Next.js sisa scaffold (sudah ada `icon.svg` sebagai pengganti) — hapus.
- `tsconfig.tsbuildinfo` ikut ter-commit — tambahkan ke `.gitignore`.

## 2. Keputusan arsitektur (ringkas)

Lihat `ARCHITECTURE.md` dan `DECISIONS.md` untuk detail. Intinya:

- **Supabase** sebagai backend (PostgreSQL + Auth + Storage + RLS) — sesuai default PRD, karena
  repo ini murni statis tanpa backend.
- **Tanpa mengubah** framework, struktur publik, atau desain website yang sudah ada.
- Katalog publik beralih dari hard-coded ke database secara **bertahap** (adapter dulu,
  fallback konten lama sampai data DB tersedia).

## 3. Rencana fase (1 fase = 1 gerbang selesai)

### Fase 0 — Audit & rencana (fase ini)
Output: `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `TEST_PLAN.md`,
`DEPLOYMENT.md`. **Tidak ada perubahan kode.**

### Fase 1 — Fondasi backend/database (Supabase)
- Tambah `@supabase/supabase-js` + `@supabase/ssr`.
- Migration SQL bernomor: schema `vehicles, services, bookings, faqs, site_settings,
  site_content, booking_status_history, admin_activity_log, profiles`.
- Aktifkan **RLS** di semua tabel; policy anon hanya-baca publik, admin CRUD via allowlist.
- Data-access layer (`src/lib/db/*`): `getPublicVehicles`, `getPublicServices`,
  `getPublishedFaqs`, `getPublicSiteSettings`, dll.
- Seed demo idempotent (hanya development).
- Perbarui `.env.example` (placeholder Supabase, tanpa secret).
- Pembersihan: hapus `favicon.ico` sisa, abaikan `tsconfig.tsbuildinfo`.
- **Gate**: tidak ada tabel sensitif terbuka ke anonim; migration lolos di env dev.

### Fase 2 — Autentikasi & layout admin
- Login/logout (Supabase Auth), proteksi rute + operasi server.
- Route group `src/app/admin/*`, layout sidebar responsif, header, breadcrumb.
- Halaman dashboard dengan metrik **nyata** (belum pendapatan).
- **Gate**: anonim ditolak; login/logout teruji.

### Fase 3 — Manajemen kendaraan
- CRUD + validasi + upload gambar (Supabase Storage).
- Hubungkan katalog publik ke database (status `active` saja).
- Uji regresi halaman publik.
- **Gate**: perubahan admin tampil di publik tanpa edit kode.

### Fase 4 — CMS & pengaturan
- Layanan, FAQ, konten, kontak, SEO, mode demo/live.
- Validasi publikasi + sanitasi (anti-XSS).
- **Gate**: konten berubah aman, tidak ada XSS.

### Fase 5 — Booking
- Form publik menyimpan ke DB (RPC server-side + rate limit), booking code unik.
- Dashboard daftar/detail booking, status, admin notes, quote.
- Konflik tanggal **atomik** (RPC/transaksi) untuk `confirmed`/`in_progress`.
- Status history + activity log.
- **Gate**: booking gagal tidak dilaporkan sukses; double booking teruji.

### Fase 6 — QA & hardening
- Vitest (unit/integrasi aturan bisnis: validasi, overlap, slug unik).
- Aksesibilitas dasar, responsive, security review (RLS, secret, route, upload, log).
- **Gate**: test kritis lulus atau batasan terdokumentasi.

### Fase 7 — Deployment
- Deploy preview → smoke test → env production → migration production (setelah persetujuan).
- Verifikasi + dokumentasi rollback.
- **Gate**: env, policy, dan auth diverifikasi sebelum dinyatakan siap.

## 4. File yang akan diubah (perkiraan, akan disempurnakan tiap fase)

- `package.json` — tambah dependensi Supabase + Vitest (Fase 1/6).
- `src/lib/` — tambah `db/` (client, server client, data-access), `validators/`.
- `src/app/` — tambah `admin/` route group; ubah `layout.tsx`/`page.tsx` untuk baca data DB.
- `src/components/` — ubah section publik agar baca data dari layer akses; tambah komponen admin.
- `src/data/` — dijaga sebagai seed/fallback demo, bukan sumber kebenaran produksi.
- `supabase/migrations/` — file SQL bernomor.
- `docs/` — dokumen ini + pembaruan per fase.
- `.env.example` — placeholder Supabase.

## 5. Strategi menjaga website publik

1. Integrasi dilakukan lewat **adapter** (satu fungsi per domain), bukan menulis ulang komponen.
2. Setiap perubahan publik diuji regresi: `tsc`, `lint`, `build`, plus cek render halaman `/`.
3. Data hard-coded dipertahankan sebagai fallback demo sampai DB terisi, **dengan label demo
   yang tetap jujur** (tidak menyamar sebagai data bisnis aktif).
4. Commit kecil per fase; tidak ada refactor besar sekaligus.

## 6. Risiko & asumsi

| Risiko | Mitigasi |
|---|---|
| Supabase butuh akun/proyek yang belum ada | Fase 1 butuh `NEXT_PUBLIC_SUPABASE_URL` + anon key (bukan secret) dari pemilik; henti & minta manual bila perlu |
| RLS salah konfigurasi → data bocor | Policy least-privilege + uji akses anon di Fase 1 |
| Race condition double booking | RPC atomik/transaksi di DB, bukan cek frontend |
| Paket gratis Supabase/Vercel ada limit | Dicatat di `DEPLOYMENT.md`; bukan jaminan gratis selamanya |
| Mode demo vs live | `site_mode` default `demo`; ganti ke `live` hanya oleh pemilik |

## 7. Ketergantungan eksternal (butuh pemilik)

- **Supabase**: buat proyek (development), berikan `Project URL` + `anon key` (aman dibagikan;
  `anon key` memang dirancang publik). `service_role key` **tidak boleh** dibagikan/di-commit.
- **Akun admin pertama**: dibuat lewat dashboard Supabase Auth, lalu di-allowlist lewat SQL.
