import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt/common.json';
import en from './locales/en/common.json';
import es from './locales/es/common.json';
import fr from './locales/fr/common.json';
import it from './locales/it/common.json';

const savedLanguage = localStorage.getItem('language') || 'pt';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      it: { translation: it },
    },
    lng: savedLanguage,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
