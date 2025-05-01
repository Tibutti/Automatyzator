import WhyUsSection from "@/components/why-us-section";
import CtaSection from "@/components/cta-section";
import { useTranslation } from "react-i18next";

export default function WhyUs() {
  const { t } = useTranslation('common');
  
  return (
    <div className="pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center whitespace-nowrap">
          {t('whyUs.title')}
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
          {t('cta.description')}
        </p>
      </div>
      <WhyUsSection />
      <CtaSection />
    </div>
  );
}