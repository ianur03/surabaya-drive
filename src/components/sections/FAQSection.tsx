const faqs = [
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

export function FAQSection() {
  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left text-base font-medium text-slate-900">
                {faq.question}
                <svg
                  viewBox="0 0 20 20"
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <p className="px-6 pb-5 text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
