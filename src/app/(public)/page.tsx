import { BookingProvider } from "@/components/booking/BookingProvider";
import { Hero } from "@/components/sections/Hero";
import { FleetSection } from "@/components/sections/FleetSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { getPublicVehicles } from "@/lib/db/vehicles";
import { getPublicServices } from "@/lib/db/services";
import { getPublishedFaqs } from "@/lib/db/faqs";
import { getPublicSiteSettings } from "@/lib/db/settings";
import { mapServiceRow, mapVehicleRow } from "@/lib/mappers";
import { getWhatsAppNumber } from "@/lib/site";
import { vehicles as fallbackVehicles } from "@/data/vehicles";
import { services as fallbackServices } from "@/data/services";
import { faqs as fallbackFaqs, type Faq } from "@/data/faqs";

import type { Service, Vehicle } from "@/types/vehicle";

export default async function Home() {
  let vehicles: Vehicle[] = fallbackVehicles;
  let services: Service[] = fallbackServices;
  let faqs: Faq[] = fallbackFaqs;
  let whatsappNumber = getWhatsAppNumber();
  let siteMode: "demo" | "live" = "demo";

  try {
    const [vRows, sRows, fRows, settings] = await Promise.all([
      getPublicVehicles(),
      getPublicServices(),
      getPublishedFaqs(),
      getPublicSiteSettings(),
    ]);

    if (vRows.length > 0) vehicles = vRows.map(mapVehicleRow);
    if (sRows.length > 0) services = sRows.map(mapServiceRow);
    if (fRows.length > 0) {
      faqs = fRows.map((f) => ({ question: f.question, answer: f.answer }));
    }
    if (settings?.whatsapp_number) whatsappNumber = settings.whatsapp_number;
    if (settings?.site_mode) siteMode = settings.site_mode;
  } catch {
    // Fallback ke data demo bila database tidak tersedia.
  }

  return (
    <BookingProvider>
      <Hero />
      <FleetSection vehicles={vehicles} />
      <ServicesSection services={services} />
      <HowItWorksSection />
      <BookingSection
        vehicles={vehicles}
        services={services}
        whatsappNumber={whatsappNumber}
        siteMode={siteMode}
      />
      <AboutSection />
      <FAQSection faqs={faqs} />
    </BookingProvider>
  );
}
