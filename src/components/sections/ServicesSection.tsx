"use client";

import { services } from "@/data/services";
import { buttonClass } from "@/components/ui/button";
import { useBooking } from "@/components/booking/BookingProvider";

export function ServicesSection() {
  const { startBooking } = useBooking();

  return (
    <section id="layanan" className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dua Cara Menyewa
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Pilih layanan yang paling sesuai. Syarat, ketentuan, dan biaya
            tambahan dijelaskan langsung oleh pengelola saat konfirmasi.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8"
            >
              <h3 className="text-xl font-semibold text-slate-900">
                {service.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
              <ul className="mt-5 space-y-2.5">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <svg
                      viewBox="0 0 20 20"
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal-600"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => startBooking({ service: service.id })}
                className={buttonClass("secondary", "md", "mt-8 w-full sm:w-auto")}
              >
                Pilih Layanan Ini
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
