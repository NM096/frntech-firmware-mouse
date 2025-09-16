import React, { createContext, useEffect, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import HoverImage from './HoverImage';
import back1 from '@/assets/back_device_1.png';
import back2 from '@/assets/back_device_2.png';
import { Switch } from './Switch';
import CustomRadio from './CustomRadio';
import { useConfig } from '@/context/ConfigContext';
import { useI18nToggle } from '@/hooks/useI18nToggle';
import { getSoftwareVersion, loadAppConfig, saveAppConfig } from '@/utils/driver';
type SettingsDrawerContextType = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SettingsDrawerContext = createContext<SettingsDrawerContextType | null>(null);

export const SettingsDrawerProvider = ({ children }: { children: ReactNode }) => {
  const config = useConfig();
  const { lang: currentLang, toggleLang, setLang } = useI18nToggle();
  const [visible, setVisible] = useState(false);
  const [version, setVersion] = useState('0.1.0');
  const [autoStart, setAutoStart] = useState(false);
  const [dpiDialogOpen, setDpiDialogOpen] = useState(false);
  const [lowPowerDialogOpen, setLowPowerDialogOpen] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible((v) => !v);

  useEffect(() => {
    getSoftwareVersion((version) => {
      setVersion(version);
    });
    loadAppConfig((config) => {
      if (config) {
        setAutoStart(config.AutoRun ?? false);
        setDpiDialogOpen(config.DPIWindow ?? false);
        setLowPowerDialogOpen(config.LVDWindow ?? false);
      }
    });
  }, []);
  useEffect(() => {
    saveAppConfig({
      Language: currentLang,
    });
  }, [currentLang]);

  const handleChangeLanguage = (lang: string) => {
    setLang(lang);
    toggleLang();
    saveAppConfig({
      DPIWindow: dpiDialogOpen,
      AutoRun: autoStart,
      LVDWindow: lowPowerDialogOpen,
      Language: lang,
      ModelSelect: '',
    });
  };
  const handleAutoStartChange = (checked: boolean) => {
    setAutoStart(checked);
    saveAppConfig({
      DPIWindow: dpiDialogOpen,
      AutoRun: checked,
      LVDWindow: lowPowerDialogOpen,
      Language: currentLang,
      ModelSelect: '',
    });
  };
  const handleDpiDialogChange = (checked: boolean) => {
    setDpiDialogOpen(checked);
    saveAppConfig({
      DPIWindow: checked,
      AutoRun: autoStart,
      LVDWindow: lowPowerDialogOpen,
      Language: currentLang,
      ModelSelect: '',
    });
  };
  const handleLowPowerDialogChange = (checked: boolean) => {
    setLowPowerDialogOpen(checked);
    saveAppConfig({
      DPIWindow: dpiDialogOpen,
      AutoRun: autoStart,
      LVDWindow: checked,
      Language: currentLang,
      ModelSelect: '',
    });
  };

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
              版本号 <span className="version">{version.split('+')[0]}</span>
            </p>
          </div>

          <div className="settings-section">
            <h3 className="section-title">语言选择</h3>
            <div className="lang-options">
              {config &&
                config.supportedLangs.map((lang) => {
                  return (
                    <label
                      key={lang.code}
                      onChange={() => {
                        handleChangeLanguage(lang.code);
                      }}
                    >
                      <CustomRadio checked={lang.code === currentLang} />
                      {lang.name}
                    </label>
                  );
                })}
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">常规设置</h3>
            <div className="toggle-item">
              <span>开机自启动</span>
              <Switch
                size="small"
                checked={autoStart}
                onChange={(e) => {
                  handleAutoStartChange(e);
                }}
              />
            </div>
            <div className="toggle-item">
              <span>DPI弹窗开关</span>
              <Switch
                size="small"
                checked={dpiDialogOpen}
                onChange={(e) => {
                  handleDpiDialogChange(e);
                }}
              />
            </div>
            <div className="toggle-item">
              <span>电池低电量弹窗</span>
              <Switch
                size="small"
                checked={lowPowerDialogOpen}
                onChange={(e) => {
                  handleLowPowerDialogChange(e);
                }}
              />
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
