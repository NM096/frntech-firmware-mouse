type SmurfsAdapterName = 'auto' | 'go' | 'webhid' | 'mock' | (string & {});

export interface SmurfsConfig {
  adapter?: SmurfsAdapterName;
  softwareVersion?: string;
  filterDongleDevice?: boolean;
  filterOfflineDevice?: boolean;
}

export class SmurfsError extends Error {
  constructor(message?: string, code?: string);

  code?: string;
  static readonly ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT';
  static readonly ERR_NOT_SUPPORTS = 'ERR_NOT_READY';
  static readonly ERR_DEVICE_NOT_EXIST = 'ERR_DEVICE_NOT_EXIST';
}

type SmurfsListenUse = (
  onFulfilled?: ((value?: any) => any) | null,
  onRejected?: ((error: any) => any) | null
) => number;

export interface SmurfsListenManager {
  use: SmurfsListenUse;
  eject(id: number): void;
  clear(): void;
}

export interface SmurfsAppConfig {
  Language: string;
}

export interface SmurfsDevice {
  DeviceID: string;
  ModelID: string;
  Name: string;
  Type: string;
  FWID: number;
  FWVersion: number;
}

export interface SmurfsDeviceList {
  [id: string]: SmurfsDevice;
}

export interface SmurfsModelConfig {
  LETable: SmurfsLEConfig[];
  DPI: SmurfsDPIConfig;
  Advance: SmurfsAdvanceConfig;
}

export interface SmurfsLEConfig {
  Name: string;
  Lang: string;
  Config: number;
  Value: number;
}

export interface SmurfsSensorInfo {
  Name: string;
  DPIType: number;
  DPIs: SmurfsDPI[];
}

export interface SmurfsDPI {
  Level: number;
  DPI: number;
  Value: number;
}

export interface SmurfsDPIConfig {
  DPILEDEnable: boolean;
  DPILEDEditable: boolean;
  FullColor: boolean;
}

export interface SmurfsAdvanceConfig {
  SilentAltitude: boolean;
  UltraLowDelay: boolean;
  UltraLowPower: boolean;
  RippleControl: boolean;
  MoveWakeUp: boolean;
}

export interface SmurfsKeyMap {
  KeyName: string;
  Show: string;
  LogicCode: number;
  LocationCode: number;
  Position: {
    Left: number;
    Top: number;
    Width: number;
    Height: number;
  };
}

export interface SmurfsProfile {
  Version?: number;
  ModelID?: string;
  Name?: string;
  LinkApps?: string[];
  KeySet: SmurfsKeyDefine[][];
  DPIs?: SmurfsDPISet[];
  LEDEffect?: SmurfsLEDEffect;
  USBReports?: number[];
  WLReports?: number[];
  AdvanceSetting?: SmurfsAdvanceSetting;
  SystemConfig?: SmurfsSystemConfig;
}

export interface SmurfsKeyDefine {
  Index: number;
  Name: string;
  Value: string;
  Lang: string;
  Show: string;
  Image?: string;
  Macro?: SmurfsMacroDefine;
}

export interface SmurfsMacroDefine {
  Category: string;
  Name: string;
  Type: string;
  Cycles: string;
  Content: SmurfsMacroContent[];
}

export interface SmurfsMacroContent {
  Type: string;
  Name: string;
  Code: string;
}

export interface SmurfsDPISet {
  Open: boolean;
  Select?: boolean;
  Level: number;
  DPI: number;
  Value: number;
  Color: string;
}

export interface SmurfsLEDEffect {
  BLMode: number;
  BLDirection: number;
  Brightness: number;
  Speed: number;
  Color: number;
}

export interface SmurfsAdvanceSetting {
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

export interface SmurfsSystemConfig {
  MouseSpeed: number;
  PointerAccuracy: boolean;
  WheelScrollLines: number;
  DoubleClickTime: number;
}

export interface SmurfsProfileSet {
  Name: string;
  Select?: boolean;
  Profile?: SmurfsProfile;
}

export interface SmurfsMacroCategorySet {
  Name: string;
  Macros: SmurfsMacroSet[];
}

export interface SmurfsMacroSet {
  Name: string;
}

export interface SmurfsMacro {
  Version?: number;
  Name?: string;
  Content: SmurfsMacroContent[];
}

export class Smurfs {
  constructor(config?: SmurfsConfig);
  defaults: SmurfsConfig;
  listens: {
    ready: SmurfsListenManager;
    devices: SmurfsListenManager;
  };

  run(): void;

  openDevTools(): void;
  closeDevTools(): void;
  closeApp(): void;
  minimizeApp(): void;
  maximizeApp(): void;
  unmaximizeApp(): void;
  showWindow(): void;
  hideWindow(): void;
  getSoftwareVersion(short?: boolean): Promise<string>;
  getAppConfig(): Promise<SmurfsAppConfig>;
  setAppConfig(config: SmurfsAppConfig): Promise<boolean>;

  getDeviceList(): Promise<SmurfsDeviceList>;
  getDeviceSensorInfo(id: string): Promise<SmurfsSensorInfo>;
  resetDevice(id: string): Promise<boolean>;

  getModelConfig(id: string): Promise<SmurfsModelConfig>;
  getModelKeyMap(id: string): Promise<SmurfsKeyMap[]>;
  getModelProfile(id: string): Promise<SmurfsProfile>;

  getProfiles(id: string): Promise<SmurfsProfileSet[]>;
  addProfile(id: string, name: string, select?: boolean): Promise<SmurfsProfileSet[]>;
  delProfile(id: string, name: string): Promise<SmurfsProfileSet[]>;
  renameProfile(id: string, name: string, newname: string): Promise<SmurfsProfileSet[]>;
  getProfile(id: string, name: string, select?: boolean, apply?: boolean): Promise<SmurfsProfileSet[]>;
  setProfile(id: string, name: string, profile: SmurfsProfile, apply?: boolean): Promise<boolean>;
  importProfile(id: string, path: string): Promise<SmurfsProfileSet[]>;
  exportProfile(id: string, name: string, path: string): Promise<boolean>;

  getMacros(): Promise<SmurfsMacroCategorySet[]>;
  addMacroCategory(category: string): Promise<SmurfsMacroCategorySet[]>;
  delMacroCategory(category: string): Promise<SmurfsMacroCategorySet[]>;
  renameMacroCategory(category: string, newcategory: string): Promise<SmurfsMacroCategorySet[]>;
  addMacro(category: string, name: string): Promise<SmurfsMacroCategorySet[]>;
  delMacro(category: string, name: string): Promise<SmurfsMacroCategorySet[]>;
  renameMacro(category: string, name: string, newname: string): Promise<SmurfsMacroCategorySet[]>;
  getMacro(category: string, name: string): Promise<SmurfsMacro>;
  setMacro(category: string, name: string, macro: SmurfsMacro): Promise<boolean>;
  importMacro(category: string, path: string): Promise<SmurfsMacroCategorySet[]>;
  exportMacro(category: string, name: string, path: string): Promise<boolean>;
}

export interface SmurfsInstance extends Smurfs {
  create(config?: SmurfsConfig): SmurfsInstance;
  defaults: SmurfsConfig;
}

export interface SmurfsStatic extends SmurfsInstance {
  Smurfs: typeof Smurfs;
  SmurfsError: typeof SmurfsError;
  readonly VERSION: string;
}

declare const smurfs: SmurfsStatic;

export default smurfs;
