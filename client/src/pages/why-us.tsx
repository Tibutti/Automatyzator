import WhyUsSection from "@/components/why-us-section";
import CtaSection from "@/components/cta-section";
import { useTranslation } from "react-i18next";
import HeroSection from "@/components/hero-section";

export default function WhyUs() {
  const { t } = useTranslation('common');
  
  return (
    <div className="min-h-screen pt-20">
      <HeroSection pageKey="why-us" />
      <WhyUsSection />
      <CtaSection />
    </div>
  );
}