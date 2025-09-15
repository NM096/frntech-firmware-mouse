// =========================
// GenericMouseAdapter.ts
// =========================

import { BaseAdapter } from './BaseAdapter';
import type { DeviceInfo, AdvanceSetting } from '../../types/device';
import type { Profile } from '../../types/profile';

const globalBuffer: Record<string, { data: Uint8Array; time: number }[]> = {};
const eventWaitBuffer: Record<string, ((msg: { data: Uint8Array }) => void)[]> = {};

export class GenericBootAdapter extends BaseAdapter {
  private path: string;

  constructor(transport: any) {
    super(transport);
    this.reportId = 0x00;
    this.path = `${transport.vendorId}:${transport.productId}`;
    if (!globalBuffer[this.path]) {
      globalBuffer[this.path] = [];
      eventWaitBuffer[this.path] = [];
    }
  }

  protected parseInputReport(reportId: number, data: Uint8Array): void {
    console.log('-------parseInputReport----------', reportId, data);
    if (reportId == this.reportId) {
      const msg = { data: data, time: Date.now() };
      globalBuffer[this.path].push(msg);
      if (eventWaitBuffer[this.path].length > 0) {
        const waiter = eventWaitBuffer[this.path].shift();
        if (waiter) waiter(msg);
      }
    }
  }

  protected calcChecksum16(data: Uint8Array): number {
    const len = data.length;
    let checksum = 0xfa21;
    for (let i = 0; i < len; i = i + 2) {
      checksum += data[i] | (data[i + 1] << 8);
      checksum = checksum & 0xffff;
    }
    return checksum;
  }

  async setReset(): Promise<boolean> {
    return false;
  }

  async getDeviceInfo(): Promise<DeviceInfo | null> {
    return null;
  }

  async getDPI(): Promise<{ Level: number; DPI: number; Value: number }[] | null> {
    return null;
  }

  async setLighting(_config: {
    mode: number;
    brightness: number;
    speed: number;
    direction: number;
    color: number;
  }): Promise<boolean> {
    return false;
  }

  async setDPI(_dpis: { Level: number; DPI: number; Value: number }[]): Promise<boolean> {
    return false;
  }

  async setKeyDefine(_profile: Profile): Promise<boolean> {
    return false;
  }

  async setDPILevel(_mode: number, _level: number): Promise<boolean> {
    return false;
  }

  async setReport(_mode: number, _usbReport: number, _wlReport: number): Promise<boolean> {
    return false;
  }

  async setMode(_mode: number): Promise<boolean> {
    return false;
  }

  async setAdvanceSetting(_advance: AdvanceSetting): Promise<boolean> {
    return false;
  }

  async CMD_GetDeviceInfo(): Promise<DeviceInfo | null> {
    const info: DeviceInfo = {};
    const payload = new Uint8Array(32);

    payload[0] = 0x0e;
    payload[1] = 0x20;

    const read = await this.writeAndRead(payload);
    console.log('read -----------', read);
    if (read.data && (read.data[0] != payload[0] || read.data[1] != payload[1])) {
      return null;
    }

    info.FWID = 0;
    info.FWID |= read.data[2] << (0 * 8);
    info.FWID |= read.data[3] << (1 * 8);
    info.FWID |= read.data[4] << (2 * 8);
    info.FWID |= read.data[5] << (3 * 8);
    info.FWVersion = 0;
    info.FWVersion |= read.data[6] << (1 * 8);
    info.FWVersion |= read.data[7] << (0 * 8);

    return info;
  }

  async CMD_ReadFlash(addr: number, len: number): Promise<Uint8Array | null> {
    const payload = new Uint8Array(32);

    payload[0] = 0x0e;
    payload[1] = 0x12;
    payload[2] = addr & 0xff;
    payload[3] = (addr >> 8) & 0xff;
    payload[4] = len & 0xff;

    const read = await this.writeAndRead(payload);
    if (read.data && (read.data[0] != payload[0] || read.data[1] != payload[1])) {
      return null;
    }

    return read.data.slice(4);
  }

  async CMD_WriteFIFO(addr: number, data: Uint8Array): Promise<boolean> {
    const len = data.length;
    if (len > 28) {
      return false;
    }

    const payload = new Uint8Array(32);

    payload[0] = 0x0e;
    payload[1] = 0x11;
    payload[2] = addr;
    payload[3] = len;

    for (let i = 0; i < len; i++) {
      payload[4 + i] = data[i];
    }

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0] && read.data[1] == payload[1] && read.data[2] == payload[2]) {
      return true;
    }

    return false;
  }

  async CMD_WriteFlash(addr: number, len: number, checksum: number): Promise<boolean> {
    const payload = new Uint8Array(32);

    payload[0] = 0x0e;
    payload[1] = 0x10;
    payload[2] = addr & 0xff;
    payload[3] = (addr >> 8) & 0xff;
    payload[4] = len;
    payload[5] = 0xa5;
    payload[6] = checksum & 0xff;
    payload[7] = (checksum >> 8) & 0xff;

    const read = await this.writeAndRead(payload);
    if (
      read.data &&
      read.data[0] == payload[0] &&
      read.data[1] == payload[1] &&
      read.data[2] == payload[2] &&
      read.data[3] == payload[3] &&
      read.data[4] == payload[4] &&
      read.data[5] == 0x01
    ) {
      return true;
    }

    return false;
  }

  async CMD_BeginUpgrade(): Promise<boolean> {
    const payload = new Uint8Array(32);

    payload[0] = 0x0e;
    payload[1] = 0x13;
    payload[2] = 0x5a;
    payload[3] = 0xa5;

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0] && read.data[1] == payload[1] && read.data[5] == 0x01) {
      return true;
    }

    return false;
  }

  async CMD_EndUpgrade(appSize: number, flashSize: number, appCS: number, flashCS: number): Promise<boolean> {
    const payload = new Uint8Array(32);

    payload[0] = 0x0e;
    payload[1] = 0x14;
    payload[2] = appSize & 0xff;
    payload[3] = (appSize >> 8) & 0xff;
    payload[4] = flashSize & 0xff;
    payload[5] = (flashSize >> 8) & 0xff;
    payload[6] = appCS & 0xff;
    payload[7] = (appCS >> 8) & 0xff;
    payload[8] = flashCS & 0xff;
    payload[9] = (flashCS >> 8) & 0xff;

    const read = await this.writeAndRead(payload);
    if (
      read.data &&
      read.data[0] == payload[0] &&
      read.data[1] == payload[1] &&
      read.data[2] == payload[2] &&
      read.data[3] == payload[3] &&
      read.data[4] == payload[4] &&
      read.data[5] == payload[5] &&
      read.data[6] == payload[6] &&
      read.data[7] == payload[7] &&
      read.data[8] == payload[8] &&
      read.data[9] == payload[9]
    ) {
      return true;
    }

    return false;
  }

  async CMD_App(): Promise<boolean> {
    const payload = new Uint8Array(32);

    payload[0] = 0x0e;
    payload[1] = 0x1e;
    payload[2] = 0x5a;
    payload[3] = 0xa5;

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0] && read.data[1] == payload[1] && read.data[2] == 0x01) {
      return true;
    }

    return false;
  }

  async WriteFIFO(data: Uint8Array): Promise<boolean> {
    const count = data.length;
    let index = 0;

    while (index < count) {
      let len = count - index;
      if (len > 28) {
        len = 28;
      }

      const wdata = data.slice(index, index + len);
      if (!(await this.CMD_WriteFIFO(index, wdata))) {
        return false;
      }

      index += len;
    }

    return true;
  }

  /*

  固件升级
  import binUrl from '@/config/TMKB-M1/firmware.bin?url';
  const data = await fetch(binUrl).then(r => r.arrayBuffer());
  const uint8Array = new Uint8Array(data);
  async upgradeFireware(fileContent: Uint8Array, callback: (progress:number) => void): Promise<boolean> {
  */
  async upgradeFireware(fileContent: Uint8Array, callback: (progress: number) => void): Promise<boolean> {
    const readFlashMax: number = 28;
    let BootID: number = 0;
    let flashSize: number = 0;
    let appSize: number = 0;
    let fifoSize: number = 0;
    let sendBeginEnd: boolean = false;
    let chackAll: boolean = false;

    const info = await this.CMD_GetDeviceInfo();
    if (info != null) {
      BootID = info?.FWID || 0 & 0xffffff00;
      if (BootID == 0x00960000 || BootID == 0x00920000) {
        appSize = 28 * 1024;
        fifoSize = 128;
        sendBeginEnd = false;
        chackAll = true;
      } else if (BootID == 0x0071ff00 || BootID == 0x0166ff00) {
        flashSize = 50 * 1024;
        appSize = 44 * 1024;
        fifoSize = 256;
        sendBeginEnd = true;
        chackAll = true;
      }
    } else {
      appSize = 44 * 1024;
      fifoSize = 256;
      sendBeginEnd = false;
      chackAll = false;
    }

    if (fileContent.length > appSize) {
      return false;
    }

    const addrBegin: number = 0xb700;
    const addrEnd: number = 0xb700;
    const readData = new Uint8Array(addrEnd - addrBegin).fill(0xff);
    if (BootID == 0x0166ff00) {
      let addr: number = addrBegin;
      while (addr < addrEnd) {
        let len: number = addrEnd - addr;
        if (len > readFlashMax) {
          len = readFlashMax;
        }

        const data = await this.CMD_ReadFlash(addr, len);
        if (data == null) {
          return false;
        }

        readData.set(data, addr - addrBegin);

        addr += len;
      }
    }

    if (sendBeginEnd) {
      const result = await this.CMD_BeginUpgrade();
      if (!result) {
        return false;
      }
    }

    const count: number = fileContent.length;
    let index: number = 0;
    let progress: number = -1;
    while (index < count) {
      let len: number = count - index;
      if (len > fifoSize) {
        len = fifoSize;
      }

      const wdata = fileContent.slice(index, index + len);
      const result = await this.WriteFIFO(wdata);
      if (!result) {
        return false;
      }

      const checksum = this.calcChecksum16(wdata);
      if (!(await this.CMD_WriteFlash(index, len, checksum))) {
        return false;
      }

      index += len;

      let newProgress: number = (index * 50) / count;
      if (newProgress != progress) {
        progress = newProgress;
        callback(progress);
      }
    }

    index = 0;
    const rdata = new Uint8Array(count).fill(0xff);
    while (index < count) {
      let len: number = count - index;
      if (len > readFlashMax) {
        len = readFlashMax;
      }

      if (index + len > rdata.length) {
        console.error(`index + len exceeds rdata length: index=${index}, len=${len}, rdata.length=${rdata.length}`);
        len = rdata.length - index; // adjust len to prevent overflow
      }
      const data = await this.CMD_ReadFlash(index, len);
      if (data == null) {
        return false;
      }
      if (data.length > rdata.length - index) {
        rdata.set(data.slice(0, rdata.length - index));
      } else {
        rdata.set(data, index);
      }

      index += len;

      let newProgress: number = 50 + (index * 50) / count;
      if (newProgress != progress) {
        progress = newProgress;
        callback(progress);
      }
    }

    if (chackAll) {
      if (fileContent.length !== rdata.length && fileContent.some((value, index) => value !== rdata[index])) {
        return false;
      }
    } else {
      const data1 = fileContent.slice(8);
      const data2 = rdata.slice(8);
      if (data1.length !== data2.length && data1.some((value, index) => value !== data2[index])) {
        return false;
      }
    }

    if (BootID == 0x0166ff00) {
      let addr: number = addrBegin;
      while (addr < addrEnd) {
        let len: number = addrEnd - addr;
        if (len > fifoSize) {
          len = fifoSize;
        }

        const wdata = readData.slice(addr, addr + len);
        const result = await this.WriteFIFO(wdata);
        if (!result) {
          return false;
        }

        const checksum = this.calcChecksum16(wdata);
        if (!(await this.CMD_WriteFlash(index, len, checksum))) {
          return false;
        }

        addr += len;
      }

      addr = addrBegin;
      const rData = new Uint8Array(addrEnd - addrBegin).fill(0xff);
      while (addr < addrEnd) {
        let len: number = addrEnd - addr;
        if (len > readFlashMax) {
          len = readFlashMax;
        }

        const data = await this.CMD_ReadFlash(addr, len);
        if (data == null) {
          return false;
        }

        rData.set(data, addr - addrBegin);

        addr += len;
      }

      if (readData.length !== rdata.length && readData.some((value, index) => value !== rdata[index])) {
        return false;
      }
    }

    if (sendBeginEnd) {
      const fillApp = new Uint8Array(appSize - fileContent.length).fill(0xff);
      const appData = new Uint8Array([...fileContent, ...fillApp]);
      const appCS = this.calcChecksum16(appData);

      const fillFlash = new Uint8Array(flashSize - appData.length).fill(0xff);
      const flashData = new Uint8Array([...appData, ...fillFlash]);
      if (BootID == 0x0166ff00) {
        flashData.set(readData, addrBegin);
      }
      const flashCS = this.calcChecksum16(flashData);

      const result = await this.CMD_EndUpgrade(appSize, flashSize, appCS, flashCS);
      if (!result) {
        return false;
      }
    }

    const result = await this.CMD_App();
    if (!result) {
      return false;
    }

    return true;
  }

  async writeAndRead(data: Uint8Array, timeout = 2000): Promise<{ data: Uint8Array }> {
    return new Promise((resolve, reject) => {
      try {
        const waiters = eventWaitBuffer[this.path] || [];
        eventWaitBuffer[this.path] = waiters;

        let timeoutId: any = null;

        const callback = (msg: { data: Uint8Array }) => {
          clearTimeout(timeoutId);
          const idx = waiters.indexOf(callback);
          if (idx !== -1) waiters.splice(idx, 1);
          resolve(msg);
        };

        // 直接挂回调，不再提前 return
        waiters.push(callback);

        timeoutId = setTimeout(() => {
          const idx = waiters.indexOf(callback);
          if (idx !== -1) waiters.splice(idx, 1);
          reject(new Error(`writeAndRead timeout after ${timeout}ms`));
        }, timeout);

        // 永远都发命令
        (async () => {
          try {
            await this.sendCommand(data);
          } catch (err) {
            clearTimeout(timeoutId);
            const idx = waiters.indexOf(callback);
            if (idx !== -1) waiters.splice(idx, 1);
            reject(err);
          }
        })();
      } catch (err) {
        reject(err);
      }
    });
  }
}

// =========================
// 使用示例
// =========================
/*
import { WebHIDTransport } from "./WebHIDreportID";
import { GenericMouseAdapter } from "./GenericMouseAdapter";

const transport = new WebHIDTransport([{ vendorId: 0x1234, productId: 0x5678 }]);
await transport.requestAndConnect();
const mouse = new GenericMouseAdapter(transport);
await mouse.init();

await mouse.setLighting({ r: 255, g: 0, b: 0, mode: 1 });
await mouse.setDPI(1600);
await mouse.setMacro({ id: 1, keys: [0x04, 0x05, 0x06] });
*/
