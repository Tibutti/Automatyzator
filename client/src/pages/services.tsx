import Layout from "@/components/layout/layout";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import CtaSection from "@/components/cta-section";
import WhyUsSection from "@/components/why-us-section";

export default function Services() {
  return (
    <Layout>
      <div className="pt-20">
        <HeroSection />
        <ServicesSection />
        <WhyUsSection />
        <CtaSection />
      </div>
    </Layout>
  );
}