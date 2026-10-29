export type Transmission = "Manual" | "Automatic";

export type VehicleCategory = "MPV" | "City Car" | "Sedan" | "SUV";

export type Vehicle = {
  /** Identifier unik (uuid dari database; untuk fallback demo memakai slug). */
  id: string;
  slug: string;
  name: string;
  category: VehicleCategory;
  /** Warna aksen ilustrasi SVG (bukan foto berlisensi). */
  color: string;
  capacity: number;
  transmission: Transmission;
  /** Harga per hari (lepas kunci). */
  pricePerDay: number;
  /** Harga per hari dengan sopir (null = dikonfirmasi manual). */
  priceWithDriver: number | null;
};

export type ServiceType = "self-drive" | "with-driver";

export type Service = {
  id: ServiceType;
  name: string;
  shortName: string;
  description: string;
  points: string[];
};

export type BookingFormValues = {
  name: string;
  phone: string;
  vehicleId: string;
  service: ServiceType;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  notes?: string;
};
