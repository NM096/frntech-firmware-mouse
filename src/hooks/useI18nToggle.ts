import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useI18nToggle() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState<'en' | 'zh'>(() => {
    return (localStorage.getItem('lang') as 'en' | 'zh') || (i18n.language.startsWith('zh') ? 'zh' : 'en');
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'));
  }, []);

  return { lang, toggleLang, setLang };
}
