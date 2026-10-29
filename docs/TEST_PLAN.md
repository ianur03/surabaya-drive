# Surabaya Drive — Rencana Pengujian

Status penanda: `PASS` (dijalankan+lulus), `FAIL` (dijalankan+gagal), `NOT RUN` (belum),
`BLOCKED` (terhalang akses/konfigurasi).

## 1. Tooling

- **Vitest** (Fase 6): unit + integrasi aturan bisnis dan data-access layer (dengan DB dev).
- **Manual browser** (QA): alur UI publik & admin, responsive, aksesibilitas dasar.
- **Lint/type/build**: `npm run lint`, `npx tsc --noEmit`, `npm run build` — dijalankan tiap fase.

## 2. Matriks pengujian (dari PRD §14)

### Autentikasi
| Kasus | Target | Status |
|---|---|---|
| Admin login dengan kredensial benar | berhasil | NOT RUN |
| Kredensial salah | ditolak, pesan generik | NOT RUN |
| Tanpa sesi membuka `/admin/*` | redirect ke login | NOT RUN |
| Logout | sesi berakhir, akses terproteksi | NOT RUN |
| Secret (service role) tidak muncul di bundle | tidak ada | NOT RUN |

### Kendaraan
| Kasus | Target | Status |
|---|---|---|
| Admin CRUD kendaraan | berfungsi | NOT RUN |
| Harga negatif / kapasitas ≤ 0 | ditolak | NOT RUN |
| Slug duplikat | ditolak | NOT RUN |
| Kendaraan active tampil di publik | ya | NOT RUN |
| draft/maintenance tidak bisa dipesan | tidak bisa | NOT RUN |

### Booking
| Kasus | Target | Status |
|---|---|---|
| Form valid → record baru + booking_code | `new` | NOT RUN |
| Form invalid | ditolak | NOT RUN |
| end ≤ start | ditolak | NOT RUN |
| Error DB → tidak ada "sukses" palsu | pesan jelas | NOT RUN |
| Admin update status | berfungsi | NOT RUN |
| `admin_notes` tidak terlihat publik | tersembunyi | NOT RUN |
| Dua booking `confirmed` overlap (kendaraan sama) | ditolak | NOT RUN |
| Race condition konfirmasi | ditolak atomik | NOT RUN |
| Kendaraan diarsipkan, booking lama tetap terhubung | ya | NOT RUN |

### CMS / konten
| Kasus | Target | Status |
|---|---|---|
| Perubahan konten/FAQ tampil di publik | ya | NOT RUN |
| Konten draft tidak tampil publik | ya | NOT RUN |
| Input berbahaya (XSS) | dinetralkan | NOT RUN |
| Ubah nomor kontak → link WhatsApp ikut berubah | ya | NOT RUN |

### UI
| Kasus | Target | Status |
|---|---|---|
| Loading/empty/error/success state | tersedia | NOT RUN |
| Layout desktop & mobile | ok | NOT RUN |
| Label form + navigasi keyboard | ok | NOT RUN |
| Tidak ada link/tombol mati | tidak ada | NOT RUN |
| Tidak ada error console kritis | tidak ada | NOT RUN |

### Deployment
| Kasus | Target | Status |
|---|---|---|
| Production build | berhasil | NOT RUN |
| Env vars terdokumentasi | ya | NOT RUN |
| Admin tidak bisa diakses anonim | ya | NOT RUN |
| DB produksi tidak terisi seed demo | ya | NOT RUN |
| Halaman publik lama tetap berfungsi | ya | NOT RUN |

## 3. Perintah yang akan dijalankan

```bash
npm run lint
npx tsc --noEmit
npm run build
npx vitest run        # Fase 6 dst
```

## 4. Baseline saat ini (Fase 0)

- `npx tsc --noEmit` → **PASS**
- `npm run lint` → **PASS**
- `npm run build` → **PASS**
- Test otomatis → **NOT RUN** (belum ada runner)

## 5. Catatan kejujuran

Status pada matriks akan diperbarui hanya setelah benar-benar dijalankan. Kasus yang terhalang
akses Supabase/akun admin akan ditandai `BLOCKED` beserta alasannya, bukan diklaim lulus.
