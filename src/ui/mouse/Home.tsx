import React, { useEffect, useState } from 'react';
import smurfs from '@/lib/smurfs/smurfs.min';
import NoDevice from '@/components/ui/NoDevice';
import type { SmurfsDeviceList, SmurfsProfileSet } from '@/lib/smurfs/smurfs.min';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import Feature from './Feature';
const Home: React.FC = () => {
  const [deviceList, setDeviceList] = useState<SmurfsDeviceList>();

  const { setCurrentDevice, setSmurfs } = useBaseInfoStore();
  const Smurfs = smurfs.create({ softwareVersion: '1.0.0', adapter: 'go' });
  const initDeviceList = async () => {
    Smurfs.run();
    const deviceList = await Smurfs.getDeviceList();
    const currentDevice = deviceList[Object.keys(deviceList)[0]];
    setDeviceList(deviceList);
    setCurrentDevice(currentDevice);
    const profileList: SmurfsProfileSet[] = await Smurfs.getProfiles(currentDevice.DeviceID);
    const profile: SmurfsProfileSet[] = await Smurfs.getProfile(currentDevice.DeviceID, 'Profile1');
    console.log(profileList);
    console.log(profile);
    // 首次进入没有Profile，补全Profile

    if (profileList.length < 4) {
      let _num = profileList.length;
      while (_num < 4) {
        _num++;
        console.log(_num);
        await Smurfs.addProfile(currentDevice.DeviceID, 'Profile' + _num);
      }
    }
    setSmurfs(Smurfs);
  };
  useEffect(() => {
    initDeviceList();
  }, []);
  return (
    <div className="home-page-container">
      {deviceList && Object.keys(deviceList).length > 0 ? <Feature /> : <NoDevice />}
    </div>
  );
};

export default Home;
