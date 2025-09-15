// =========================
// BaseAdapter.ts
// =========================

import type { ITransport, ReportCallback } from '../transports/WebHIDTransport';

/**
 * BaseAdapter 是所有具体设备适配器的抽象基类。
 * 它负责：
 * - 持有 transport 实例
 * - 绑定/解绑 input report 事件
 * - 定义公共接口（lighting、DPI、宏等）
 * - 提供数据解析的抽象方法
 */
export abstract class BaseAdapter {
  protected transport: ITransport;
  protected reportId: number;

  constructor(transport: ITransport) {
    this.transport = transport;
    this.reportId = 0x0e;
  }

  /**
   * 初始化：建立 transport 连接并注册 inputreport 回调
   */
  async init(): Promise<void> {
    if (!this.transport.isConnected()) {
      await this.transport.connect();
    }
    this.transport.onInputReport(this.handleInputReport);
  }

  /**
   * 释放资源：断开连接并移除事件
   */
  async dispose(): Promise<void> {
    this.transport.offInputReport(this.handleInputReport);
    await this.transport.disconnect();
  }

  /**
   * 发送命令到设备
   */
  protected async sendCommand(payload: Uint8Array): Promise<void> {
    await this.transport.sendReport(this.reportId, payload);
  }

  /**
   * 处理设备返回的 input report
   */
  private handleInputReport: ReportCallback = (reportId, data) => {
    try {
      this.parseInputReport(reportId, data);
    } catch (err) {
      console.error('Error parsing input report', err);
    }
  };

  /**
   * 子类必须实现：解析来自设备的报文
   */
  protected abstract parseInputReport(reportId: number, data: Uint8Array): void;

  /**
   * 子类可实现：设置灯光
   */
  abstract setLighting(config: any): Promise<boolean>;

  /**
   * 子类可实现：设置 DPI
   */
  abstract setDPI(dpis: { Level: number; DPI: number; Value: number }[]): Promise<boolean>;

  /**
   * 子类可实现：更新固件
   */
  abstract upgradeFireware(fileContent?: Uint8Array, callback?: (progress: number) => void): Promise<boolean>;
}
export default BaseAdapter;
