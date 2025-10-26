import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import NoDevice from '@/components/ui/NoDevice';
import DeviceList from '@/components/ui/DeviceList';
import Feature from '@/components/ui/Feature';
import { getDeviceList, listenDriverMessage, onDriverMessage } from '@/utils/driver';
import { useProfileStore } from '@/store/useProfile';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { DeviceData } from '@/types/device-data';
import { useListenMouse } from '@/hooks/useListenMouse';
import { TestInfo } from './TestInfo';
import useProfileAction from '@/hooks/useProfileAction';
const Home: React.FC = () => {
  const { deviceMap, setDeviceMap, currentDevice, currentModelID, path, clearCurrentDevice, setCurrentDevice } =
    useBaseInfoStore();
  const { setUpgradeProcess } = useProfileStore();
  const [connected, setConnected] = useState(false);
  const { listenChangeProfileAppActive, listenChangeProfileAppInactive } = useListenMouse();

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
  }, []);
  useEffect(() => {
    listenChangeDeviceList();
    listenChangeDeviceInfo();
    listenUpgradeProgress();
    listenDriverMessage();
    listenChangeProfileAppActive();
    listenChangeProfileAppInactive();
  }, [currentModelID]);
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

      const { isReset, isUpgrade } = useProfileStore.getState();
      console.log('isUpgrade,isReset', isUpgrade, isReset);
      if (isReset && deviceList[path!]) {
        setCurrentDevice(deviceList[path!] as DeviceData);
      }
      if (!isReset) {
        setConnected(hasCanSelectedDevice(deviceList));
      }
      if (!deviceList[path!] && !isUpgrade && !isReset) {
        clearCurrentDevice();
      }
    });
  };

  const listenUpgradeProgress = () => {
    onDriverMessage('UpgradeProgress', (payload) => {
      console.log('Upgrade progress payload:', payload);
      setUpgradeProcess(payload?.Progress || 0);
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
            // Info: deviceInfo.Info || {},
            Info: TestInfo,
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
