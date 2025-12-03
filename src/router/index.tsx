import { useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from '@/ui/mouse/Home';
import NotFound from '@/ui/NotFound';
import { ModalProvider } from '@/components/common/ModalContext';
function Layout() {
  return (
    <main>
      <ModalProvider>
        <Outlet /> {/* 子路由渲染位置 */}
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
