export interface LEDEffect {
  BLMode?: number;
  BLDirection?: number;
  Brightness?: number;
  Speed?: number;
  Color?: number;
}

export interface AdvanceSetting {
  WLPrimarySleep?: number;
  WLDeepSleep?: number;
  BLEPrimarySleep?: number;
  BLEDeepSleep?: number;
  SilentAltitude?: number;
  UltraLowDelay?: boolean;
  UltraLowPower?: boolean;
  RippleControl?: boolean;
  MoveWakeUp?: boolean;
}

export interface DeviceInfo {
  FWID?: number;
  FWVersion?: number;
  Mode?: number;
  SensorID?: number;
  DPILevels?: number[];
  USBReports?: number[];
  WLReports?: number[];
  LEDEffect?: LEDEffect;
  AdvanceSetting?: AdvanceSetting;
}
