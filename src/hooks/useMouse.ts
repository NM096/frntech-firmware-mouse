import { useEffect, useState } from 'react';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { SmurfsProfileSet, SmurfsModelConfig, SmurfsSensorInfo } from '@/lib/smurfs/smurfs.min';

export const useMouse = () => {
  const { smurfs, currentDevice } = useBaseInfoStore();
  const [profile, setProfile] = useState<SmurfsProfileSet>();
  const [modelConfig, setModelConfig] = useState<SmurfsModelConfig>();
  const [deviceSensorInfo, setDeviceSensorInfo] = useState<SmurfsSensorInfo>();

  const initMouseData = async () => {
    const profiles: SmurfsProfileSet[] = (await smurfs?.getProfiles(currentDevice!.DeviceID)) ?? [];
    profiles.forEach((element) => {
      if (element.Select) {
        setProfile(element);
        console.log('current getProfile ', element);
      }
    });

    const config = await smurfs?.getModelConfig(currentDevice!.DeviceID);
    console.log('current getModelConfig ', config);
    setModelConfig(config);

    const info = await smurfs?.getDeviceSensorInfo(currentDevice!.DeviceID);
    console.log('current getDeviceSensorInfo ', config);

    setDeviceSensorInfo(info);
  };

  useEffect(() => {
    if (smurfs) {
      initMouseData();
    }
  }, [smurfs]);
  return {
    profile,
    modelConfig,
    setProfile,
    deviceSensorInfo,
    initMouseData,
  };
};
