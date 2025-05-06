import InteractiveHeroSection from "@/components/interactive-hero-section";
import ServicesSection from "@/components/services-section";
import WhyUsSection from "@/components/why-us-section";
import PortfolioSection from "@/components/portfolio-section";
import TemplatesSection from "@/components/templates-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import ContactSection from "@/components/contact-section";
import { useEffect, useState } from "react";
import { useSectionSettings } from "@/hooks/use-section-settings";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isVisible } = useSectionSettings();
  
  useEffect(() => {
    // Zapobiegamy problemom z hydracją przy animacjach
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null; // Albo podstawowy loader
  }
  
  return (
    <div className="overflow-x-hidden">
      <InteractiveHeroSection />
      {isVisible("services") && <ServicesSection />}
      {isVisible("why-us") && <WhyUsSection />}
      {isVisible("case-studies") && <PortfolioSection />}
      {isVisible("templates") && <TemplatesSection />}
      {isVisible("blog") && <BlogSection />}
      <CtaSection />
      <ContactSection />
    </div>
  );
}
