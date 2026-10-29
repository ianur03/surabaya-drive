import { BookingProvider } from "@/components/booking/BookingProvider";
import { Hero } from "@/components/sections/Hero";
import { FleetSection } from "@/components/sections/FleetSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <BookingProvider>
      <Hero />
      <FleetSection />
      <ServicesSection />
      <HowItWorksSection />
      <BookingSection />
      <AboutSection />
      <FAQSection />
    </BookingProvider>
  );
}
