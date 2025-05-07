import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/layout/layout";
import { useTranslation } from "react-i18next";

export default function Consultation() {
  const { t } = useTranslation();
  
  // Załaduj skrypt Calendly po wyrenderowaniu komponentu
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Ukryj drugą stopkę za pomocą CSS
    const footerStyles = document.createElement('style');
    footerStyles.innerHTML = `
      /* Ukryj drugą stopkę */
      footer:nth-of-type(2) {
        display: none !important;
      }
    `;
    document.head.appendChild(footerStyles);

    return () => {
      // Cleanup przy odmontowaniu komponentu
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(footerStyles)) {
        document.head.removeChild(footerStyles);
      }
    };
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('general.backToHome', 'Powrót do strony głównej')}
            </Button>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{t('consultation.title', 'Bezpłatna konsultacja')}</h1>
          
          <div className="bg-card p-6 rounded-xl shadow-sm mb-8">
            <p className="text-lg mb-4">
              {t('consultation.intro', 'Umów się na bezpłatną 30-minutową konsultację z naszym ekspertem od automatyzacji. Podczas spotkania:')}
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>{t('consultation.point1', 'Omówimy Twoje potrzeby biznesowe')}</li>
              <li>{t('consultation.point2', 'Doradzimy optymalne rozwiązania automatyzacyjne')}</li>
              <li>{t('consultation.point3', 'Przygotujemy wstępną ocenę możliwości integracji systemów')}</li>
              <li>{t('consultation.point4', 'Odpowiemy na Twoje pytania związane z automatyzacją')}</li>
            </ul>
            <p>{t('consultation.cta', 'Wybierz dogodny termin w kalendarzu poniżej i daj nam się poznać!')}</p>
          </div>
          
          {/* Calendly inline widget */}
          <div 
            className="calendly-inline-widget mb-16" 
            data-url="https://calendly.com/automatyzator/konsultacja"
            style={{ minWidth: '320px', height: '700px' }}
          ></div>
        </div>
      </div>
    </Layout>
  );
}