import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Facebook, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/layout/navbar";
import ChatWidget from "@/components/chat-widget";
import CookieConsent from "@/components/cookie-consent";
import Logo from "@/components/logo";
import LegalPopup from "@/components/legal-popup";
import PrivacyPolicy from "@/components/legal/privacy-policy";
import TermsOfService from "@/components/legal/terms-of-service";
import CookiesPolicy from "@/components/legal/cookies-policy";
import { useState } from "react";

export default function Consultation() {
  const { t } = useTranslation();
  const [activePopup, setActivePopup] = useState<string | null>(null);
  
  const openPrivacyPopup = () => setActivePopup('privacy');
  const openTermsPopup = () => setActivePopup('terms');
  const openCookiesPopup = () => setActivePopup('cookies');
  const closePopup = () => setActivePopup(null);
  
  // Załaduj skrypt Calendly po wyrenderowaniu komponentu
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup przy odmontowaniu komponentu
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
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
      </main>
      
      {/* Własna wersja stopki */}
      <footer className="bg-[#1F1F1F] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Logo />
                <span className="ml-2 text-xl font-montserrat font-bold text-white">Automatyzator</span>
              </div>
              <p className="text-gray-400 mb-4">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-montserrat font-bold mb-4 text-white">{t('footer.services')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.servicesList.makecom')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.servicesList.n8n')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.servicesList.zapier')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.servicesList.bots')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.servicesList.llmAgents')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-montserrat font-bold mb-4 text-white">{t('footer.resources')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">{t('footer.blog')}</Link>
                </li>
                <li>
                  <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">{t('footer.templates')}</Link>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.documentation')}</a></li>
                <li>
                  <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">{t('footer.caseStudies')}</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-montserrat font-bold mb-4 text-white">{t('footer.company')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.team')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.careers')}</a></li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{t('footer.contact')}</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">{t('footer.copyright')}</p>
            <div className="flex space-x-6">
              <button onClick={openPrivacyPopup} className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.privacy')}</button>
              <button onClick={openTermsPopup} className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.terms')}</button>
              <button onClick={openCookiesPopup} className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.cookies')}</button>
              <span id="cookie-settings-btn-container"></span>
            </div>
          </div>
        </div>
        
        {/* Legal Popups */}
        <LegalPopup 
          isOpen={activePopup === 'privacy'} 
          onClose={closePopup} 
          title={t('privacy.title')}
        >
          <PrivacyPolicy />
        </LegalPopup>
        
        <LegalPopup 
          isOpen={activePopup === 'terms'} 
          onClose={closePopup} 
          title={t('terms.title')}
        >
          <TermsOfService />
        </LegalPopup>
        
        <LegalPopup 
          isOpen={activePopup === 'cookies'} 
          onClose={closePopup} 
          title={t('cookies.title')}
        >
          <CookiesPolicy />
        </LegalPopup>
      </footer>
      
      <ChatWidget />
      <CookieConsent />
    </div>
  );
}