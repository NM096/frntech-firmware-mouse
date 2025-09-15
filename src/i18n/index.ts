import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

async function initI18n() {
  const res = await fetch(`${import.meta.env.BASE_URL}locales/i18n.json`);
  console.log('i18n config res', res);
  const config = await res.json();
  const defaultLang = config.defaultLang || 'en';
  await i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: defaultLang,
      fallbackLng: defaultLang,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/common.json`,
      },
    });

  return { i18n, config };
}

export default initI18n;
