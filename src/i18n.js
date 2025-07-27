import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tr from '../locales/tr.json';
import en from '../locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { tr: { translation: tr }, en: { translation: en } },
    fallbackLng: 'tr',
    lng: localStorage.getItem('lang') || 'tr',
    interpolation: { escapeValue: false },
  });

export default i18n;
