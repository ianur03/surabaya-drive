// Tipe baris database (sesuai migration Supabase).

export type VehicleStatus = "draft" | "active" | "maintenance" | "archived";
export type ServiceType = "self_drive" | "with_driver";
export type BookingStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "rejected"
  | "cancelled";

export type VehicleRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: string | null;
  year: number | null;
  transmission: string;
  passenger_capacity: number;
  luggage_capacity: number | null;
  description: string;
  features: string[];
  color: string | null;
  image_url: string | null;
  daily_price_without_driver: number | null;
  daily_price_with_driver: number | null;
  status: VehicleStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  description: string;
  benefits: string[];
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettingsRow = {
  id: number;
  business_name: string;
  whatsapp_number: string | null;
  email: string | null;
  service_area: string | null;
  logo_url: string | null;
  website_url: string | null;
  site_mode: "demo" | "live";
  footer_text: string | null;
  default_seo_title: string | null;
  default_seo_description: string | null;
  og_image_url: string | null;
  updated_at: string;
};
