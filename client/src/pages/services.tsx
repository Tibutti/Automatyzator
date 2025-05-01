import Layout from "@/components/layout/layout";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import CtaSection from "@/components/cta-section";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation('common');
  
  return (
    <Layout>
      <div className="pt-20">
        <HeroSection />
        <ServicesSection />
        <CtaSection />
      </div>
    </Layout>
  );
}