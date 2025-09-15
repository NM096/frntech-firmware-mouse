import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import HoverImage from './HoverImage';
import back1 from '@/assets/back_device_1.png';
import back2 from '@/assets/back_device_2.png';
import { Switch } from './Switch';
import CustomRadio from './CustomRadio';

type SettingsDrawerContextType = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SettingsDrawerContext = createContext<SettingsDrawerContextType | null>(null);

export const SettingsDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible((v) => !v);

  const [enabled, setEnabled] = useState(false);
  return (
    <SettingsDrawerContext.Provider value={{ open, close, toggle }}>
      {children}
      <div className={`drawer-overlay ${visible ? 'show' : ''}`} onClick={close}></div>
      <div className={`drawer ${visible ? 'open' : ''}`}>
        <div className="settings-header">
          <button className="back-btn" onClick={close}>
            <HoverImage src={back1} hoverSrc={back2} alt="Logo" className="back-btn-icon" />
            返回主页
          </button>
        </div>

        <div>
          <div className="settings-section">
            <h3 className="section-title">软件版本</h3>
            <p className="text">
              版本号 <span className="version">0.1.0</span>
            </p>
          </div>

          <div className="settings-section">
            <h3 className="section-title">语言选择</h3>
            <div className="lang-options">
              <label>
                <CustomRadio onChange={() => {}} checked={false} defaultChecked /> 简体中文
              </label>
              <label>
                <CustomRadio onChange={() => {}} checked={false} /> English
              </label>
              {/*
              <label>
                <CustomRadio onChange={() => {}} checked={false} /> Français
              </label>
              <label>
                <CustomRadio onChange={() => {}} checked={false} /> Español
              </label>
              */}
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">常规设置</h3>
            <div className="toggle-item">
              <span>开机自启动</span>
              <Switch size="small" checked={enabled} onChange={setEnabled} />
            </div>
            <div className="toggle-item">
              <span>DPI弹窗开关</span>
              <Switch size="small" checked={enabled} onChange={setEnabled} />
            </div>
            <div className="toggle-item">
              <span>电池低电量弹窗</span>
              <Switch size="small" checked={enabled} onChange={setEnabled} />
            </div>
          </div>
        </div>
      </div>
    </SettingsDrawerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettingsDrawer = () => {
  const ctx = useContext(SettingsDrawerContext);
  if (!ctx) throw new Error('useSettingsDrawer must be used inside SettingsDrawerProvider');
  return ctx;
};
