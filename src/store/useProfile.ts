import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Profile } from '@/types/profile';
import { cloneDeep } from 'lodash';
import defaultProfile from '@/config/profile.json';

interface ProfileState {
  profile: Profile;
  defaultProfile: Profile | null;
  setDefaultProfile: (info: Profile) => void;
  setProfile: (info: Profile) => void;
  updateProfile: () => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: cloneDeep(defaultProfile),
      defaultProfile: cloneDeep(defaultProfile),
      setDefaultProfile: (newProfile) => set({ defaultProfile: newProfile }),
      setProfile: (newProfile) => set({ profile: newProfile }),
      updateProfile: async () => {},
      clearProfile: () => set({ profile: cloneDeep(defaultProfile) }),
    }),
    {
      name: 'use-profile-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
