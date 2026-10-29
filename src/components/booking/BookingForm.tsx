"use client";

import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingSchemaInput } from "@/lib/booking";
import type { Service, Vehicle } from "@/types/vehicle";

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";
const errorInputClass =
  "border-red-500 focus:border-red-500 focus:ring-red-500/20";

type Props = {
  form: UseFormReturn<BookingSchemaInput>;
  onSubmit: (data: BookingSchemaInput) => void;
  vehicles: Vehicle[];
  services: Service[];
};

function Field({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-800">
        {label}{" "}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function BookingForm({ form, onSubmit, vehicles, services }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const serviceValue = watch("service");
  const startDate = watch("startDate");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama" htmlFor="name" error={errors.name?.message} required>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Nama lengkap"
            className={cn(inputClass, errors.name && errorInputClass)}
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field
          label="Nomor WhatsApp"
          htmlFor="phone"
          error={errors.phone?.message}
          required
        >
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="08xx xxxx xxxx"
            className={cn(inputClass, errors.phone && errorInputClass)}
            aria-required="true"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
        </Field>

        <Field
          label="Mobil"
          htmlFor="vehicleId"
          error={errors.vehicleId?.message}
          required
        >
          <select
            id="vehicleId"
            className={cn(inputClass, errors.vehicleId && errorInputClass)}
            aria-required="true"
            aria-invalid={errors.vehicleId ? true : undefined}
            aria-describedby={errors.vehicleId ? "vehicleId-error" : undefined}
            {...register("vehicleId")}
          >
            <option value="">Pilih mobil</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Tanggal mulai"
          htmlFor="startDate"
          error={errors.startDate?.message}
          required
        >
          <input
            id="startDate"
            type="date"
            className={cn(inputClass, errors.startDate && errorInputClass)}
            aria-required="true"
            aria-invalid={errors.startDate ? true : undefined}
            aria-describedby={errors.startDate ? "startDate-error" : undefined}
            {...register("startDate")}
          />
        </Field>

        <Field
          label="Tanggal selesai"
          htmlFor="endDate"
          error={errors.endDate?.message}
          required
        >
          <input
            id="endDate"
            type="date"
            min={startDate || undefined}
            className={cn(inputClass, errors.endDate && errorInputClass)}
            aria-required="true"
            aria-invalid={errors.endDate ? true : undefined}
            aria-describedby={errors.endDate ? "endDate-error" : undefined}
            {...register("endDate")}
          />
        </Field>

        <Field
          label="Lokasi penjemputan"
          htmlFor="pickupLocation"
          error={errors.pickupLocation?.message}
          required
        >
          <input
            id="pickupLocation"
            type="text"
            placeholder="Contoh: Stasiun Gubeng, Surabaya"
            className={cn(inputClass, errors.pickupLocation && errorInputClass)}
            aria-required="true"
            aria-invalid={errors.pickupLocation ? true : undefined}
            aria-describedby={
              errors.pickupLocation ? "pickupLocation-error" : undefined
            }
            {...register("pickupLocation")}
          />
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium text-slate-800">
            Jenis layanan{" "}
            <span className="text-red-600" aria-hidden="true">
              *
            </span>
          </legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                  serviceValue === service.id
                    ? "border-teal-600 bg-teal-50"
                    : "border-slate-300 hover:border-slate-400",
                )}
              >
                <input
                  type="radio"
                  value={service.id}
                  className="mt-0.5 h-4 w-4 accent-teal-700"
                  aria-describedby={errors.service ? "service-error" : undefined}
                  {...register("service")}
                />
                <span>
                  <span className="block text-sm font-medium text-slate-900">
                    {service.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">
                    {service.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {errors.service && (
            <p id="service-error" className="mt-2 text-sm text-red-600">
              {errors.service.message}
            </p>
          )}
        </fieldset>

        <Field label="Catatan tambahan (opsional)" htmlFor="notes" className="sm:col-span-2">
          <textarea
            id="notes"
            rows={3}
            placeholder="Info tambahan, mis. jam penjemputan"
            className={inputClass}
            {...register("notes")}
          />
        </Field>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClass("primary", "lg", "w-full sm:w-auto")}
        >
          {isSubmitting ? "Menyimpan…" : "Lanjutkan"}
        </button>
      </div>
    </form>
  );
}
