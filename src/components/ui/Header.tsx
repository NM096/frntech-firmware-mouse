import React from 'react';
import HoverImage from '@/components/common/HoverImage';
import logo from '@/assets/logo.png';

import close from '@/assets/close_1.png';
import closeHover from '@/assets/close_2.png';
import min from '@/assets/min_1.png';
import minHover from '@/assets/min_2.png';

import setting from '@/assets/setting_1.png';
import settingHover from '@/assets/setting_2.png';
import reset from '@/assets/reset_1.png';
import resetHover from '@/assets/reset_2.png';
import profile from '@/assets/profile_icon.png';
import { useSettingsDrawer } from '../common/SettingsDrawer';

import { checkDriver, minimizeApp, closeApp } from '@/utils/driver';

const Header = () => {
  const { open } = useSettingsDrawer();
  const handleCheckDriver = () => {
    checkDriver((payload: any) => {
      console.log(payload);
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
          <HoverImage src={close} hoverSrc={closeHover} alt="Close" className="icon-5" onClick={closeApp} />
        </div>

        <div className="actions">
          <HoverImage src={reset} hoverSrc={resetHover} alt="Reset" className="icon-7" />
          <div className="divider"></div>

          <div className="profile hover-bg">
            <HoverImage src={profile} hoverSrc={profile} alt="Profile" className="icon-7" />
            <div className="profile-text">配置设置</div>
          </div>

          <div className="divider"></div>

          <HoverImage src={setting} hoverSrc={settingHover} alt="Setting" className="icon-7" onClick={open} />
        </div>
      </div>
    </div>
  );
};

export default Header;
