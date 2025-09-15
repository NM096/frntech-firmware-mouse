// src/hooks/useWebHID.ts
import { create } from 'zustand';
import { WebHIDTransport } from '@/utils/transports/WebHIDTransport';
import { GenericMouseAdapter } from '@/utils/adapters/GenericMouseAdapter';
import { useState, useCallback } from 'react';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { GenericBootAdapter } from '@/utils/adapters/GenericBootAdapter';
interface HIDState {
  transport: WebHIDTransport | null;
  deviceAdapter: GenericMouseAdapter | null;
  isConnected: boolean;
  error: Error | null;
  connect: (filters?: HIDDeviceFilter[]) => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useGlobalHIDStore = create<HIDState>((set) => ({
  transport: null,
  deviceAdapter: null,
  isConnected: false,
  error: null,

  connect: async (filters) => {
    try {
      console.log('filters connect ', filters);
      const transport = new WebHIDTransport(filters ?? []);
      await transport.requestAndConnect();

      const adapter = new GenericMouseAdapter(transport);
      transport.setOnDisconnectCallback(() => {
        set({ isConnected: false });
      });
      await adapter.init();
      set({
        transport,
        deviceAdapter: adapter,
        isConnected: true,
        error: null,
      });
      // const { setBaseInfo } = useBaseInfoStore.getState();
      // const info = await adapter.getDeviceInfo();
      // setBaseInfo(info || {});
      // console.log('Device Info:', info);
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

interface UseHIDOptions {
  filters?: HIDDeviceFilter[];
  global?: boolean;
}
export function useWebHID({ filters, global }: UseHIDOptions = {}) {
  // 全局 store（总是执行）
  const globalStore = useGlobalHIDStore();

  // 本地模式 Hooks（也必须总是执行）
  const [transport, setTransport] = useState<WebHIDTransport | null>(null);
  const [deviceAdapter, setDeviceAdapter] = useState<GenericMouseAdapter | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    if (global) {
      return globalStore.connect(filters);
    }
    try {
      console.log('filters connect ', filters);
      const newTransport = new WebHIDTransport(filters ?? []);
      await newTransport.requestAndConnect();
      const adapter = new GenericMouseAdapter(newTransport);

      newTransport.setOnDisconnectCallback(() => {
        setIsConnected(false);
      });
      setTransport(newTransport);
      setDeviceAdapter(adapter);
      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    }
  }, [filters, global, globalStore]);

  const disconnect = useCallback(async () => {
    if (global) {
      return globalStore.disconnect();
    }
    if (transport) {
      await transport.disconnect();
      setTransport(null);
      setDeviceAdapter(null);
      setIsConnected(false);
    }
  }, [global, globalStore, transport]);

  // 根据模式返回
  return global ? globalStore : { connect, disconnect, transport, deviceAdapter, isConnected, error };
}

export function useBootWebHid({ filters }: UseHIDOptions = {}) {
  const [transport, setTransport] = useState<WebHIDTransport | null>(null);
  const [deviceAdapter, setDeviceAdapter] = useState<GenericBootAdapter | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    console.log(filters);
    try {
      const newTransport = new WebHIDTransport(filters ?? []);
      await newTransport.requestAndConnect();
      const adapter = new GenericBootAdapter(newTransport);
      adapter.init();
      await adapter.CMD_GetDeviceInfo();

      newTransport.setOnDisconnectCallback(() => {
        setIsConnected(false);
      });
      setTransport(newTransport);
      setDeviceAdapter(adapter);
      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    }
  }, [filters]);

  const disconnect = useCallback(async () => {
    if (transport) {
      await transport.disconnect();
      setTransport(null);
      setDeviceAdapter(null);
      setIsConnected(false);
    }
  }, [transport]);

  // 根据模式返回
  return { connect, disconnect, transport, deviceAdapter, isConnected, error };
}

// const { connect, disconnect, isConnected } = useWebHID({
//   filters: [{ vendorId: 0x1234, productId: 0x5678 }],
// });

// const { connect, disconnect, isConnected } = useWebHID({
//   filters: [{ vendorId: 0x1234, productId: 0x5678 }],
//   global: true,
// });
