import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import tłumaczeń
import pl from './locales/pl/common.json';
import en from './locales/en/common.json';
import de from './locales/de/common.json';
import ko from './locales/ko/common.json';

const resources = {
  pl: { common: pl },
  en: { common: en },
  de: { common: de },
  ko: { common: ko },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    resources,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;