import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/chat-widget";
import CookieConsent from "@/components/cookie-consent";
import { useSectionSettings, SectionSetting } from "@/hooks/use-section-settings";

// Deklaracja globalnego typu dla obiektu Calendly
declare global {
  interface Window {
    Calendly?: any;
  }
}

// Domyślny URL Calendly, jeśli nie jest skonfigurowany w panelu administracyjnym
const DEFAULT_CALENDLY_URL = "https://calendly.com/automatyzator/konsultacja";

export default function Consultation() {
  const { t } = useTranslation();
  const { sectionSettings } = useSectionSettings();
  
  // State dla paska postępu i komunikatu
  const [isLoading, setIsLoading] = useState(true);
  const [consultationUrl, setConsultationUrl] = useState<string>(DEFAULT_CALENDLY_URL);
  
  useEffect(() => {
    // Wczytaj URL konsultacji z ustawień sekcji
    if (sectionSettings) {
      const consultationSettings = sectionSettings.find((s: SectionSetting) => s.sectionKey === "consultation");
      if (consultationSettings && consultationSettings.metadata) {
        try {
          const metadata = JSON.parse(consultationSettings.metadata);
          if (metadata.calendlyUrl) {
            setConsultationUrl(metadata.calendlyUrl);
          }
        } catch (e) {
          console.error("Błąd parsowania metadanych konsultacji:", e);
        }
      }
    }
  }, [sectionSettings]);
  
  useEffect(() => {
    // Użyj widget.js z Calendly
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  useEffect(() => {
    // Znajdź widget Calendly po wczytaniu strony
    const checkCalendlyLoaded = setInterval(() => {
      if (typeof window.Calendly !== 'undefined') {
        clearInterval(checkCalendlyLoaded);
        setIsLoading(false);
      }
    }, 100);
    
    return () => {
      clearInterval(checkCalendlyLoaded);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-10 md:py-20">
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
            
            {/* Calendly inline widget */}
            <div 
              className="calendly-inline-widget mb-16" 
              data-url={consultationUrl}
              style={{ minWidth: '320px', height: '700px', display: isLoading ? 'none' : 'block' }}
            ></div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
      <CookieConsent />
    </div>
  );
}