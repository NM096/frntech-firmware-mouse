import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Smurfs, SmurfsDevice } from '@/lib/smurfs/smurfs.min';
interface DeviceInfoState {
  smurfs: Smurfs | null;
  setSmurfs: (smurfs: Smurfs) => void;
  currentDevice: SmurfsDevice | null;
  setCurrentDevice: (device: SmurfsDevice) => void;
}

export const useBaseInfoStore = create<DeviceInfoState>()(
  persist(
    (set) => ({
      smurfs: null,
      setSmurfs: (smurfs) => {
        set({
          smurfs,
        });
      },
      currentDevice: null,
      setCurrentDevice: (currentDevice) => {
        set({
          currentDevice,
        });
      },
    }),
    {
      name: 'base-info-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
