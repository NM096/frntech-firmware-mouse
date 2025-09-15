export type ReportCallback = (reportId: number, data: Uint8Array) => void;

export interface ITransport {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendReport(reportId: number, data: Uint8Array, options?: { timeoutMs?: number; retry?: number }): Promise<void>;
  onInputReport(cb: ReportCallback): void;
  offInputReport(cb: ReportCallback): void;
  isConnected(): boolean;
}

class Emitter<T extends (...args: any[]) => void> {
  private handlers = new Set<T>();
  on(fn: T) {
    this.handlers.add(fn);
  }
  off(fn: T) {
    this.handlers.delete(fn);
  }
  emit(...args: Parameters<T>) {
    for (const h of Array.from(this.handlers)) {
      try {
        h(...(args as any));
      } catch (e) {
        console.error('Emitter handler error', e);
      }
    }
  }
}

export class WebHIDTransport implements ITransport {
  private device: HIDDevice | null = null;
  private inputEmitter = new Emitter<ReportCallback>();
  private connected = false;

  private sendQueue: Promise<void> = Promise.resolve();

  private filters?: HIDDeviceFilter[];
  private autoOpen: boolean;
  private onDisconnectCallback?: () => void;
  constructor(filters?: HIDDeviceFilter[], autoOpen = false) {
    this.filters = filters;
    this.autoOpen = autoOpen;
  }

  async requestAndConnect(): Promise<void> {
    if (!('hid' in navigator)) {
      throw new Error('WebHID API not available in this environment');
    }

    // 让用户选设备，但不过滤 usagePage，这样能选全套接口
    console.log('requestAndConnect... connect filters:', this.filters);
    const devices = await (navigator as any).hid.requestDevice({ filters: this.filters ?? [] });
    console.log(' ------------devices---------------', devices);

    if (!devices || devices.length === 0) {
      throw new Error('No device selected');
    }

    // 按优先级选择可发 Output Report 的接口
    const targetDevice =
      devices.find((d) =>
        d.collections?.some(
          (col) => col.outputReports && col.outputReports.length > 0 // 有 Output report 说明可发送
        )
      ) || devices[0];

    this.device = targetDevice;
    // 打印设备信息
    console.log('connect device info -----', targetDevice);
    await this.connect();
  }
  async connect(): Promise<void> {
    console.log('connecting...');
    if (!('hid' in navigator)) throw new Error('WebHID API not available in this environment');
    if (!this.device) {
      if (this.autoOpen) {
        const ds: HIDDevice[] = await (navigator as any).hid.getDevices();
        if (ds.length > 0) this.device = ds[0];
      }
      if (!this.device)
        throw new Error('No device bound to transport. Call requestAndConnect or pass device in constructor.');
    }

    if (this.device.opened) {
      this.connected = true;
      return;
    }

    await this.device.open();
    // 绑定 inputreport 事件
    (this.device as any).addEventListener('inputreport', this.handleInputReport);

    // 监听 disconnect/connect 全局事件
    (navigator as any).hid.addEventListener?.('connect', this.handleGlobalConnect as EventListener);
    (navigator as any).hid.addEventListener?.('disconnect', this.handleGlobalDisconnect as EventListener);

    this.connected = true;
  }

  private handleGlobalConnect = (ev: Event) => {
    // Optional: 上层可通过 DeviceManager 侦测到并做处理
    console.log('global hid connect', ev);
  };
  private handleGlobalDisconnect = (ev: Event) => {
    console.log('Device disconnected', ev);

    if (this.onDisconnectCallback) {
      this.onDisconnectCallback();
    }
  };

  setOnDisconnectCallback(callback: () => void) {
    this.onDisconnectCallback = callback;
  }
  private handleInputReport = (ev: HIDInputReportEvent) => {
    try {
      const reportId = ev.reportId;
      const data = new Uint8Array(ev.data.buffer);
      this.inputEmitter.emit(reportId, data);
    } catch (e) {
      console.error('Failed to handle inputreport', e);
    }
  };

  onInputReport(cb: ReportCallback): void {
    this.inputEmitter.on(cb);
  }
  offInputReport(cb: ReportCallback): void {
    this.inputEmitter.off(cb);
  }

  isConnected(): boolean {
    return this.connected && !!this.device && this.device.opened;
  }

  // sendReport: 使用队列 + 超时 + 重试
  async sendReport(
    reportId: number,
    data: Uint8Array,
    options?: { timeoutMs?: number; retry?: number }
  ): Promise<void> {
    const timeoutMs = options?.timeoutMs ?? 2000;
    const retry = options?.retry ?? 1;

    // 把每次发送排入队列，保证顺序
    this.sendQueue = this.sendQueue.then(() => this._sendReportInternal(reportId, data, timeoutMs, retry));
    console.log('sendQueue -------------', reportId, data);
    return this.sendQueue;
  }

  private async _sendReportInternal(
    reportId: number,
    data: Uint8Array,
    timeoutMs: number,
    retry: number
  ): Promise<void> {
    if (!this.device) throw new Error('Device is not set');
    if (!this.device.opened) throw new Error('Device is not opened');

    let lastErr: any = null;
    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        // sendReport 可能会 reject
        const p = (this.device as any).sendReport(reportId, data);
        await Promise.race([
          p,
          new Promise((_, rej) => setTimeout(() => rej(new Error('sendReport timeout')), timeoutMs)),
        ]);
        return; // success
      } catch (e) {
        lastErr = e;
        console.warn(`sendReport attempt ${attempt} failed`, e);
        // small backoff
        await new Promise((r) => setTimeout(r, 50 * (attempt + 1)));
      }
    }
    throw lastErr;
  }

  async disconnect(): Promise<void> {
    if (!this.device) return;
    try {
      (this.device as any).removeEventListener('inputreport', this.handleInputReport);
      await this.device.close();
    } catch (e) {
      console.warn('Error closing device', e);
    }
    this.connected = false;
  }
}
