// =========================
// GenericMouseAdapter.ts
// =========================

import { BaseAdapter } from './BaseAdapter';
import type { DeviceInfo, LEDEffect, AdvanceSetting } from '../../types/device';
import type { Profile, MacroContent } from '../../types/profile';

const globalBuffer: Record<string, { data: Uint8Array; time: number }[]> = {};
const eventWaitBuffer: Record<string, ((msg: { data: Uint8Array }) => void)[]> = {};

export class GenericMouseAdapter extends BaseAdapter {
  private path: string;
  private macroOPMap = new Map([
    ['KeyA', 0x0004],
    ['KeyB', 0x0005],
    ['KeyC', 0x0006],
    ['KeyD', 0x0007],
    ['KeyE', 0x0008],
    ['KeyF', 0x0009],
    ['KeyG', 0x000a],
    ['KeyH', 0x000b],
    ['KeyI', 0x000c],
    ['KeyJ', 0x000d],
    ['KeyK', 0x000e],
    ['KeyL', 0x000f],
    ['KeyM', 0x0010],
    ['KeyN', 0x0011],
    ['KeyO', 0x0012],
    ['KeyP', 0x0013],
    ['KeyQ', 0x0014],
    ['KeyR', 0x0015],
    ['KeyS', 0x0016],
    ['KeyT', 0x0017],
    ['KeyU', 0x0018],
    ['KeyV', 0x0019],
    ['KeyW', 0x001a],
    ['KeyX', 0x001b],
    ['KeyY', 0x001c],
    ['KeyZ', 0x001d],
    ['Digit1', 0x001e],
    ['Digit2', 0x001f],
    ['Digit3', 0x0020],
    ['Digit4', 0x0021],
    ['Digit5', 0x0022],
    ['Digit6', 0x0023],
    ['Digit7', 0x0024],
    ['Digit8', 0x0025],
    ['Digit9', 0x0026],
    ['Digit0', 0x0027],
    ['Enter', 0x0028],
    ['Escape', 0x0029],
    ['Backspace', 0x002a],
    ['Tab', 0x002b],
    ['Space', 0x002c],
    ['Minus', 0x002d],
    ['Equal', 0x002e],
    ['BracketLeft', 0x002f],
    ['BracketRight', 0x0030],
    ['Backslash', 0x0031],
    ['Semicolon', 0x0033],
    ['Quote', 0x0034],
    ['Backquote', 0x0035],
    ['Comma', 0x0036],
    ['Period', 0x0037],
    ['Slash', 0x0038],
    ['CapsLock', 0x0039],
    ['F1', 0x003a],
    ['F2', 0x003b],
    ['F3', 0x003c],
    ['F4', 0x003d],
    ['F5', 0x003e],
    ['F6', 0x003f],
    ['F7', 0x0040],
    ['F8', 0x0041],
    ['F9', 0x0042],
    ['F10', 0x0043],
    ['F11', 0x0044],
    ['F12', 0x0045],
    ['PrintScreen', 0x0046],
    ['ScrollLock', 0x0047],
    ['Pause', 0x0048],
    ['Insert', 0x0049],
    ['Home', 0x004a],
    ['PageUp', 0x004b],
    ['Delete', 0x004c],
    ['End', 0x004d],
    ['PageDown', 0x004e],
    ['ArrowRight', 0x004f],
    ['ArrowLeft', 0x0050],
    ['ArrowDown', 0x0051],
    ['ArrowUp', 0x0052],
    ['NumLock', 0x0053],
    ['NumpadDivide', 0x0054],
    ['NumpadMultiply', 0x0055],
    ['NumpadSubtract', 0x0056],
    ['NumpadAdd', 0x0057],
    ['NumpadEnter', 0x0058],
    ['Numpad1', 0x0059],
    ['Numpad2', 0x005a],
    ['Numpad3', 0x005b],
    ['Numpad4', 0x005c],
    ['Numpad5', 0x005d],
    ['Numpad6', 0x005e],
    ['Numpad7', 0x005f],
    ['Numpad8', 0x0060],
    ['Numpad9', 0x0061],
    ['Numpad0', 0x0062],
    ['NumpadDecimal', 0x0063],
    ['ContextMenu', 0x0065],
    ['ControlLeft', 0x1100],
    ['ShiftLeft', 0x1200],
    ['AltLeft', 0x1400],
    ['MetaLeft', 0x1800],
    ['ControlRight', 0x0100],
    ['ShiftRight', 0x0200],
    ['AltRight', 0x0400],
    ['MetaRight', 0x0800],
  ]);

  constructor(transport: any) {
    super(transport);
    this.reportId = 0x0e;
    this.path = `${transport.vendorId}:${transport.productId}`;
    if (!globalBuffer[this.path]) {
      globalBuffer[this.path] = [];
      eventWaitBuffer[this.path] = [];
    }
  }

  protected parseInputReport(reportId: number, data: Uint8Array): void {
    if (reportId == this.reportId) {
      const msg = { data: data, time: Date.now() };

      globalBuffer[this.path].push(msg);
      if (eventWaitBuffer[this.path].length > 0) {
        const waiter = eventWaitBuffer[this.path].shift();
        if (waiter) waiter(msg);
      }
    }
  }

  protected calcChecksum8(data: Uint8Array): number {
    const len = data.length;
    let checksum = 0x5a;
    for (let i = 0; i < len; i++) {
      checksum ^= data[i];
    }
    return checksum;
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

  protected encodeMacroOP(op: MacroContent): number {
    let key = 0x0000;

    switch (op.Type) {
      case 'KeyDown': {
        if (this.macroOPMap.has(op.Code)) {
          key = 0x2000 | Number(this.macroOPMap.get(op.Code));
        }
        break;
      }
      case 'KeyUp': {
        if (this.macroOPMap.has(op.Code)) {
          key = Number(this.macroOPMap.get(op.Code));
        }
        break;
      }
      case 'MouseDown': {
        switch (op.Code) {
          case '0': {
            key = 0x4181;
            break;
          }
          case '2': {
            key = 0x4182;
            break;
          }
        }
        break;
      }
      case 'MouseUp': {
        switch (op.Code) {
          case '0': {
            key = 0x4101;
            break;
          }
          case '2': {
            key = 0x4102;
            break;
          }
        }
        break;
      }

      case 'Delay': {
        key = 0xc000 | ((Number(op.Code) / 2) & 0x3fff);
        break;
      }
    }

    return key;
  }

  protected encodeKeyData(profile: Profile): Uint8Array {
    const data = new Uint8Array(1024 * 4).fill(0xff);

    for (let layer = 0; layer < 4; layer++) {
      if (layer < profile.KeySet.length) {
        let addrOffset = 1024 * layer + 0x0020;

        profile.KeySet[layer].forEach((key) => {
          if (key.Index < 12) {
            if (key.Value.length == 6) {
              if (key.Value == '0x8000' && key.Macro && key.Macro.Content) {
                const len = (key.Macro.Content.length + 2) * 2;
                if (addrOffset + 16 + len > 1024 * (layer + 1)) {
                  return;
                }

                let macro = 0x8000 | addrOffset;
                data[addrOffset] = 0x5a;
                data[addrOffset + 2] = len & 0xff;
                data[addrOffset + 3] = (len >> 8) & 0xff;

                switch (key.Macro.Type) {
                  case '0': {
                    data[addrOffset + 1] = Number(key.Macro.Cycles);
                    break;
                  }
                  case '1': {
                    macro |= 0x0001;
                    data[addrOffset + 1] = 0;
                    break;
                  }
                  case '2': {
                    data[addrOffset + 1] = 0;
                    data[addrOffset + 2] |= 0x01;
                    break;
                  }
                }

                key.Macro.Content.forEach((op, index) => {
                  const value = this.encodeMacroOP(op);
                  data[addrOffset + 16 + index * 2] = value & 0xff;
                  data[addrOffset + 16 + index * 2 + 1] = (value >> 8) & 0xff;
                });

                switch (key.Macro.Type) {
                  case '0': {
                    data[addrOffset + 16 + len - 4] = 0x01;
                    data[addrOffset + 16 + len - 4] |= (len - 2) & 0xff;
                    data[addrOffset + 16 + len - 3] = 0x70;
                    data[addrOffset + 16 + len - 3] |= ((len - 2) >> 8) & 0x07;
                    break;
                  }
                  case '1': {
                    data[addrOffset + 16 + len - 4] = 0x01;
                    data[addrOffset + 16 + len - 4] |= (len - 2) & 0xff;
                    data[addrOffset + 16 + len - 3] = 0x68;
                    data[addrOffset + 16 + len - 3] |= ((len - 2) >> 8) & 0x07;
                    break;
                  }
                  case '2': {
                    data[addrOffset + 16 + len - 4] = 0x01;
                    data[addrOffset + 16 + len - 4] |= (len - 2) & 0xff;
                    data[addrOffset + 16 + len - 3] = 0x70;
                    data[addrOffset + 16 + len - 3] |= ((len - 2) >> 8) & 0x07;
                    break;
                  }
                }

                data[addrOffset + 16 + len - 2] = 0x00;
                data[addrOffset + 16 + len - 1] = 0x00;

                data[1024 * layer + key.Index * 2] = macro & 0xff;
                data[1024 * layer + key.Index * 2 + 1] = (macro >> 8) & 0xff;

                addrOffset += 16 + len;
              } else {
                const value = Number(key.Value);
                data[1024 * layer + key.Index * 2] = value & 0xff;
                data[1024 * layer + key.Index * 2 + 1] = (value >> 8) & 0xff;
              }
            }
          }
        });

        data[1024 * layer + 0x1e] = layer;
        data[1024 * layer + 0x1f] = this.calcChecksum8(data.slice(1024 * layer, 1024 * layer + 0x1f));
      }
    }

    return data;
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

  async writeFlash(addr: number, data: Uint8Array): Promise<boolean> {
    const count = data.length;
    let index = 0;

    while (index < count) {
      if ((addr + index) % 256 == 0) {
        if (!(await this.CMD_EraseFlash((addr + index) / 256))) {
          return false;
        }
      }

      let len = count - index;
      if (len > 256) {
        len = 256;
      }

      const wdata = data.slice(index, index + len);
      if (!(await this.WriteFIFO(wdata))) {
        return false;
      }

      const checksum = this.calcChecksum16(wdata);
      if (!(await this.CMD_WriteFlash(addr + index, len, checksum))) {
        return false;
      }

      index += len;
    }

    return true;
  }

  async CMD_WriteFIFO(addr: number, data: Uint8Array): Promise<boolean> {
    const len = data.length;
    if (len > 28) {
      return false;
    }

    const payload = new Uint8Array(31);

    payload[0] = 0x11;
    payload[1] = addr;
    payload[2] = len;

    for (let i = 0; i < len; i++) {
      payload[3 + i] = data[i];
    }

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0] && read.data[1] == payload[1]) {
      return true;
    }

    return false;
  }

  async CMD_EraseFlash(bank: number): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x13;
    payload[1] = bank;
    payload[2] = 0xff ^ bank;
    payload[3] = 0x55;
    payload[4] = 0xaa;

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0] && read.data[1] == payload[1]) {
      return true;
    }

    return false;
  }

  async CMD_WriteFlash(addr: number, len: number, checksum: number): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x10;
    payload[1] = addr & 0xff;
    payload[2] = (addr >> 8) & 0xff;
    payload[3] = len;
    payload[4] = 0xa5;
    payload[5] = checksum & 0xff;
    payload[6] = (checksum >> 8) & 0xff;

    const read = await this.writeAndRead(payload);
    if (
      read.data &&
      read.data[0] == payload[0] &&
      read.data[1] == payload[1] &&
      read.data[2] == payload[2] &&
      read.data[3] == payload[3] &&
      read.data[4] == 0x01
    ) {
      return true;
    }

    return false;
  }

  async setReset(): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x1f;
    payload[1] = 0x55;
    payload[2] = 0xaa;

    await this.sendCommand(payload);

    return true;
  }

  async getDeviceInfo(): Promise<DeviceInfo | null> {
    const info: DeviceInfo = {};
    const payload = new Uint8Array(31);

    payload[0] = 0x21;

    const readModelInfo = await this.writeAndRead(payload);
    console.log('readModelInfo 0x21', readModelInfo);
    if (readModelInfo.data && readModelInfo.data[0] != payload[0]) {
      return null;
    }

    info.FWID = 0;
    info.FWID |= readModelInfo.data[13] << (3 * 8);
    info.FWID |= readModelInfo.data[14] << (2 * 8);
    info.FWID |= readModelInfo.data[15] << (1 * 8);
    info.FWID |= readModelInfo.data[16] << (0 * 8);
    info.FWVersion = 0;
    info.FWVersion |= readModelInfo.data[17] << (1 * 8);
    info.FWVersion |= readModelInfo.data[18] << (0 * 8);

    payload[0] = 0x20;
    const readDeviceInfo = await this.writeAndRead(payload);
    console.log('readDeviceInfo 0x20', readDeviceInfo);
    if (readDeviceInfo.data && readDeviceInfo.data[0] != payload[0]) {
      return null;
    }

    info.Mode = readDeviceInfo.data[1] & 0x03;

    info.DPILevels = [];
    info.DPILevels.push(readDeviceInfo.data[3] & 0x07);
    info.DPILevels.push(readDeviceInfo.data[4] & 0x07);
    info.DPILevels.push(readDeviceInfo.data[5] & 0x07);
    info.DPILevels.push(readDeviceInfo.data[6] & 0x07);
    info.USBReports = [];
    info.USBReports.push((readDeviceInfo.data[3] >> 6) & 0x03);
    info.USBReports.push((readDeviceInfo.data[4] >> 6) & 0x03);
    info.USBReports.push((readDeviceInfo.data[5] >> 6) & 0x03);
    info.USBReports.push((readDeviceInfo.data[6] >> 6) & 0x03);
    info.WLReports = [];
    info.WLReports.push((readDeviceInfo.data[3] >> 4) & 0x03);
    info.WLReports.push((readDeviceInfo.data[4] >> 4) & 0x03);
    info.WLReports.push((readDeviceInfo.data[5] >> 4) & 0x03);
    info.WLReports.push((readDeviceInfo.data[6] >> 4) & 0x03);

    const le: LEDEffect = {};
    le.BLMode = readDeviceInfo.data[7] & 0x1f;
    le.BLDirection = (readDeviceInfo.data[7] >> 5) & 0x01;
    le.Brightness = readDeviceInfo.data[9] & 0x07;
    le.Speed = (readDeviceInfo.data[9] >> 4) & 0x07;
    le.Color = readDeviceInfo.data[10] & 0x07;
    info.LEDEffect = le;

    const as: AdvanceSetting = {};
    as.WLPrimarySleep = readDeviceInfo.data[11] & 0x07;
    as.WLDeepSleep = (readDeviceInfo.data[11] >> 4) & 0x07;
    as.BLEPrimarySleep = readDeviceInfo.data[12] & 0x07;
    as.BLEDeepSleep = (readDeviceInfo.data[12] >> 4) & 0x07;
    as.SilentAltitude = readDeviceInfo.data[13] & 0x03;
    as.UltraLowDelay = (readDeviceInfo.data[13] & 0x10) == 0x10;
    as.UltraLowPower = (readDeviceInfo.data[13] & 0x20) == 0x20;
    as.RippleControl = (readDeviceInfo.data[13] & 0x40) == 0x40;
    as.MoveWakeUp = (readDeviceInfo.data[13] & 0x80) == 0x80;
    info.AdvanceSetting = as;
    console.log('BaseInfo --------------------------', info);
    return info;
  }

  async getDPI(): Promise<{ Level: number; DPI: number; Value: number }[] | null> {
    const payload = new Uint8Array(31);

    payload[0] = 0x22;
    const read = await this.writeAndRead(payload);

    if (read.data && read.data[0] != payload[0]) {
      return null;
    }

    const dpis: { Level: number; DPI: number; Value: number }[] = [];
    dpis.push({ Level: 1, DPI: 0, Value: read.data[2] });
    dpis.push({ Level: 2, DPI: 0, Value: read.data[3] });
    dpis.push({ Level: 3, DPI: 0, Value: read.data[4] });
    dpis.push({ Level: 4, DPI: 0, Value: read.data[5] });
    dpis.push({ Level: 5, DPI: 0, Value: read.data[6] });
    dpis.push({ Level: 6, DPI: 0, Value: read.data[7] });
    dpis.push({ Level: 7, DPI: 0, Value: read.data[8] });
    dpis.push({ Level: 8, DPI: 0, Value: read.data[9] });
    console.log('getDPI 0x22', read);
    console.log('getDPI 0x22', dpis);
    return dpis;
  }

  async setLighting(config: {
    mode: number;
    brightness: number;
    speed: number;
    direction: number;
    color: number;
  }): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x20;

    payload[7] |= (config.mode & 0x1f) | ((config.direction & 0x01) << 5) | 0xc0;
    payload[9] = (config.brightness & 0x07) | ((config.speed & 0x07) << 4) | 0x88;
    payload[10] = (config.color & 0x07) | 0x08;

    const read = await this.writeAndRead(payload);

    // this.getDeviceInfo();
    if (read.data && read.data[0] == payload[0]) {
      return true;
    }

    return false;
  }

  async setDPI(dpis: { Level: number; DPI: number; Value: number }[]): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x22;
    payload[1] = 0x80;

    for (let i = 0; i < dpis.length && i < 8; i++) {
      payload[2 + i] = dpis[i].Value;
    }
    for (let i = dpis.length; i < 8; i++) {
      payload[2 + i] = 0xff;
    }
    console.log('setDPI  payload--------------', payload);
    const read = await this.writeAndRead(payload);
    console.log('setDPI  result--------------', read);
    if (read.data && read.data[0] == payload[0]) {
      return true;
    }

    return false;
  }

  async setKeyDefine(profile: Profile): Promise<boolean> {
    const data = this.encodeKeyData(profile);
    const flashResult = await this.writeFlash(0, data);
    if (!flashResult) {
      return false;
    }

    const payload = new Uint8Array(31);

    payload[0] = 0x20;
    payload[1] = 0x80;
    console.log(data);
    const read = await this.writeAndRead(payload);
    console.log('setKeyDefine  ------ ', read);
    if (read.data && read.data[0] == payload[0]) {
      return true;
    }

    return false;
  }

  async setDPILevel(mode: number, level: number): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x20;
    payload[1] = 0x00;
    payload[2] = 0x01 << (mode & 0x03);
    payload[3 + (mode & 0x03)] = level & 0x07;

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0]) {
      return true;
    }

    return false;
  }

  // 回报率设置
  async setReport(mode: number, usbReport: number, wlReport: number): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x20;
    payload[1] = 0x00;
    payload[2] = 0x10 << (mode & 0x03);
    payload[3 + (mode & 0x03)] = (usbReport & 0x03) << 6;
    payload[3 + (mode & 0x03)] |= (wlReport & 0x03) << 4;

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0]) {
      return true;
    }

    return false;
  }

  async setMode(mode: number): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x20;
    payload[1] = 0x20 | (mode & 0x03);

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0]) {
      return true;
    }

    return false;
  }
  // 休眠设置
  async setAdvanceSetting(advance: AdvanceSetting): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x20;
    payload[1] = 0x40;
    payload[11] = advance?.WLPrimarySleep || 0x00 & 0x07;
    payload[11] |= (advance?.WLDeepSleep || 0x00 & 0x07) << 4;
    payload[12] = advance?.BLEPrimarySleep || 0x00 & 0x07;
    payload[12] |= (advance?.BLEDeepSleep || 0x00 & 0x07) << 4;
    payload[13] = advance?.SilentAltitude || 0x00 & 0x03;
    if (advance.UltraLowDelay) {
      payload[13] |= 0x10;
    }
    if (advance.UltraLowPower) {
      payload[13] |= 0x20;
    }
    if (advance.RippleControl) {
      payload[13] |= 0x40;
    }
    if (advance.MoveWakeUp) {
      payload[13] |= 0x40;
    }

    const read = await this.writeAndRead(payload);
    if (read.data && read.data[0] == payload[0]) {
      return true;
    }

    return false;
  }

  async upgradeFireware(): Promise<boolean> {
    const payload = new Uint8Array(31);

    payload[0] = 0x1e;
    payload[1] = 0x55;
    payload[2] = 0xaa;
    payload[3] = 0x00;
    payload[4] = 0xff;

    const read = await this.writeAndRead(payload);
    console.log('upgradeFireware  ---payload--- ', payload);
    console.log('upgradeFireware  ---read--- ', read);
    if (read.data && read.data[0] == payload[0] && read.data[1] == 0x01) {
      return true;
    }

    return false;
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
