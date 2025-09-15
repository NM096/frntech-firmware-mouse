import React, { useEffect, useState } from 'react';
import HoverImage from './HoverImage';
import logo from '@/assets/logo.png';
interface GlobalLoadingProps {
  id: string;
  onClose: (id: string) => void;
  progress?: number;
  autoClose?: boolean;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ id, onClose, progress, autoClose = true }) => {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (progress !== undefined) return;

    const timer: NodeJS.Timeout = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (autoClose) {
            setTimeout(() => onClose(id), 500);
          }
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 5;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [progress, id, onClose, autoClose]);

  const displayProgress = progress !== undefined ? progress : internalProgress;

  useEffect(() => {
    if (progress === 100 && autoClose) {
      const timer = setTimeout(() => onClose(id), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, id, onClose, autoClose]);

  return (
    <div className="global-card">
      <HoverImage src={logo} hoverSrc={logo} alt="Logo" className="logo" />
      <div className="global-loading-text">驱动设备中……</div>
      <div className="global-progress-bar">
        <div className="global-progress" style={{ width: `${displayProgress}%` }}></div>
      </div>
    </div>
  );
};

export default GlobalLoading;
