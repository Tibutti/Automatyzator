import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/layout";
import { useSectionSettings, SectionSetting } from "@/hooks/use-section-settings";

const DEFAULT_CALENDLY_URL = "https://calendly.com/automatyzator/konsultacja";

export default function Consultation() {
  const { t } = useTranslation();
  const { sectionSettings } = useSectionSettings();
  
  // State dla paska postępu i komunikatu
  const [isLoading, setIsLoading] = useState(true);
  const [consultationUrl, setConsultationUrl] = useState<string>(DEFAULT_CALENDLY_URL);
  
  useEffect(() => {
    // Znajdź ustawienie URL konsultacji w ustawieniach sekcji, jeśli zostało skonfigurowane
    if (sectionSettings) {
      const consultationSettings = sectionSettings.find((s: SectionSetting) => s.sectionKey === "consultation");
      if (consultationSettings && 'metadata' in consultationSettings) {
        try {
          const metadataStr = consultationSettings.metadata as string;
          if (metadataStr) {
            const metadata = JSON.parse(metadataStr);
            if (metadata.calendlyUrl) {
              setConsultationUrl(metadata.calendlyUrl);
            }
          }
        } catch (e) {
          console.error("Błąd parsowania metadanych konsultacji:", e);
        }
      }
    }
  }, [sectionSettings]);
  
  useEffect(() => {
    // Element kontenera, do którego dodamy bezpośrednio iframe
    const container = document.getElementById('calendly-container');
    if (!container) return;
    
    // Zresetuj zawartość kontenera
    container.innerHTML = '';
    
    // Utwórz iframe bezpośrednio, zamiast używać skryptu Calendly
    const iframe = document.createElement('iframe');
    iframe.src = consultationUrl;
    iframe.width = '100%';
    iframe.height = '700px';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; camera; microphone; payment';
    iframe.title = t('consultation.calendarFrame', 'Kalendarz konsultacji');
    iframe.onload = () => {
      setIsLoading(false);
    };
    
    // Dodaj iframe do kontenera
    container.appendChild(iframe);
    
    return () => {
      if (container && container.contains(iframe)) {
        container.removeChild(iframe);
      }
    };
  }, [consultationUrl, t]);
  
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
          
          {/* Pasek postępu wyświetlany podczas ładowania kalendarza */}
          {isLoading && (
            <div className="w-full py-12 flex flex-col items-center justify-center">
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: "80%" }}></div>
              </div>
              <p className="text-muted-foreground">{t('consultation.loading', 'Ładowanie kalendarza konsultacji...')}</p>
            </div>
          )}
          
          {/* Kontener dla iframe'a Calendly */}
          <div 
            id="calendly-container"
            className="mb-16 rounded-lg overflow-hidden border border-border"
            style={{ minHeight: '700px', display: isLoading ? 'none' : 'block' }}
          ></div>
        </div>
      </div>
    </Layout>
  );
}