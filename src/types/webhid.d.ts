interface HIDDevice {
  opened: boolean;
  vendorId: number;
  productId: number;
  productName: string;
  collections: any[];
  open(): Promise<void>;
  close(): Promise<void>;
  sendReport(reportId: number, data: BufferSource): Promise<void>;
  sendFeatureReport(reportId: number, data: BufferSource): Promise<void>;
  receiveFeatureReport(reportId: number): Promise<DataView>;
  addEventListener(type: 'inputreport', listener: (event: HIDInputReportEvent) => void): void;
  removeEventListener(type: 'inputreport', listener: (event: HIDInputReportEvent) => void): void;
}

interface HIDInputReportEvent extends Event {
  device: HIDDevice;
  reportId: number;
  data: DataView;
}

interface HIDDeviceFilter {
  vendorId?: number;
  productId?: number;
  usagePage?: number;
  usage?: number;
}

interface Navigator {
  readonly hid: {
    getDevices(): Promise<HIDDevice[]>;
    requestDevice(options: { filters: HIDDeviceFilter[] }): Promise<HIDDevice[]>;
    addEventListener(type: 'connect' | 'disconnect', listener: (event: Event) => void): void;
    removeEventListener(type: 'connect' | 'disconnect', listener: (event: Event) => void): void;
  };
}
