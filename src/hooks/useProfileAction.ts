import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { cloneDeep } from 'lodash';
import type { DeviceInfo } from '@/types/device-data';
import {
  getProfileByName,
  setCurrentProfile,
  setReportRate,
  setAdvanceSetting,
  setDPI,
  apply,
  setLE,
  setSelectProfile,
} from '@/utils/driver';
import type { Dpi, Profile } from '@/types/profile';
import { useProfileStore } from '@/store/useProfile';
const useProfileAction = () => {
  const { currentModelID, setCurrentConfigFileName, path, mode, currentDevice, modelConfig } = useBaseInfoStore();

  const { setProfile } = useProfileStore();

  const handleSelectProfile = (fileName: string, device?: DeviceInfo) => {
    const targetModelID = device?.Model?.ModelID || currentModelID;
    if (!targetModelID) {
      console.error('handleSelectProfile 缺少 ModelID');
      return;
    }
    if (fileName === '') {
      console.error('handleSelectProfile 缺少 fileName');
      return;
    }
    setCurrentConfigFileName(fileName);
    setSelectProfile(targetModelID, fileName);
    getProfileByName(targetModelID, fileName, (data) => {
      if (data) {
        // 先更新本地状态
        setProfile(data);

        // 在setCurrentProfile的回调中应用配置到鼠标，确保配置保存成功后再同步
        setCurrentProfile(targetModelID, fileName, data, (success) => {
          if (success) {
            // 配置保存成功后，将配置应用到鼠标设备
            handleApplyProfileToMouse(data, device);
            console.log('配置文件已成功同步到鼠标设备');
          } else {
            console.error('配置文件同步到鼠标设备失败');
          }
        });
      } else {
        console.error('获取配置文件失败');
      }
    });
  };

  // 增强handleApplyProfileToMouse函数，确保设置按正确顺序应用，特别是按键配置
  const handleApplyProfileToMouse = (profile: Profile, device?: DeviceInfo) => {
    const { LEDEffect, DPIs, USBReports, WLReports, AdvanceSetting, KeySet } = profile;
    const { DPILevels } = device?.Info || currentDevice?.Info || {};
    const targetPath = device?.HID?.Path || path;
    try {
      // 1. 先发送按键配置到设备，确保按键功能正确同步
      // 创建一个只包含KeySet的简化profile对象，专门用于按键配置同步
      const keyProfile = {
        ...profile,
        KeySet: KeySet || [], // 确保KeySet存在
      };

      // 首先应用按键配置，这是最关键的一步
      apply(targetPath, keyProfile, (success) => {
        if (success) {
          console.log('按键配置已成功发送到鼠标设备');

          // 2. 设置灯光效果
          if (LEDEffect) {
            setLE(targetPath, LEDEffect);
          }

          // 3. 设置回报率
          if (USBReports || WLReports) {
            setReportRate(targetPath, {
              USBReports: USBReports || [],
              WLReports: WLReports || [],
            });
          }

          // 4. 设置高级设置
          if (AdvanceSetting) {
            setAdvanceSetting(targetPath, AdvanceSetting);
          }

          // 5. 最后设置DPI，确保不会被其他设置覆盖
          setTimeout(() => {
            setDPI(
              targetPath,
              mode,
              {
                DPILevels: DPILevels || [],
                DPIs: resetDPIsValue(DPIs || [], device),
              },
              () => {
                console.log('DPI设置已应用到鼠标设备');

                // 6. 配置全部应用完成后，再次确认按键配置，确保切换稳定
                setTimeout(() => {
                  apply(targetPath, keyProfile, () => {
                    console.log('按键配置再次确认已应用到鼠标设备');
                  });
                }, 200);
              }
            );
          }, 100);
        } else {
          console.error('按键配置同步到鼠标设备失败');
        }
      });
    } catch (error) {
      console.error('应用配置到鼠标设备时发生错误:', error);
    }
  };

  const resetDPIsValue = (DPIs: Dpi[], device?: DeviceInfo) => {
    let _DPIs: Dpi[] = [];
    const { SensorInfo } = device?.Info || currentDevice?.Info || {};
    if (SensorInfo != null && SensorInfo.DPIType != 0) {
      _DPIs = cloneDeep(SensorInfo?.DPIs || []);
    } else {
      _DPIs = cloneDeep((modelConfig?.SensorInfo?.DPIs as any) || []);
    }
    return DPIs.map((dpi) => {
      const found = _DPIs.find((item) => dpi.DPI == item.DPI);
      return {
        ...dpi,
        Value: found ? found.Value : 0,
      };
    });
  };
  return {
    handleSelectProfile,
    resetDPIsValue,
  };
};

export default useProfileAction;
