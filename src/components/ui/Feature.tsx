import SideBar from './SideBar';
import DpiConfig from './DpiConfig';
import KeyConfig from './KeyConfig';
import LightConfig from './LightConfig';
import PerformanceConfig from './PerformanceConfig';
import MacroConfig from './MacroConfig';

import ic_dpi from '@/assets/dpi.png';
import ic_key from '@/assets/keys.png';
import ic_light from '@/assets/light.png';
import ic_performance from '@/assets/performance.png';
import ic_macro from '@/assets/macro.png';

import setting from '@/assets/setting_1.png';
import settingHover from '@/assets/setting_2.png';
import ic_reset from '@/assets/reset_1.png';
import ic_max from '@/assets/max.png';
import resetHover from '@/assets/reset_2.png';
import ic_profile from '@/assets/profile_icon.png';
import ic_save from '@/assets/ic_save.png';
import type { Config } from '@/types/data-config';
import HoverImage from '@/components/common/HoverImage';
import { useSettingsDrawer } from '@/components/common/SettingsDrawer';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useState } from 'react';
export type sidebarKey = 'DpiConfig' | 'KeyConfig' | 'LightConfig' | 'PerformanceConfig' | 'MacroConfig';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/components/common/ModalContext';
import { useProfileDrawer } from '@/components/common/ProfileDrawer';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import {
  setCurrentProfile,
  setDPI,
  setConfigData,
  apply,
  setLE,
  setReportRate,
  setAdvanceSetting,
  reset,
} from '@/utils/driver';
import { useProfileStore } from '@/store/useProfile';

const Feature = () => {
  const { t } = useTranslation();
  const { open } = useSettingsDrawer();
  const { open: openProfileDrawer } = useProfileDrawer();
  const [activeSidebar, setActiveSidebar] = useState<sidebarKey>('DpiConfig');
  const sideList: { key: sidebarKey; title: string; icon: string }[] = [
    { key: 'DpiConfig', title: t('DpiConfig'), icon: ic_dpi },
    { key: 'KeyConfig', title: t('KeyConfig'), icon: ic_key },
    { key: 'LightConfig', title: t('LightConfig'), icon: ic_light },
    { key: 'PerformanceConfig', title: t('PerformanceConfig'), icon: ic_performance },
    { key: 'MacroConfig', title: t('MacroConfig'), icon: ic_macro },
  ];
  const {
    currentDevice,
    currentModelID,
    mode,
    path,
    setCurrentDevice,
    configData,
    setConfigData: setConfigDataOnStore,
    currentConfigFileName,
  } = useBaseInfoStore();
  const DPILevels = cloneDeep(currentDevice?.Info?.DPILevels || {});
  const { profile, setProfile, setIsReset } = useProfileStore();
  const defaultProfile = cloneDeep(useProfileStore.getState().defaultProfile);
  const sidebarComponents = {
    DpiConfig: () => <DpiConfig />,
    KeyConfig: () => <KeyConfig />,
    LightConfig: () => <LightConfig />,
    PerformanceConfig: () => <PerformanceConfig />,
    MacroConfig: () => <MacroConfig />,
  };

  const { openAlert } = useModal();
  const resetMouse = () => {
    openAlert({
      title: t('tips'),
      content: t('confirm_reset_config'),
      onOk: () => {
        setIsReset(true);
        reset(path, () => {
          setTimeout(() => {
            setIsReset(false);
          }, 5000);
          setCurrentProfile(currentModelID, currentConfigFileName, defaultProfile);
          setProfile(defaultProfile);
        });
      },
    });
  };
  const resetPageConfig = () => {
    switch (activeSidebar) {
      case 'DpiConfig': {
        // Add logic to reset DPI configuration to default

        const defaultDPILevels = defaultProfile?.DPIs.findIndex((dpi) => dpi.Select) || 0;
        const newDPILevels: number[] = DPILevels?.map((_, idx) => (idx === mode ? defaultDPILevels : _)) || [];
        setDPI(
          path,
          mode,
          {
            DPILevels: newDPILevels,
            DPIs: defaultProfile?.DPIs || [],
          },
          () => {
            setCurrentDevice({
              ...currentDevice,
              ...{ Info: { ...currentDevice?.Info, ...{ DPILevels: newDPILevels } } },
            } as any);
            const newDPILEDs = defaultProfile?.DPIs?.map((dpi, idx) => ({ Index: idx, Value: dpi.Color })) || [];
            const _newConfig = {
              ...(configData as Config),
              DPIs: defaultProfile?.DPIs || [],
              DPILEDs: newDPILEDs || [],
            };
            const _newProfile = { ...profile, DPIs: defaultProfile?.DPIs || [] };
            setConfigData(path, _newConfig, () => {
              setConfigDataOnStore(_newConfig);
            });
            setCurrentProfile(currentModelID, currentConfigFileName, _newProfile);
            setProfile(_newProfile);
          }
        );

        break;
      }
      case 'KeyConfig': {
        const _newProfile = { ...profile, KeySet: defaultProfile?.KeySet || [[]] };
        // Add logic to reset DPI configuration to default
        apply(path, _newProfile, () => {
          setCurrentProfile(currentModelID, currentConfigFileName, _newProfile, (payload) => {
            if (payload) {
              setProfile(_newProfile);
            }
          });
        });
        break;
      }
      case 'LightConfig':
        // reset Light configuration to default
        if (defaultProfile?.LEDEffect) {
          setLE(path, defaultProfile.LEDEffect);
          // Update local state and current device state to reflect changes
          setCurrentDevice({
            ...currentDevice,
            ...{ Info: { ...currentDevice?.Info, ...{ LEDEffect: defaultProfile.LEDEffect } } },
          } as any);
          setProfile({
            ...profile,
            LEDEffect: defaultProfile.LEDEffect,
          });
        }
        break;
      case 'PerformanceConfig':
        // Add logic to reset DPI configuration to default
        setReportRate(path, {
          USBReports: defaultProfile?.USBReports,
          WLReports: defaultProfile?.WLReports,
        });
        setAdvanceSetting(path, defaultProfile?.AdvanceSetting);
        setProfile({
          ...profile,
          USBReports: defaultProfile?.USBReports,
          WLReports: defaultProfile?.WLReports,
          AdvanceSetting: defaultProfile?.AdvanceSetting,
        });
        break;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="actions">
        <HoverImage src={ic_reset} hoverSrc={resetHover} alt="Reset" className="icon-7" onClick={resetMouse} />
        <div className="divider"></div>
        <div className="profile hover-bg" onClick={openProfileDrawer}>
          <HoverImage src={ic_profile} hoverSrc={ic_profile} alt="Profile" className="icon-7" />
          <div className="profile-text">配置设置</div>
        </div>

        {/* <div className="divider"></div>
        <div className="save-config hover-bg" onClick={handleSaveConfig}>
          <HoverImage src={ic_save} hoverSrc={ic_save} alt="Save" className="icon-7" />
          <div className="save-text">保存配置</div>
        </div> */}

        <div className="divider"></div>
        {activeSidebar !== 'MacroConfig' && (
          <div className="reset-default-tips" onClick={() => resetPageConfig()}>
            {t('resetCurrentPageConfig')}
          </div>
        )}
        <HoverImage src={setting} hoverSrc={settingHover} alt="Setting" className="icon-7" onClick={open} />
      </div>
      <div className="feature-container">
        <SideBar
          sideList={sideList}
          activeSidebar={activeSidebar}
          onSidebarChange={(key: sidebarKey) => setActiveSidebar(key)}
        />
        <div className="feature-content">{sidebarComponents[activeSidebar]() || null}</div>
      </div>
    </div>
  );
};

export default Feature;
