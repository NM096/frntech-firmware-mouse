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

import { useState } from 'react';
export type sidebarKey = 'DpiConfig' | 'KeyConfig' | 'LightConfig' | 'PerformanceConfig' | 'MacroConfig';

const Feature = () => {
  const [activeSidebar, setActiveSidebar] = useState<sidebarKey>('DpiConfig');
  const sideList: { key: sidebarKey; title: string; icon: string }[] = [
    { key: 'DpiConfig', title: 'DPI设置', icon: ic_dpi },
    { key: 'KeyConfig', title: '自定义键', icon: ic_key },
    { key: 'LightConfig', title: '灯光设置', icon: ic_light },
    { key: 'PerformanceConfig', title: '性能设置', icon: ic_performance },
    { key: 'MacroConfig', title: '宏功能', icon: ic_macro },
  ];

  const sidebarComponents = {
    DpiConfig: () => <DpiConfig />,
    KeyConfig: () => <KeyConfig />,
    LightConfig: () => <LightConfig />,
    PerformanceConfig: () => <PerformanceConfig />,
    MacroConfig: () => <MacroConfig />,
  };

  return (
    <div className="feature-container">
      <SideBar
        sideList={sideList}
        activeSidebar={activeSidebar}
        onSidebarChange={(key: sidebarKey) => setActiveSidebar(key)}
      />
      <div className="feature-content">{sidebarComponents[activeSidebar]() || null}</div>
    </div>
  );
};

export default Feature;
