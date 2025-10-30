import React from 'react';

import Power from '@/components/common/PowerIcon';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { DeviceInfo } from '@/types/device-data';
import { useProfileStore } from '@/store/useProfile';
import useBatteryProgress from '@/hooks/useBatteryProgress';
import { useTranslation } from 'react-i18next';
import {
  getProfileByName,
  getModelProfile,
  setCurrentProfile,
  getConfigData,
  getModelConfig,
  setSelectProfile,
} from '@/utils/driver';
import { cloneDeep } from 'lodash';
import useProfileAction from '@/hooks/useProfileAction';

const baseUrl = import.meta.env.BASE_URL;

const DeviceList = () => {
  const {
    deviceMap,
    setCurrentDevice,
    setConfigData,
    setModelConfig,
    currentConfigFileName,
    setCurrentConfigFileName,
  } = useBaseInfoStore();
  const { setDefaultProfile } = useProfileStore();
  const { setProfile } = useProfileStore();
  const { getBatteryIcon } = useBatteryProgress();
  const { handleSelectProfile } = useProfileAction();
  const { t } = useTranslation();

  // 点击设备，设置当前设备和配置文件
  const handleSetProfile = (key: string, device: DeviceInfo) => {
    const currentModelID = device.Model?.ModelID;
    if (device.HID) {
      device.HID.Path = key;
    }
    const ModelID = device.Model?.ModelID;
    setCurrentDevice(device);
    getProfileByName(ModelID, currentConfigFileName, (payload) => {
      if (!payload) {
        getModelProfile(ModelID, (profilePayload) => {
          console.log(profilePayload);
          setCurrentProfile(ModelID, currentConfigFileName, profilePayload, () => {
            // setSelectProfile(ModelID, currentConfigFileName);
            // setCurrentConfigFileName(currentConfigFileName);
            handleSelectProfile(currentConfigFileName, device);
          });
          setProfile(cloneDeep(profilePayload));
        });
      } else {
        setProfile(cloneDeep(payload));
        handleSelectProfile(payload.Name, device);
      }
    });
    // 获取默认配置
    getModelProfile(currentModelID, (payload) => {
      setDefaultProfile(payload);
    });
    // 获取設備数据
    getConfigData(key, (payload) => {
      setConfigData(payload);
    });
    getModelConfig(currentModelID, (payload) => {
      setModelConfig(payload);
    });
  };
  return (
    <div className="device-list">
      {deviceMap &&
        Object.keys(deviceMap)
          .filter((key) => {
            if (deviceMap[key].Info !== null) {
              if (deviceMap[key].RFDevice) {
                return deviceMap[key].Info?.Mouse?.Online;
              } else {
                return true;
              }
            }
          })
          .map((key) => {
            const device = deviceMap[key];
            return (
              <div
                className="device-card"
                key={key}
                onClick={() => {
                  handleSetProfile(key, device);
                }}
              >
                <div className="device-overlay"></div>
                <div className="device-name">{device?.Model?.Name}</div>
                <div className="device-status">
                  {/* <Power className="power-small" />
                  <span className="battery-text">100%</span> */}
                  <div className="device-item-power">
                    <img src={getBatteryIcon(device!)} alt="battery" className="device-icon-power" />
                    {/* <HoverImage src={ic_charge} hoverSrc={ic_charge} alt="Logo" className="sidebar-icon-connection" /> */}
                    {!device?.RFDevice || device?.Info?.Mouse?.Charge ? t('charging') : t('used_battery_n')}
                    {/* : t('used_battery', { count: device?.Info?.Mouse?.Battery || 5 })} */}
                  </div>
                </div>
                <div className="device-container">
                  <img
                    src={`${baseUrl}device/${device?.Model?.ModelID}/img/mouse.png`}
                    alt={device?.Model?.Name}
                    className="device-img"
                  />
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default DeviceList;
