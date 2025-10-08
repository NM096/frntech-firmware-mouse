// src/components/common/Portal.tsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 组件卸载时返回一个清理函数
    return () => setMounted(false);
  }, []);

  // 只有在客户端挂载后才创建 portal
  return mounted ? createPortal(children, document.querySelector('#root') as HTMLElement) : null;
};

export default Portal;
