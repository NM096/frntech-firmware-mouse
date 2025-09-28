import React, { createContext, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import HoverImage from './HoverImage';
import back1 from '@/assets/back_device_1.png';
import back2 from '@/assets/back_device_2.png';
import { Switch } from './Switch';
import CustomRadio from './CustomRadio';
import { useConfig } from '@/context/ConfigContext';
import { useI18nToggle } from '@/hooks/useI18nToggle';
import { getSoftwareVersion, loadAppConfig, saveAppConfig, upgradeFireware } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useModal } from './ModalContext';
import { useProfileStore } from '@/store/useProfile';
type SettingsDrawerContextType = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SettingsDrawerContext = createContext<SettingsDrawerContextType | null>(null);

export const SettingsDrawerProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const config = useConfig();
  const { lang: currentLang, toggleLang, setLang } = useI18nToggle();

  const { currentDevice, path, currentModelID } = useBaseInfoStore();
  const { setUpgradeProcess, setIsUpgrade } = useProfileStore();
  const { Info, Model } = currentDevice || {};
  const [visible, setVisible] = useState(false);
  const [version, setVersion] = useState('0.1.0');
  const [autoStart, setAutoStart] = useState(false);
  const [dpiDialogOpen, setDpiDialogOpen] = useState(false);
  const [lowPowerDialogOpen, setLowPowerDialogOpen] = useState(false);
  const { openAlert, closeAll, openUpgradeLoading } = useModal();

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

  const handleUpgradeDevice = () => {
    setVisible(false);
    openAlert({
      title: '固件升级',
      content: '确认升级固件？请确保在升级过程中不要断开设备连接。',
      onOk: () => {
        openUpgradeLoading({ proccess: 0 });
        setUpgradeProcess(0);
        setIsUpgrade(true);
        upgradeFireware(path, currentModelID, () => {
          closeAll();
          setIsUpgrade(false);
        });
      },
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
            {t('back_to_home')}
          </button>
        </div>

        <div>
          <div className="settings-section">
            <h3 className="section-title">{t('software_version')}</h3>
            <div className="version-content">
              {t('version_number')} <span className="version">{version.split('+')[0]}</span>
              {(Info?.FWVersion ?? 0) >= (Model?.FWVersion ?? 0) ? (
                <p className="upgrade-firmware" onClick={() => handleUpgradeDevice()}>
                  固件升级
                </p>
              ) : null}
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">{t('language_select')}</h3>
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
            <h3 className="section-title">{t('general_settings')}</h3>
            <div className="toggle-item">
              <span>{t('auto_start')}</span>
              <Switch
                size="small"
                checked={autoStart}
                onChange={(e) => {
                  handleAutoStartChange(e);
                }}
              />
            </div>
            <div className="toggle-item">
              <span>{t('dpi_dialog_switch')}</span>
              <Switch
                size="small"
                checked={dpiDialogOpen}
                onChange={(e) => {
                  handleDpiDialogChange(e);
                }}
              />
            </div>
            <div className="toggle-item">
              <span>{t('low_battery_dialog')}</span>
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
