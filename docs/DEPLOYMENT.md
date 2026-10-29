# Surabaya Drive — Deployment

## 1. Kondisi saat ini

- **Vercel**: production aktif di `https://surabaya-drive.vercel.app` (tim `ianur-rofi`,
  project `surabaya-drive`), terhubung GitHub (`ianur03/surabaya-drive`, branch `main`).
  Auto-deploy: setiap push ke `main`.
- **Env production (Vercel)**: `NEXT_PUBLIC_SITE_URL=https://surabaya-drive.vercel.app` (sudah
  diset). `NEXT_PUBLIC_WHATSAPP_NUMBER` masih default dummy.
- **Supabase**: **belum dibuat** — dibutuhkan sebelum Fase 1.

## 2. Supabase (persiapan)

1. Buat dua proyek: **development** dan **production** (atau mulai dengan dev dulu).
2. Jalankan migration dari `supabase/migrations/*.sql` (urutan bernomor) di dev, uji, baru ke prod.
3. Aktifkan & verifikasi **RLS** di semua tabel yang diekspos.
4. Buat akun admin pertama via **Authentication → Users** (dashboard Supabase), lalu allowlist
   role `admin` lewat SQL (jangan lewat policy yang bisa dieksploitasi).
5. Buat bucket Storage `public-assets` (publik) dengan policy benar; validasi MIME/ukuran.
6. Periksa backup, kuota paket, dan batas proyek gratis.

## 3. Environment variables

| Variabel | Tempat | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel (preview+prod) | URL proyek Supabase (publik) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel (preview+prod) | anon key (publik, aman dibagikan) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | jangan pernah ke client/bundle; hanya route handler |
| `NEXT_PUBLIC_SITE_URL` | Vercel | sudah diset |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Vercel | ganti dummy dengan nomor asli sebelum live |

**Aturan**: `service_role` key TIDAK boleh di-commit, di-`.env.example`, atau di bundle browser.
`.env.example` hanya berisi placeholder kosong.

## 4. Alur deploy

1. Deploy **Preview** dulu (Vercel otomatis untuk PR/branch non-main).
2. Smoke test: halaman publik `/`, halaman admin `/admin` (harus redirect ke login), form booking.
3. Set env production (Supabase URL + anon key) di dashboard Vercel.
4. Migration production **setelah persetujuan pemilik** + backup.
5. Promosikan ke production; verifikasi HTTPS + domain.

## 5. Rollback

- Migration destruktif: selalu review + backup; siapkan strategi forward-fix/rollback.
- Jangan hapus kolom/tabel yang dipakai produksi tanpa rencana migrasi data.
- Rollback deployment: `vercel redeploy <url-deployment-sebelumnya>` atau restore dari Vercel
  deployment history.

## 6. Batasan biaya

Paket gratis Supabase/Vercel bisa berubah atau menghentikan proyek tidak aktif. Bukan jaminan
gratis selamanya; verifikasi limit sebelum launch sungguhan.
