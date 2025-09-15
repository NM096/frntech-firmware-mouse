import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n'; // 添加这行来初始化 i18n
import App from './App.tsx';
import { Toaster } from 'sonner';
import { ConfigProvider } from './context/ConfigContext.tsx';
import initI18n from './i18n';

initI18n().then(({ config }) => {
  // i18n 已经初始化完成
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ConfigProvider config={config}>
        <App />
      </ConfigProvider>
      <Toaster richColors position="top-center" />
    </StrictMode>
  );
});
