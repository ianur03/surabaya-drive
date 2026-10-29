"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { bookingSchema, type BookingSchemaInput } from "@/lib/booking";
import { useBooking } from "@/components/booking/BookingProvider";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingSummary } from "@/components/booking/BookingSummary";

import type { BookingFormValues, ServiceType } from "@/types/vehicle";

export function BookingSection() {
  const { selectedVehicleId, selectedService } = useBooking();
  const [step, setStep] = useState<"form" | "summary">("form");
  const [values, setValues] = useState<BookingFormValues | null>(null);
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

  function handleValid(data: BookingSchemaInput) {
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
            Lengkapi data di bawah. Permintaan dikirim lewat WhatsApp dan
            dikonfirmasi secara manual oleh pengelola.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {step === "form" ? (
            <BookingForm form={form} onSubmit={handleValid} />
          ) : values ? (
            <BookingSummary values={values} onBack={() => setStep("form")} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
