import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import NoDevice from '@/components/ui/NoDevice';
import DeviceList from '@/components/ui/DeviceList';
import Feature from '@/components/ui/Feature';
import { getDeviceList, listenDriverMessage, onDriverMessage } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { DeviceData } from '@/types/device-data';
const Home: React.FC = () => {
  const { deviceMap, setDeviceMap, currentDevice, path, clearCurrentDevice, setCurrentDevice } = useBaseInfoStore();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    getDeviceList((deviceList: any) => {
      if (hasCanSelectedDevice(deviceList)) {
        const filteredList = Object.keys(deviceList)
          .filter((key) => deviceList[key].Model.Type !== 'Dongle')
          .map((key) => ({ [key]: deviceList[key] }))
          .reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setDeviceMap(filteredList as DeviceData);
      }
      setConnected(hasCanSelectedDevice(deviceList));
    });
    listenChangeDeviceList();
    listenChangeDeviceInfo();
    listenDriverMessage();
  }, []);
  const hasCanSelectedDevice = (deviceList: any): boolean => {
    if (Object.keys(deviceList).length !== 0) {
      const usbDeviceLength = Object.keys(deviceList).filter(
        (key) => !deviceList[key].RFDevice && deviceList[key].Model.Type !== 'Dongle'
      ).length;
      if (usbDeviceLength > 0) {
        return true;
      }
      const g24DeviceKeys = Object.keys(deviceList).filter((key) => deviceList[key].RFDevice);
      const hasG24DeviceOnline = g24DeviceKeys.map((key) => deviceList[key].Info?.Mouse?.Online).includes(true);
      console.log('G24 online status:', hasG24DeviceOnline);
      return hasG24DeviceOnline;
    }
    return false;
  };
  const listenChangeDeviceList = () => {
    console.log('Start listening device list change');
    onDriverMessage('DeviceListChanged', (deviceList) => {
      const filteredList = Object.keys(deviceList)
        .filter((key) => deviceList[key].Model.Type !== 'Dongle')
        .map((key) => ({ [key]: deviceList[key] }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setDeviceMap(filteredList as DeviceData);
      setConnected(hasCanSelectedDevice(deviceList));
      if (!deviceList[path!]) {
        clearCurrentDevice();
      }
    });
  };
  const listenChangeDeviceInfo = () => {
    onDriverMessage('DeviceChanged', (deviceInfo) => {
      const { deviceMap, currentDevice, path } = useBaseInfoStore.getState();
      const hasStoreDevice = Object.keys(deviceMap || {}).includes(deviceInfo.Device);
      if (hasStoreDevice) {
        const _newDeviceMap = {
          ...deviceMap,
          [deviceInfo.Device]: {
            ...deviceMap?.[deviceInfo.Device],
            Info: deviceInfo.Info,
          },
        };
        if (path == deviceInfo.Device) {
          setCurrentDevice({
            ...currentDevice,
            Info: deviceInfo.Info,
          });
        }
        setConnected(hasCanSelectedDevice(_newDeviceMap));
        setDeviceMap(_newDeviceMap);
        console.log('change connect status', path, deviceInfo.Device);
        if (path === deviceInfo.Device) {
          console.log('Current device info updated:', deviceInfo, _newDeviceMap, hasCanSelectedDevice(_newDeviceMap));
          setConnected(hasCanSelectedDevice(_newDeviceMap));
        }
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
