"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { ServiceType } from "@/types/vehicle";

type BookingContextValue = {
  selectedVehicleId: string | null;
  selectedService: ServiceType | null;
  startBooking: (opts?: { vehicleId?: string; service?: ServiceType }) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const startBooking = useCallback(
    (opts?: { vehicleId?: string; service?: ServiceType }) => {
      if (opts?.vehicleId) setSelectedVehicleId(opts.vehicleId);
      if (opts?.service) setSelectedService(opts.service);
      document
        .getElementById("booking")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [],
  );

  return (
    <BookingContext.Provider
      value={{ selectedVehicleId, selectedService, startBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking harus dipakai di dalam BookingProvider");
  }
  return ctx;
}
