import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import NoDevice from '@/components/ui/NoDevice';
import DeviceList from '@/components/ui/DeviceList';
import Feature from '@/components/ui/Feature';
import { getDeviceList, listenDriverMessage, onDriverMessage } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { DeviceData } from '@/types/device-data';
const Home: React.FC = () => {
  const { deviceMap, setDeviceMap, currentDevice, path, clearCurrentDevice } = useBaseInfoStore();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      getDeviceList((deviceList: any) => {
        if (Object.keys(deviceList).length === 0) {
          setConnected(false);
        } else {
          const filteredList = Object.keys(deviceList)
            .filter((key) => deviceList[key].Info.Mouse.Type !== 'Dongle')
            .map((key) => ({ [key]: deviceList[key] }))
            .reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setDeviceMap(filteredList as DeviceData);
          setConnected(true);
          clearInterval(timer);
        }
      });
    }, 1000);
    listenChangeDeviceList();
    listenChangeDeviceInfo();
    return () => clearTimeout(timer);
  }, []);
  const listenChangeDeviceList = () => {
    console.log('Start listening device list change');
    onDriverMessage('DeviceListChanged', (payload) => {
      console.log('Device list changed:', payload);
      if (Object.keys(payload).length === 0) {
        setConnected(false);
      } else {
        setConnected(true);
      }
      if (!payload[path!]) {
        clearCurrentDevice();
      }
      setDeviceMap(payload as DeviceData);
    });

    listenDriverMessage();
  };
  const listenChangeDeviceInfo = () => {
    onDriverMessage('onDeviceChanged', (deviceInfo) => {
      const hasStoreDevice = Object.keys(deviceInfo).includes(deviceInfo.Device);
      if (hasStoreDevice) {
        setDeviceMap({
          ...deviceMap,
          [deviceInfo.Device]: {
            ...deviceMap?.[deviceInfo.Device],
            Info: deviceInfo.Info,
          },
        });
      }
    });
  };
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
