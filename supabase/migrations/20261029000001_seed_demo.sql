-- 20261029000001_seed_demo.sql
-- Seed data DEMO (idempotent). HANYA untuk project development/demo.
-- JANGAN dijalankan di production tanpa persetujuan pemilik.
-- Semua data ini contoh, bukan data bisnis aktif.

-- ============ SITE SETTINGS (baris tunggal) ============
insert into public.site_settings (id, business_name, whatsapp_number, email, service_area, website_url, site_mode, footer_text, default_seo_title, default_seo_description)
values (
  1,
  'Surabaya Drive',
  '6281234567890',
  null,
  'Surabaya',
  'https://surabaya-drive.vercel.app',
  'demo',
  'Proyek demo (portofolio) — bukan layanan rental yang beroperasi.',
  'Surabaya Drive — Rental Mobil di Surabaya',
  'Surabaya Drive adalah proyek website demo untuk layanan rental mobil di Surabaya. Pilih mobil, isi formulir permintaan, lalu kirim lewat WhatsApp untuk konfirmasi manual.'
)
on conflict (id) do nothing;

-- ============ VEHICLES (demo) ============
insert into public.vehicles
  (slug, name, brand, model, category, transmission, passenger_capacity, description, color, daily_price_without_driver, status, is_featured, sort_order)
values
  ('toyota-avanza', 'Toyota Avanza', 'Toyota', 'Avanza', 'MPV', 'Manual', 7, 'MPV 7 penumpang yang serbaguna untuk keluarga.', '#0f766e', 350000, 'active', true, 1),
  ('honda-brio', 'Honda Brio', 'Honda', 'Brio', 'City Car', 'Automatic', 5, 'City car ringkas untuk mobilitas harian di dalam kota.', '#2563eb', 300000, 'active', false, 2),
  ('toyota-innova', 'Toyota Innova', 'Toyota', 'Innova', 'MPV', 'Automatic', 7, 'MPV nyaman untuk perjalanan jauh bersama rombongan.', '#7c3aed', 550000, 'active', true, 3),
  ('honda-crv', 'Honda CR-V', 'Honda', 'CR-V', 'SUV', 'Automatic', 5, 'SUV untuk kenyamanan dan ruang kabin lebih lega.', '#b45309', 750000, 'active', false, 4),
  ('daihatsu-xenia', 'Daihatsu Xenia', 'Daihatsu', 'Xenia', 'MPV', 'Manual', 7, 'MPV ekonomis untuk kebutuhan keluarga.', '#0d9488', 325000, 'active', false, 5),
  ('toyota-camry', 'Toyota Camry', 'Toyota', 'Camry', 'Sedan', 'Automatic', 5, 'Sedan eksekutif untuk perjalanan bisnis.', '#334155', 850000, 'active', false, 6)
on conflict (slug) do nothing;

-- ============ SERVICES (demo) ============
insert into public.services (slug, name, short_name, description, benefits, status, sort_order)
values
  (
    'self-drive',
    'Rental Lepas Kunci',
    'Lepas kunci',
    'Anda mengemudikan mobil sendiri. Cocok untuk yang sudah terbiasa menyetir dan ingin bebas mengatur rute serta jadwal perjalanan.',
    '["Anda mengemudikan kendaraan sendiri", "Cocok untuk perjalanan pribadi maupun keluarga", "Syarat, ketentuan, dan deposit dijelaskan langsung saat konfirmasi"]'::jsonb,
    'published',
    1
  ),
  (
    'with-driver',
    'Rental Dengan Sopir',
    'Dengan sopir',
    'Sopir mengemudikan mobil untuk Anda. Cocok untuk acara, perjalanan bisnis, atau yang ingin sampai tujuan tanpa memikirkan rute.',
    '["Sopir yang mengemudikan kendaraan", "Cocok untuk acara dan perjalanan bisnis", "Tarif sopir dan ketentuan dijelaskan langsung saat konfirmasi"]'::jsonb,
    'published',
    2
  )
on conflict (slug) do nothing;

-- ============ FAQ (demo) ============
insert into public.faqs (question, answer, sort_order, is_published)
values
  ('Apa perbedaan rental lepas kunci dan dengan sopir?', 'Lepas kunci berarti Anda mengemudikan mobil sendiri. Dengan sopir berarti sopir yang mengemudikan mobil untuk Anda. Pilih sesuai kebutuhan; syarat dan ketentuan masing-masing dijelaskan saat konfirmasi.', 1, true),
  ('Bagaimana cara mengajukan pemesanan?', 'Pilih mobil, isi formulir permintaan, periksa ringkasan, lalu kirim lewat WhatsApp. Setelah pesan terkirim, tunggu balasan dari pengelola.', 2, true),
  ('Apakah pemesanan langsung terkonfirmasi?', 'Tidak. Website ini tidak menyimpan atau mengonfirmasi pemesanan secara otomatis. Permintaan baru diproses setelah Anda mengirim pesan WhatsApp dan pengelola membalasnya.', 3, true),
  ('Bagaimana cara mengetahui ketersediaan mobil?', 'Website tidak menampilkan ketersediaan secara real-time. Tanyakan lewat WhatsApp dan pengelola akan mengecek lalu membalas secara manual.', 4, true),
  ('Bagaimana cara mengetahui total biaya?', 'Harga di website adalah contoh untuk demo. Total biaya dihitung oleh pengelola berdasarkan pilihan mobil, durasi, dan layanan, lalu diinformasikan lewat WhatsApp.', 5, true),
  ('Apakah lokasi penjemputan dapat ditentukan?', 'Bisa. Isi kolom lokasi penjemputan pada formulir. Titik jemput yang pasti dikonfirmasi saat pengelola membalas pesan Anda.', 6, true),
  ('Bagaimana cara mengubah permintaan pemesanan?', 'Karena website tidak menyimpan permintaan, cukup kirim pesan WhatsApp baru dengan perubahan Anda, atau sebutkan perubahan tersebut saat percakapan dengan pengelola.', 7, true)
on conflict do nothing;
