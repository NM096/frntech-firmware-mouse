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
import reset from '@/assets/reset_1.png';
import ic_max from '@/assets/max.png';
import resetHover from '@/assets/reset_2.png';
import profile from '@/assets/profile_icon.png';
import HoverImage from '@/components/common/HoverImage';
import { useSettingsDrawer } from '@/components/common/SettingsDrawer';
import { useState } from 'react';
export type sidebarKey = 'DpiConfig' | 'KeyConfig' | 'LightConfig' | 'PerformanceConfig' | 'MacroConfig';
import { useTranslation } from 'react-i18next';
const Feature = () => {
  const { t } = useTranslation();
  const { open } = useSettingsDrawer();
  const [activeSidebar, setActiveSidebar] = useState<sidebarKey>('DpiConfig');
  const sideList: { key: sidebarKey; title: string; icon: string }[] = [
    { key: 'DpiConfig', title: t('DpiConfig'), icon: ic_dpi },
    { key: 'KeyConfig', title: t('KeyConfig'), icon: ic_key },
    { key: 'LightConfig', title: t('LightConfig'), icon: ic_light },
    { key: 'PerformanceConfig', title: t('PerformanceConfig'), icon: ic_performance },
    { key: 'MacroConfig', title: t('MacroConfig'), icon: ic_macro },
  ];

  const sidebarComponents = {
    DpiConfig: () => <DpiConfig />,
    KeyConfig: () => <KeyConfig />,
    LightConfig: () => <LightConfig />,
    PerformanceConfig: () => <PerformanceConfig />,
    MacroConfig: () => <MacroConfig />,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="actions">
        {/*   <HoverImage src={reset} hoverSrc={resetHover} alt="Reset" className="icon-7" onClick={resetMouse} />
          <div className="divider"></div>
        
          <div className="profile hover-bg">
            <HoverImage src={profile} hoverSrc={profile} alt="Profile" className="icon-7" />
            <div className="profile-text">配置设置</div>
          </div>

          <div className="divider"></div>
          */}
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
