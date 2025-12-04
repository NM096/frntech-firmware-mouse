import Action from '@/components/ui/Action';
import ButtonSetting from '@/components/ui/ButtonSetting';
import Header from '@/components/ui/Header';
import Menu from '@/components/ui/Menu';
import Profile from '@/components/ui/Profile';
import ProfileAction from '@/components/ui/ProfileAction';
import SensitivitySetting from '@/components/ui/SensitivitySetting';
import SystemSetting from '@/components/ui/SystemSetting';

import { useState } from 'react';

const Feature = () => {
  const [menu, setMenu] = useState<'SENSITIVITYSETTING' | 'SYSTEMSETTING' | 'BUTTONSETTING'>('SENSITIVITYSETTING');
  return (
    <div className="demo-container">
      <Header />
      <Menu onChange={(value) => setMenu(value)} value={menu} />
      <div className="content-container">
        {menu == 'BUTTONSETTING' && <ButtonSetting />}
        {menu == 'SYSTEMSETTING' && <SystemSetting />}
        {menu == 'SENSITIVITYSETTING' && <SensitivitySetting />}
      </div>

      <ProfileAction />
      <Profile />
      <Action />
    </div>
  );
};
export default Feature;
