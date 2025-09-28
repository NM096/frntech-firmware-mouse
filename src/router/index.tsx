import { Routes, Route, Outlet, HashRouter, BrowserRouter } from 'react-router-dom';
import Home from '@/ui/mouse/Home';
import NotFound from '@/ui/NotFound';
import { ModalProvider } from '@/components/common/ModalContext';
import { SettingsDrawerProvider } from '@/components/common/SettingsDrawer';
import { ProfileDrawerProvider } from '@/components/common/ProfileDrawer';
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
