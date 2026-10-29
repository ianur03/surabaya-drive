"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { bookingSchema, type BookingSchemaInput } from "@/lib/booking";
import { createClient } from "@/lib/supabase/client";
import { useBooking } from "@/components/booking/BookingProvider";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingSummary } from "@/components/booking/BookingSummary";

import type {
  BookingFormValues,
  Service,
  ServiceType,
  Vehicle,
} from "@/types/vehicle";

export function BookingSection({
  vehicles,
  services,
  whatsappNumber,
  siteMode,
}: {
  vehicles: Vehicle[];
  services: Service[];
  whatsappNumber: string | null;
  siteMode: "demo" | "live";
}) {
  const { selectedVehicleId, selectedService } = useBooking();
  const [step, setStep] = useState<"form" | "summary">("form");
  const [values, setValues] = useState<BookingFormValues | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const form = useForm<BookingSchemaInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      vehicleId: "",
      service: "",
      startDate: "",
      endDate: "",
      pickupLocation: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (selectedVehicleId) {
      form.setValue("vehicleId", selectedVehicleId);
    }
  }, [selectedVehicleId, form]);

  useEffect(() => {
    if (selectedService) {
      form.setValue("service", selectedService);
    }
  }, [selectedService, form]);

  async function handleValid(data: BookingSchemaInput) {
    setSaveError(null);

    const supabase = createClient();
    const { data: result, error } = await supabase.rpc("create_booking_request", {
      p_customer_name: data.name,
      p_customer_phone: data.phone,
      p_vehicle_id: data.vehicleId,
      p_service_type: data.service === "with-driver" ? "with_driver" : "self_drive",
      p_start_at: `${data.startDate}T00:00:00Z`,
      p_end_at: `${data.endDate}T00:00:00Z`,
      p_pickup_location: data.pickupLocation,
      p_customer_notes: data.notes?.trim() || null,
    });

    if (error) {
      setSaveError("Gagal menyimpan permintaan. Silakan coba lagi.");
      return;
    }

    const booking = Array.isArray(result) ? result[0] : null;

    setValues({
      name: data.name,
      phone: data.phone,
      vehicleId: data.vehicleId,
      service: data.service as ServiceType,
      startDate: data.startDate,
      endDate: data.endDate,
      pickupLocation: data.pickupLocation,
      notes: data.notes,
    });
    setBookingCode(booking?.booking_code ?? null);
    setStep("summary");
  }

  useEffect(() => {
    if (step === "summary") {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  return (
    <section id="booking" ref={sectionRef} className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Formulir Pemesanan
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Lengkapi data di bawah. Permintaan tersimpan sebagai permintaan baru
            dan dikonfirmasi secara manual oleh pengelola lewat WhatsApp.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {step === "form" ? (
            <>
              {saveError && (
                <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </p>
              )}
              <BookingForm
                form={form}
                onSubmit={handleValid}
                vehicles={vehicles}
                services={services}
              />
            </>
          ) : values ? (
            <BookingSummary
              values={values}
              onBack={() => setStep("form")}
              vehicles={vehicles}
              services={services}
              whatsappNumber={whatsappNumber}
              siteMode={siteMode}
              bookingCode={bookingCode}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
