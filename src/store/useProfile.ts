import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Profile } from '@/types/profile';
import { cloneDeep } from 'lodash';
import defaultProfile from '@/config/profile.json';
import { apply, setDPI } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';

interface ProfileState {
  isUpgrade: boolean;
  isReset: boolean;
  upgradeProcess: number;
  profile: Profile;
  defaultProfile: Profile | null;
  setDefaultProfile: (info: Profile) => void;
  setProfile: (info: Profile) => void;
  updateProfile: () => void;
  clearProfile: () => void;
  setUpgradeProcess: (process: number) => void;
  setIsUpgrade: (isUpgrade: boolean) => void;
  setIsReset: (isReset: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      isUpgrade: false,
      isReset: false,
      upgradeProcess: 0,
      profile: cloneDeep(defaultProfile),
      defaultProfile: cloneDeep(defaultProfile),
      setDefaultProfile: (newProfile) => set({ defaultProfile: newProfile }),
      setProfile: (newProfile) => set({ profile: newProfile }),
      updateProfile: async () => {
        try {
          const { path, mode, currentDevice } = useBaseInfoStore.getState();
          // 在zustand store中，我们可以通过set函数的回调参数获取当前状态
          set(state => {
            if (path && state.profile) {
              const { LEDEffect, DPIs, USBReports, WLReports, AdvanceSetting } = state.profile;
              const { DPILevels } = currentDevice?.Info || {};
              
              // 先应用其他设置
              apply(path, state.profile);
              
              // 最后设置DPI，确保不会被其他设置覆盖
              setTimeout(() => {
                setDPI(path, mode, {
                  DPILevels: DPILevels || [],
                  DPIs: DPIs || [],
                }, () => {
                  console.log('DPI设置已应用到鼠标设备');
                });
              }, 100);
              
              console.log('配置已成功发送到鼠标设备');
            }
            return {};
          });
        } catch (error) {
          console.error('发送配置到鼠标设备失败:', error);
        }
      },
      clearProfile: () => set({ profile: cloneDeep(defaultProfile) }),
      setUpgradeProcess: (process: number) => set({ upgradeProcess: process }),
      setIsUpgrade: (isUpgrade: boolean) => set({ isUpgrade }),
      setIsReset: (isReset: boolean) => set({ isReset }),
    }),
    {
      name: 'use-profile-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
