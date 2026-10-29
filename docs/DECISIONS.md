# Surabaya Drive — Catatan Keputusan (ADR ringkas)

Format: konteks → keputusan → alasan → konsekuensi.

---

## D-001: Supabase sebagai backend

- **Konteks**: repo murni static Next.js, tanpa backend/database/auth.
- **Keputusan**: gunakan Supabase (PostgreSQL + Auth + Storage + RLS) sebagai backend.
- **Alasan**: default PRD; satu layanan mencakup DB, auth, storage, dan keamanan baris (RLS)
  tanpa membangun backend custom; cocok dengan Next.js + Vercel.
- **Konsekuensi**: butuh akun/proyek Supabase; ada batas paket gratis; RLS harus dikonfigurasi benar.

## D-002: Integrasi lewat adapter, bukan menulis ulang UI publik

- **Konteks**: website publik sudah berfungsi dan ter-deploy.
- **Keputusan**: komponen publik baca data lewat `src/lib/db/*` (adapter), dengan fallback ke
  `src/data/*` (label demo) selama DB belum terisi.
- **Alasan**: meminimalkan regresi; perubahan admin langsung tampil tanpa edit kode.
- **Konsekuensi**: masa transisi punya dua sumber data; fallback harus tetap jujur berlabel demo.

## D-003: Role admin lewat tabel `profiles` (allowlist), bukan asumsi "login = admin"

- **Konteks**: MVP satu peran, tapi arsitektur tidak boleh mengunci asumsi semua user = admin.
- **Keputusan**: tabel `profiles` (id = auth.uid, role). Role di-set hanya via `service_role`
  (bukan oleh user sendiri).
- **Alasan**: mencegah eskalasi hak sendiri; siap tambah role `staff`/`owner` nanti.
- **Konsekuensi**: akun admin pertama dibuat manual (Supabase dashboard + SQL allowlist).

## D-004: Booking dibuat lewat RPC server-side, bukan INSERT langsung dari client

- **Konteks**: form publik anonim perlu menyimpan booking tanpa membuka tabel.
- **Keputusan**: fungsi `create_booking_request` (SECURITY DEFINER) yang memvalidasi + generate
  `booking_code`; konfirmasi status memakai RPC atomik untuk cek overlap.
- **Alasan**: validasi & integritas di server/DB; cegah spam & race condition.
- **Konsekuensi**: logika penting hidup di SQL/RPC; perlu test integrasi.

## D-005: Definisi overlap = interval setengah-terbuka `[start_at, end_at)`

- **Konteks**: dua booking bertabrakan jika saling overlap.
- **Keputusan**: `existing.start_at < requested.end_at AND existing.end_at > requested.start_at`
  (batas akhir eksklusif). Diterapkan konsisten di RPC, dan (opsional) exclusion constraint.
- **Alasan**: definisi konsisten; cocok dengan tipe range PostgreSQL.
- **Konsekuensi**: `end_at == start_at` tidak dianggap overlap (valid, `end > start` tetap wajib).

## D-006: Soft-delete/archive kendaraan, bukan delete cascading

- **Konteks**: kendaraan yang pernah dipakai booking harus menjaga riwayat.
- **Keputusan**: status `archived` (soft delete); FK booking ke kendaraan `on delete restrict`.
- **Alasan**: riwayat booking tetap utuh.
- **Konsekuensi**: UI admin menyediakan "arsipkan", bukan hapus permanen.

## D-007: Vitest untuk test unit/integrasi

- **Konteks**: belum ada test runner.
- **Keputusan**: tambah **Vitest** (ringan, cocok TS + Vite ekosistem) untuk aturan bisnis
  (validasi zod, normalisasi nomor, overlap, slug).
- **Alasan**: cepat, konfigurasi minimal; e2e browser (Playwright) ditunda sampai perlu.
- **Konsekuensi**: test UI/admin e2e sebagian manual (didokumentasikan di TEST_PLAN).

## D-008: Tidak menampilkan "pendapatan" di MVP

- **Konteks**: belum ada transaksi/pembayaran.
- **Keputusan**: dashboard tidak menghitung pendapatan dari harga estimasi; metrik hanya dari
  data nyata (jumlah kendaraan aktif, booking per status, dsb).
- **Alasan**: anti data fiktif (aturan PRD).
- **Konsekuensi**: metrik pendapatan ditunda sampai ada tabel transaksi.

## D-009: Mode `demo` default, `live` eksplisit oleh pemilik

- **Konteks**: situs saat ini jujur berlabel demo.
- **Keputusan**: `site_settings.site_mode` default `demo`; label demo tampil selama mode demo.
- **Alasan**: integritas informasi publik; keputusan operasional ada di tangan pemilik.
- **Konsekuensi**: tombol/penjelasan mode live hanya di area pengaturan sensitif.
