import { Routes, Route, Outlet, HashRouter, BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '@/ui/mouse/Home';
import NotFound from '@/ui/NotFound';
import { ModalProvider } from '@/components/common/ModalContext';
import { SettingsDrawerProvider } from '@/components/common/SettingsDrawer';
import { ProfileDrawerProvider } from '@/components/common/ProfileDrawer';
import { disableScrollbars } from '@/utils/driver';
function Layout() {
  return (
    <main>
      <ModalProvider>
        <ProfileDrawerProvider>
          <SettingsDrawerProvider>
            <Outlet /> {/* 子路由渲染位置 */}
          </SettingsDrawerProvider>
        </ProfileDrawerProvider>
      </ModalProvider>
    </main>
  );
}

export default function AppRouter() {
  useEffect(() => {
    // 在应用挂载时禁用滚动条
    // 等待astilectron就绪后再调用
    const handleAstilectronReady = () => {
      disableScrollbars();
    };

    // 检查astilectron是否已经就绪
    if (typeof window !== 'undefined' && (window as any).astilectron) {
      handleAstilectronReady();
    } else {
      // 如果未就绪，监听ready事件
      document.addEventListener('astilectron-ready', handleAstilectronReady);
    }

    return () => {
      document.removeEventListener('astilectron-ready', handleAstilectronReady);
    };
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
