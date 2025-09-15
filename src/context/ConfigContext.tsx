import React, { createContext, useContext } from 'react';

interface LangOption {
  code: string;
  name: string;
}

export interface I18nConfig {
  defaultLang: string;
  supportedLangs: LangOption[];
}

const ConfigContext = createContext<I18nConfig | null>(null);

export const ConfigProvider: React.FC<{ config: I18nConfig; children: React.ReactNode }> = ({ config, children }) => {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig 必须在 <ConfigProvider> 内使用');
  }
  return ctx;
};
