import InteractiveHeroSection from "@/components/interactive-hero-section";
import ServicesSection from "@/components/services-section";
import WhyUsSection from "@/components/why-us-section";
import PortfolioSection from "@/components/portfolio-section";
import TemplatesSection from "@/components/templates-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import ContactSection from "@/components/contact-section";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
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
      <ServicesSection />
      <WhyUsSection />
      <PortfolioSection />
      <TemplatesSection />
      <BlogSection />
      <CtaSection />
      <ContactSection />
    </div>
  );
}
