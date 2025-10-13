import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DeviceData, DeviceInfo } from '@/types/device-data';
import type { Config } from '@/types/data-config';
import type { ModelConfig } from '@/types/device-data';
interface DeviceInfoState {
  currentConfigFileName: string;
  historyConfigFileName: string;
  isMaxWindow: boolean;
  deviceMap: DeviceData | null;
  currentModelID: string | null;
  path: string | null;
  currentDevice: DeviceInfo | null;
  mode: number;
  configData: Config | null;
  modelConfig: ModelConfig | null;
  setIsMaxWindow: (isMax: boolean) => void;
  setConfigData: (config: Config | null) => void;

  setModelConfig: (config: ModelConfig | null) => void;
  setDeviceMap: (map: DeviceData | null) => void;
  setCurrentDevice: (device: DeviceInfo | null) => void;
  clearCurrentDevice: () => void;
  setHistoryConfigFileName: (name: string) => void;
  setCurrentConfigFileName: (name: string) => void;
}

export const useBaseInfoStore = create<DeviceInfoState>()(
  persist(
    (set) => ({
      currentConfigFileName: 'profile1',
      historyConfigFileName: '',
      isMaxWindow: false,
      deviceMap: null,
      currentDevice: null,
      currentModelID: null,
      mode: 0,
      path: null,
      configData: null,
      modelConfig: null,
      setHistoryConfigFileName: (name) => set({ historyConfigFileName: name }),
      setCurrentConfigFileName: (name) => set({ currentConfigFileName: name }),
      setIsMaxWindow: (isMax) => set({ isMaxWindow: isMax }),
      setModelConfig: (config) => set({ modelConfig: config }),
      setConfigData: (config) => set({ configData: config }),
      setDeviceMap: (map) => set({ deviceMap: map }),
      setCurrentDevice: (device) =>
        set({
          currentDevice: device,
          currentModelID: device?.Model?.ModelID,
          mode: device?.Info?.Mode || 0,
          path: device?.HID?.Path || null,
        }),
      clearCurrentDevice: () => set({ currentDevice: null, currentModelID: null, mode: 0, path: null }),
    }),
    {
      name: 'base-info-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
