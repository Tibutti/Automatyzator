import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import tłumaczeń
import commonPL from './locales/pl/common.json';
import commonEN from './locales/en/common.json';
import commonDE from './locales/de/common.json';

// Konfiguracja zasobów
const resources = {
  pl: {
    common: commonPL,
  },
  en: {
    common: commonEN,
  },
  de: {
    common: commonDE,
  },
};

i18n
  // Wykrywanie języka przeglądarki
  .use(LanguageDetector)
  // Integracja z React
  .use(initReactI18next)
  // Inicjalizacja i18next
  .init({
    resources,
    fallbackLng: 'en', // Język domyślny, jeśli nie wykryto lub nie obsługiwany
    supportedLngs: ['pl', 'en', 'de'], // Obsługiwane języki
    
    // Domyślny namespace
    defaultNS: 'common',
    
    // Użyj symboli dla kluczy (np. {key})
    keySeparator: '.',
    
    interpolation: {
      // Nie chcemy by React zastępował znaki HTML w tłumaczeniach
      escapeValue: false,
    },
    
    detection: {
      // Kolejność metod wykrywania języka
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      
      // Nazwa parametru URL dla języka (np. ?lng=en)
      lookupQuerystring: 'lng',
      
      // Nazwa cookie
      lookupCookie: 'i18next',
      
      // Nazwa klucza w localStorage
      lookupLocalStorage: 'i18nextLng',
      
      // Cache języka w localStorage
      caches: ['localStorage', 'cookie'],
      
      // Czas ważności cookie (w dniach)
      cookieExpirationDate: 30,
    },
  });

export default i18n;