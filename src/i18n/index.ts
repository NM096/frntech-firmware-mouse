// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en/common.json';
import zh from '../locales/zh/common.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

i18n
  // .use(LanguageDetector) // 自动检测语言
  .use(initReactI18next) // 绑定 React
  .init({
    resources,
    fallbackLng: 'zh', // 默认语言
    interpolation: {
      escapeValue: false, // react 已经有 xss 保护
    },
  });

export default i18n;
