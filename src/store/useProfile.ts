import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Profile } from '@/types/profile';
import { cloneDeep } from 'lodash';
import defaultProfile from '@/config/profile.json';

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
      updateProfile: async () => {},
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
