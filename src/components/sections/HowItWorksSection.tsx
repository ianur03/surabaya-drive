const steps = [
  {
    title: "Pilih mobil",
    description: "Lihat daftar armada dan pilih kendaraan yang sesuai.",
  },
  {
    title: "Isi formulir",
    description: "Lengkapi nama, tanggal, lokasi, dan jenis layanan.",
  },
  {
    title: "Periksa ringkasan",
    description: "Pastikan data yang terisi sudah benar sebelum lanjut.",
  },
  {
    title: "Kirim lewat WhatsApp",
    description: "Buka WhatsApp dan kirim pesan yang sudah terisi otomatis.",
  },
  {
    title: "Tunggu konfirmasi",
    description:
      "Pengelola membalas secara manual dengan ketersediaan dan total biaya.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="cara-pesan" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Cara Pemesanan
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Pemesanan tidak otomatis terkonfirmasi. Setelah formulir terisi,
            Anda mengirim permintaan lewat WhatsApp dan menunggu balasan manual.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
