export type Faq = { question: string; answer: string };

/** FAQ FALLBACK (demo) — dipakai bila database belum tersedia/terisi. */
export const faqs: Faq[] = [
  {
    question: "Apa perbedaan rental lepas kunci dan dengan sopir?",
    answer:
      "Lepas kunci berarti Anda mengemudikan mobil sendiri. Dengan sopir berarti sopir yang mengemudikan mobil untuk Anda. Pilih sesuai kebutuhan; syarat dan ketentuan masing-masing dijelaskan saat konfirmasi.",
  },
  {
    question: "Bagaimana cara mengajukan pemesanan?",
    answer:
      "Pilih mobil, isi formulir permintaan, periksa ringkasan, lalu kirim lewat WhatsApp. Setelah pesan terkirim, tunggu balasan dari pengelola.",
  },
  {
    question: "Apakah pemesanan langsung terkonfirmasi?",
    answer:
      "Tidak. Website ini tidak menyimpan atau mengonfirmasi pemesanan secara otomatis. Permintaan baru diproses setelah Anda mengirim pesan WhatsApp dan pengelola membalasnya.",
  },
  {
    question: "Bagaimana cara mengetahui ketersediaan mobil?",
    answer:
      "Website tidak menampilkan ketersediaan secara real-time. Tanyakan lewat WhatsApp dan pengelola akan mengecek lalu membalas secara manual.",
  },
  {
    question: "Bagaimana cara mengetahui total biaya?",
    answer:
      "Harga di website adalah contoh untuk demo. Total biaya dihitung oleh pengelola berdasarkan pilihan mobil, durasi, dan layanan, lalu diinformasikan lewat WhatsApp.",
  },
  {
    question: "Apakah lokasi penjemputan dapat ditentukan?",
    answer:
      "Bisa. Isi kolom lokasi penjemputan pada formulir. Titik jemput yang pasti dikonfirmasi saat pengelola membalas pesan Anda.",
  },
  {
    question: "Bagaimana cara mengubah permintaan pemesanan?",
    answer:
      "Karena website tidak menyimpan permintaan, cukup kirim pesan WhatsApp baru dengan perubahan Anda, atau sebutkan perubahan tersebut saat percakapan dengan pengelola.",
  },
];
