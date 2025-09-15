import { Routes, Route, Outlet, HashRouter, BrowserRouter } from 'react-router-dom';
import Home from '@/ui/mouse/Home';
import NotFound from '@/ui/NotFound';
import { ModalProvider } from '@/components/common/ModalContext';
import { SettingsDrawerProvider } from '@/components/common/SettingsDrawer';
function Layout() {
  return (
    <main>
      <SettingsDrawerProvider>
        <ModalProvider>
          <Outlet /> {/* 子路由渲染位置 */}
        </ModalProvider>
      </SettingsDrawerProvider>
    </main>
  );
}

export default function AppRouter() {
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
