export type Transmission = "Manual" | "Automatic";

export type VehicleCategory = "MPV" | "City Car" | "Sedan" | "SUV";

export type Vehicle = {
  id: string;
  name: string;
  category: VehicleCategory;
  /** Warna ilustrasi kendaraan (ilustrasi SVG orisinal, bukan foto berlisensi). */
  color: string;
  capacity: number;
  transmission: Transmission;
  pricePerDay: number;
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
