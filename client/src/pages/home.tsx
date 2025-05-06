import InteractiveHeroSection from "@/components/interactive-hero-section";
import ServicesSection from "@/components/services-section";
import WhyUsSection from "@/components/why-us-section";
import PortfolioSection from "@/components/portfolio-section";
import TemplatesSection from "@/components/templates-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import ContactSection from "@/components/contact-section";
import { useEffect, useState } from "react";
import { useSectionSettings, SectionSetting } from "@/hooks/use-section-settings";

// Mapowanie komponentów sekcji według klucza
const SectionComponents: Record<string, React.ComponentType> = {
  "services": ServicesSection,
  "why-us": WhyUsSection,
  "case-studies": PortfolioSection,
  "templates": TemplatesSection,
  "blog": BlogSection,
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
  
  // Renderuj sekcje w odpowiedniej kolejności
  const renderSections = () => {
    return sortedSections.map((section: SectionSetting) => {
      const SectionComponent = SectionComponents[section.sectionKey];
      if (!SectionComponent) return null;
      
      return <SectionComponent key={section.sectionKey} />;
    });
  };
  
  return (
    <div className="overflow-x-hidden">
      <InteractiveHeroSection />
      {renderSections()}
      <CtaSection />
      <ContactSection />
    </div>
  );
}
