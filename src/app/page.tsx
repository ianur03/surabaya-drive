import { BookingProvider } from "@/components/booking/BookingProvider";
import { Hero } from "@/components/sections/Hero";
import { FleetSection } from "@/components/sections/FleetSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { getPublicVehicles } from "@/lib/db/vehicles";
import { mapVehicleRow } from "@/lib/mappers";
import { vehicles as fallbackVehicles } from "@/data/vehicles";

import type { Vehicle } from "@/types/vehicle";

export default async function Home() {
  let vehicles: Vehicle[] = fallbackVehicles;

  try {
    const rows = await getPublicVehicles();
    if (rows.length > 0) {
      vehicles = rows.map(mapVehicleRow);
    }
  } catch {
    // Fallback ke data demo bila database tidak tersedia.
  }

  return (
    <BookingProvider>
      <Hero />
      <FleetSection vehicles={vehicles} />
      <ServicesSection />
      <HowItWorksSection />
      <BookingSection vehicles={vehicles} />
      <AboutSection />
      <FAQSection />
    </BookingProvider>
  );
}
