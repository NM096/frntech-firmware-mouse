import React, { useEffect, useState } from 'react';
import HoverImage from './HoverImage';
import logo from '@/assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/store/useProfile';
interface GlobalLoadingProps {
  id: string;
  onClose: (id: string) => void;
  progress?: number;
  autoClose?: boolean;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ id, onClose, progress, autoClose = true }) => {
  const { upgradeProcess } = useProfileStore();
  const [internalProgress, setInternalProgress] = useState(0);
  const { t } = useTranslation();
  useEffect(() => {
    if (progress !== undefined) return;
  }, [progress, id, onClose, autoClose]);

  useEffect(() => {
    setInternalProgress(upgradeProcess);
    console.log(upgradeProcess);
  }, [upgradeProcess]);
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
      <div className="global-loading-text">{t('device_setting')}</div>
      <div className="global-progress-bar">
        <div className="global-progress" style={{ width: `${displayProgress}%` }}></div>
      </div>
    </div>
  );
};

export default GlobalLoading;
