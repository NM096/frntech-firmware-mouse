import React from 'react';

import Power from '@/components/common/PowerIcon';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { DeviceInfo } from '@/types/device-data';
import { useProfileStore } from '@/store/useProfile';
import { getCurrentProfile, getModelProfile, setCurrentProfile, getConfigData, getModelConfig } from '@/utils/driver';
import { cloneDeep } from 'lodash';
import { KeySquare } from 'lucide-react';
const baseUrl = import.meta.env.BASE_URL;

const DeviceList = () => {
  const { deviceMap, setCurrentDevice, setConfigData, setModelConfig } = useBaseInfoStore();
  const { setDefaultProfile } = useProfileStore();
  const { setProfile } = useProfileStore();

  // 点击设备，设置当前设备和配置文件
  const handleSetProfile = (device: DeviceInfo) => {
    const { ModelID: currentModelID } = device.Model;
    const { Path: path } = device.HID;
    const { ModelID } = device.Model;
    setCurrentDevice(device);
    getCurrentProfile(ModelID, (payload) => {
      if (!payload) {
        getModelProfile(ModelID, (profilePayload) => {
          setCurrentProfile(ModelID, profilePayload);
          setProfile(cloneDeep(profilePayload));
        });
      } else {
        setProfile(cloneDeep(payload));
      }
    });
    // 获取默认配置
    getModelProfile(currentModelID, (payload) => {
      setDefaultProfile(payload);
    });
    // 获取設備数据
    getConfigData(path, (payload) => {
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
            if (deviceMap[key].Info != null) {
              if (deviceMap[key].RFDevice) {
                if (deviceMap[key].Mouse?.Online) return key;
              } else {
                return key;
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
                  handleSetProfile(device);
                }}
              >
                <div className="device-overlay"></div>
                <div className="device-name">{device?.Model?.Name}</div>
                <div className="device-status">
                  <Power className="power-small" />
                  <span className="battery-text">100%</span>
                </div>
                <img
                  src={`${baseUrl}device/${device?.Model?.ModelID}/img/mouse.png`}
                  alt={device?.Model?.Name}
                  className="device-img"
                />
              </div>
            );
          })}
    </div>
  );
};

export default DeviceList;
