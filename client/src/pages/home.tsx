import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import WhyUsSection from "@/components/why-us-section";
import PortfolioSection from "@/components/portfolio-section";
import TemplatesSection from "@/components/templates-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
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
