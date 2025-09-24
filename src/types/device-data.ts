export interface LEDEffect {
  BLMode: number;
  BLDirection: number;
  Brightness: number;
  Speed: number;
  Color: number;
  Gain: number;
  Smooth: number;
}

export interface AdvanceSetting {
  WLPrimarySleep: number;
  WLDeepSleep: number;
  BLEPrimarySleep: number;
  BLEDeepSleep: number;
  SilentAltitude: number;
  UltraLowDelay: boolean;
  UltraLowPower: boolean;
  RippleControl: boolean;
  MoveWakeUp: boolean;
}

export interface Mouse {
  DeviceID: number;
  FWID: number;
  RealFWID: number;
  FWVersion: number;
  Online: boolean;
  Charge: boolean;
  Battery: number;
}

export interface KB {
  DeviceID: number;
  FWID: number;
  RealFWID: number;
  FWVersion: number;
  Online: boolean;
  Charge: boolean;
  Battery: number;
}

export interface Info {
  FWID?: number;
  RealFWID?: number;
  FWVersion?: number;
  Mode?: number;
  SensorID?: number;
  SensorInfo?: null | any; // You may want to provide more info if SensorInfo has a structure.
  DPILevels?: number[];
  USBReports?: number[];
  WLReports?: number[];
  LEDEffect?: LEDEffect;
  AdvanceSetting?: AdvanceSetting;
  Mouse?: Mouse;
  KB?: KB;
}

export interface HID {
  Path: string;
  VendorID: number;
  ProductID: number;
  Release: number;
  Serial: string;
  Manufacturer: string;
  Product: string;
  UsagePage: number;
  Usage: number;
  Interface: number;
}

export interface Model {
  ModelID?: string;
  Name?: string;
  Type?: string;
  FWID?: number;
  FWVersion?: number;
}

export interface DeviceInfo {
  Driver?: object;
  Model?: Model;
  HID?: HID;
  Info?: Info;
  Device?: object;
  RFDevice?: boolean;
  Dongle?: string;
  Mouse?: Mouse;
}
export interface Mouse {
  Battery: number;
  Charge: boolean;
  DeviceID: number;
  FWID: number;
  FWVersion: number;
  Online: boolean;
  RealFWID: number;
}

export interface DeviceData {
  [key: string]: DeviceInfo;
}

export interface ModelConfig {
  LETable?: LightEffect[];
  Advance?: Advance;
  SensorInfo?: SensorInfo;
}

export interface Advance {
  MoveWakeUp?: boolean;
  RippleControl?: boolean;
  SilentAltitude?: boolean;
  UltraLowDelay?: boolean;
  UltraLowPower?: boolean;
}
export interface LightEffect {
  Name?: string;
  Lang?: string;
  Value?: number;
  Config?: number;
}

export interface SensorInfo {
  Name?: string;
  DPIs?: DPISetting[];
}

export interface DPISetting {
  Level?: number;
  DPI?: number;
  Value?: number;
  Config?: number;
}
