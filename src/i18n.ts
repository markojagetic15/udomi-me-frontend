import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import hr from './locales/hr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hr: { translation: hr },
    },
    fallbackLng: 'hr',
    supportedLngs: ['en', 'hr'],
    load: 'languageOnly',
    detection: {
      // No 'navigator': Croatian is the default unless the user picked a language.
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'udomi-lang',
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Keep <html lang> in sync for screen readers and hyphenation.
document.documentElement.lang = i18n.language === 'en' ? 'en' : 'hr';
i18n.on(
  'languageChanged',
  (lng) => (document.documentElement.lang = lng === 'en' ? 'en' : 'hr')
);

export default i18n;
