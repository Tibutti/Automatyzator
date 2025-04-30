import { Button } from "@/components/ui/button";
import { Link } from "wouter";

import { useTranslation } from "react-i18next";

export default function CtaSection() {
  const { t } = useTranslation('common');
  
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-white">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-white/90 mb-8">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="px-8 py-4 h-auto bg-white text-primary hover:bg-gray-100 cta-button shadow-lg">
                {t('cta.startProject')}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-8 py-4 h-auto border-2 border-white text-white hover:bg-white/10 cta-button"
            >
              {t('cta.consultation')}
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-primary/80"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
    </section>
  );
}
