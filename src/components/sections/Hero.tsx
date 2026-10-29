import { CarIllustration } from "@/components/VehicleIllustration";
import { buttonClass } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="beranda" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
              Rental mobil di Surabaya
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Sewa mobil di Surabaya, lepas kunci atau dengan sopir.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Pilih armada, isi formulir permintaan, lalu kirim lewat WhatsApp.
              Pengelola membalas secara manual dengan informasi ketersediaan dan
              total biaya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#armada" className={buttonClass("primary", "lg")}>
                Lihat Pilihan Mobil
              </a>
              <a href="#booking" className={buttonClass("secondary", "lg")}>
                Pesan Sekarang
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-teal-50 px-6 pb-2 pt-10">
              <CarIllustration
                color="#0f766e"
                label="Ilustrasi mobil sewaan Surabaya Drive"
                className="w-full"
              />
              <div className="absolute left-6 top-6 h-3 w-3 rounded-full bg-amber-400" />
              <div className="absolute right-8 top-10 h-2 w-2 rounded-full bg-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
