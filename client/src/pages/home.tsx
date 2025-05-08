import InteractiveHeroSection from "@/components/interactive-hero-section";
import ServicesSection from "@/components/services-section";
import WhyUsSection from "@/components/why-us-section";
import PortfolioSection from "@/components/portfolio-section";
import TemplatesSection from "@/components/templates-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import ContactSection from "@/components/contact-section";
import { TrainingsSection } from "@/components/trainings-section";
import { useEffect, useState } from "react";
import { useSectionSettings, SectionSetting } from "@/hooks/use-section-settings";

// Mapowanie komponentów sekcji według klucza
const SectionComponents: Record<string, React.ComponentType> = {
  "services": ServicesSection,
  "why-us": WhyUsSection,
  "case-studies": PortfolioSection,
  "templates": TemplatesSection,
  "blog": BlogSection,
  "trainings": TrainingsSection,
  "shop": () => null, // Placeholder dla sklepu, który pojawi się w przyszłości
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { getSortedVisibleSections } = useSectionSettings();
  
  useEffect(() => {
    // Zapobiegamy problemom z hydracją przy animacjach
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null; // Albo podstawowy loader
  }
  
  // Pobierz posortowane sekcje
  const sortedSections = getSortedVisibleSections();
  
  // Renderuj sekcje w odpowiedniej kolejności z identyfikatorami dla obserwatora
  const renderSections = () => {
    return sortedSections.map((section: SectionSetting) => {
      const SectionComponent = SectionComponents[section.sectionKey];
      if (!SectionComponent) return null;
      
      return (
        <div id={`${section.sectionKey}-section`} key={section.sectionKey}>
          <SectionComponent />
        </div>
      );
    });
  };
  
  return (
    <div className="overflow-x-hidden">
      <div id="hero-section">
        <InteractiveHeroSection />
      </div>
      
      {renderSections()}
      
      <CtaSection />
      
      <div id="contact-section">
        <ContactSection />
      </div>
    </div>
  );
}
