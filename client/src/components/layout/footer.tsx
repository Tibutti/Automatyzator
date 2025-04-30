import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import Logo from "@/components/logo";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import LegalPopup from "@/components/legal-popup";
import PrivacyPolicy from "@/components/legal/privacy-policy";
import TermsOfService from "@/components/legal/terms-of-service";
import CookiesPolicy from "@/components/legal/cookies-policy";

export default function Footer() {
  const { t } = useTranslation('common');
  const [activePopup, setActivePopup] = useState<'privacy' | 'terms' | 'cookies' | null>(null);
  
  const openPrivacyPopup = () => setActivePopup('privacy');
  const openTermsPopup = () => setActivePopup('terms');
  const openCookiesPopup = () => setActivePopup('cookies');
  const closePopup = () => setActivePopup(null);
  
  return (
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
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Make.com</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">n8n</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Zapier</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Boty</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Agenty LLM</a></li>
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
  );
}
