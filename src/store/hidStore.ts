// src/stores/hidStore.ts
import { create } from 'zustand';
import { WebHIDTransport } from '@/utils/transports/WebHIDTransport';
import { GenericMouseAdapter } from '@/utils/adapters/GenericMouseAdapter';

interface HIDState {
  transport: WebHIDTransport | null;
  deviceAdapter: GenericMouseAdapter | null;
  isConnected: boolean;
  error: Error | null;
  connect: (filters?: HIDDeviceFilter[]) => Promise<void>;
  disconnect: () => Promise<void>;
}

/**
 * HID 设备全局状态管理
 */
export const useHIDStore = create<HIDState>((set) => ({
  transport: null,
  deviceAdapter: null,
  isConnected: false,
  error: null,

  connect: async (filters) => {
    try {
      const transport = new WebHIDTransport(filters ?? []);
      await transport.requestAndConnect();
      const adapter = new GenericMouseAdapter(transport);

      set({
        transport,
        deviceAdapter: adapter,
        isConnected: true,
        error: null,
      });
    } catch (err) {
      set({
        error: err as Error,
        isConnected: false,
      });
    }
  },

  disconnect: async () => {
    set((state) => {
      state.transport?.disconnect();
      return {
        transport: null,
        deviceAdapter: null,
        isConnected: false,
      };
    });
  },
}));
