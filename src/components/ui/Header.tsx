import React from 'react';
import HoverImage from '@/components/common/HoverImage';
import logo from '@/assets/logo.png';

import ic_close from '@/assets/close_1.png';
import closeHover from '@/assets/close_2.png';
import min from '@/assets/min_1.png';
import minHover from '@/assets/min_2.png';

import setting from '@/assets/setting_1.png';
import settingHover from '@/assets/setting_2.png';
import reset from '@/assets/reset_1.png';
import ic_max from '@/assets/max.png';
import resetHover from '@/assets/reset_2.png';
import profile from '@/assets/profile_icon.png';
import { useSettingsDrawer } from '@/components/common/SettingsDrawer';
import { useModal } from '@/components/common/ModalContext';
import { reset as resetConfig } from '@/utils/driver';

import { checkDriver, minimizeApp, closeApp } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';

const Header = () => {
  const { openAlert, openConfigLoading, close: modalClose } = useModal();

  const { path } = useBaseInfoStore();
  const handleCheckDriver = () => {
    checkDriver((payload: any) => {
      console.log(payload);
    });
  };
  const resetMouse = () => {
    openAlert({
      title: '提示',
      content: '是否重置所有设置？',
      onOk: () => {
        const _loadingId = openConfigLoading({ proccess: 0 });
        resetConfig(path, () => {
          modalClose(_loadingId);
        });
      },
    });
  };
  return (
    <div className="header">
      <div className="header-left" onClick={handleCheckDriver}>
        <HoverImage src={logo} hoverSrc={logo} alt="Logo" className="logo" />
      </div>

      <div className="header-right">
        <div className="window-controls">
          <HoverImage src={min} hoverSrc={minHover} alt="Minimize" className="icon-5" onClick={minimizeApp} />
          {/* <HoverImage src={ic_max} hoverSrc={ic_max} alt="max" className="icon-5" onClick={minimizeApp} /> */}
          <HoverImage src={ic_close} hoverSrc={closeHover} alt="Close" className="icon-5" onClick={closeApp} />
        </div>
      </div>
    </div>
  );
};

export default Header;
