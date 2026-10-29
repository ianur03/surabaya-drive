# Surabaya Drive

Website company profile **rental mobil di Surabaya** — proyek demo (portofolio), bukan layanan rental yang benar-benar beroperasi.

Dibangun dengan **Next.js (App Router) + TypeScript + Tailwind CSS**. Alur pemesanan: pilih mobil/layanan → isi formulir → validasi → ringkasan → kirim permintaan lewat WhatsApp (tanpa backend dan tanpa database).

## Fitur

- Header & navigasi responsif (desktop + mobile).
- Hero, daftar armada (data lokal terpusat), layanan lepas kunci & dengan sopir.
- Cara pemesanan, Tentang Kami, FAQ (accordion), Footer.
- Formulir pemesanan dengan validasi (React Hook Form + Zod).
- Ringkasan sebelum membuka WhatsApp, dengan pesan terisi otomatis via `wa.me`.
- SEO: metadata, Open Graph image, `sitemap.xml`, `robots.txt`.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Perintah lain:

```bash
npm run build      # build produksi
npm run lint       # ESLint
npx tsc --noEmit   # type-check
```

## Konfigurasi (environment)

Salin `.env.example` menjadi `.env.local` lalu isi:

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL produksi situs (wajib diisi saat deploy, jangan ditebak). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor WhatsApp tujuan, format internasional `62…` tanpa `+`. |

Tanpa konfigurasi, situs memakai `http://localhost:3000` dan nomor WhatsApp demo.

## Struktur

```
src/
├── app/            # layout, page, robots, sitemap, icon, opengraph-image
├── components/     # layout, sections, fleet, booking, ui
├── data/           # vehicles.ts, services.ts (data demo lokal)
├── lib/            # booking.ts, site.ts, utils.ts
└── types/          # vehicle.ts
```

## Catatan

- Data kendaraan dan harga adalah **contoh untuk demo**, bukan penawaran nyata.
- Membuka WhatsApp tidak berarti pemesanan terkonfirmasi; konfirmasi dilakukan manual oleh pengelola.
- Ilustrasi kendaraan adalah SVG orisinal (bukan foto stok) untuk menghindari masalah lisensi.

## Deployment

Siap di-deploy ke [Vercel](https://vercel.com). Atur `NEXT_PUBLIC_SITE_URL` dan `NEXT_PUBLIC_WHATSAPP_NUMBER` di dashboard proyek sebelum deploy.
