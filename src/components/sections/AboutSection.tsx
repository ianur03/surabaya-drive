export function AboutSection() {
  return (
    <section id="tentang" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Tentang Surabaya Drive
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Surabaya Drive adalah website company profile untuk layanan rental
              mobil di Surabaya. Website ini memperkenalkan dua pilihan layanan —
              lepas kunci dan dengan sopir — serta daftar armada untuk membantu
              pengunjung memilih kendaraan.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Seluruh permintaan pemesanan dikirim lewat WhatsApp dan diproses
              secara manual oleh pengelola, mulai dari pengecekan ketersediaan
              hingga perhitungan total biaya.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-sm font-semibold text-amber-900">
                Proyek demo (portofolio)
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-900/80">
                Website ini adalah contoh, bukan layanan rental yang
                benar-benar beroperasi. Data kendaraan dan harga yang
                ditampilkan adalah data contoh.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold text-slate-900">
                Wilayah layanan
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Surabaya dan sekitarnya. Lokasi penjemputan dapat ditentukan
                dan dikonfirmasi saat pemesanan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
