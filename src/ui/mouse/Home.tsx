import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import NoDevice from '@/components/ui/NoDevice';
import DeviceList from '@/components/ui/DeviceList';
import Feature from '@/components/ui/Feature';
import { getDeviceList } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { DeviceData } from '@/types/device-data';
import { useConfig } from '@/context/ConfigContext';
const Home: React.FC = () => {
  const config = useConfig();
  console.log('i18n config', config);
  const { deviceMap, setDeviceMap, currentDevice } = useBaseInfoStore();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      getDeviceList((payload: any) => {
        if (Object.keys(payload).length === 0) {
          setConnected(false);
        } else {
          setDeviceMap(payload as DeviceData);
          setConnected(true);
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="home-container">
      <Header />
      {!connected && <NoDevice />}
      {connected && deviceMap && !currentDevice && <DeviceList />}
      {connected && currentDevice && <Feature />}
    </div>
  );
};

export default Home;
