import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DeviceData, DeviceInfo } from '@/types/device-data';
import type { Config } from '@/types/data-config';
import type { ModelConfig } from '@/types/device-data';
interface DeviceInfoState {
  deviceMap: DeviceData | null;
  currentModelID: string | null;
  path: string | null;
  currentDevice: DeviceInfo | null;
  mode: number;
  configData: Config | null;
  setConfigData: (config: Config | null) => void;

  modelConfig: ModelConfig | null;
  setModelConfig: (config: ModelConfig | null) => void;
  setDeviceMap: (map: DeviceData | null) => void;
  setCurrentDevice: (device: DeviceInfo | null) => void;
  clearCurrentDevice: () => void;
}

export const useBaseInfoStore = create<DeviceInfoState>()(
  persist(
    (set) => ({
      deviceMap: null,
      currentDevice: null,
      currentModelID: null,
      mode: 0,
      path: null,
      configData: null,
      modelConfig: null,
      setModelConfig: (config) => set({ modelConfig: config }),
      setConfigData: (config) => set({ configData: config }),
      setDeviceMap: (map) => set({ deviceMap: map }),
      setCurrentDevice: (device) =>
        set({
          currentDevice: device,
          currentModelID: device?.Model.ModelID,
          mode: device?.Info.Mode || 0,
          path: device?.HID.Path || null,
        }),
      clearCurrentDevice: () => set({ currentDevice: null, currentModelID: null, mode: 0, path: null }),
    }),
    {
      name: 'base-info-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
