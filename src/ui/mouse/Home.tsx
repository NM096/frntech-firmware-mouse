import Header from '@/components/ui/Header';
import Menu from '@/components/ui/Menu';
import React, { use, useEffect, useState } from 'react';
import main_normal_top from '@/assets/main_normal_top.png';
import demo1 from '@/assets/demo1.png';
import demo2 from '@/assets/demo2.jpg';
import ProfileAction from '@/components/ui/ProfileAction';
import Profile from '@/components/ui/Profile';
import Action from '@/components/ui/Action';
import ButtonSetting from '@/components/ui/ButtonSetting';
import SystemSetting from '@/components/ui/SystemSetting';
import SensitivitySetting from '@/components/ui/SensitivitySetting';

const Home: React.FC = () => {
  return (
    <div className="home-page-container">
      <div className="demo-container">
        <Header />
        <Menu />
        <div className="content-container">
          {/* <ButtonSetting /> */}
          {/* <SystemSetting /> */}
          <SensitivitySetting />
        </div>

        <ProfileAction />
        <Profile />
        <Action />
      </div>
      <img style={{ opacity: 0 }} className="main-normal-top" src={demo2} alt="main_normal_top.png" />
    </div>
  );
};

export default Home;
