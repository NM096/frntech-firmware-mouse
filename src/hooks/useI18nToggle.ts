import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../context/ConfigContext';

export function useI18nToggle() {
  const config = useConfig();
  const { i18n } = useTranslation();
  const { defaultLang, supportedLangs } = config;

  const [lang, setLang] = useState<string>(() => {
    const saved = localStorage.getItem('lang');
    if (saved && supportedLangs.some((l) => l.code === saved)) return saved;
    if (i18n.language) {
      const match = supportedLangs.find((l) => i18n.language.startsWith(l.code));
      if (match) return match.code;
    }
    return defaultLang;
  });

  useEffect(() => {
    if (!supportedLangs.find((l) => l.code === lang)) {
      setLang(defaultLang);
      return;
    }
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang, i18n, defaultLang, supportedLangs]);

  const toggleLang = useCallback(() => {
    const idx = supportedLangs.findIndex((l) => l.code === lang);
    const next = supportedLangs[(idx + 1) % supportedLangs.length];
    setLang(next.code);
  }, [lang, supportedLangs]);

  return { lang, toggleLang, setLang };
}
