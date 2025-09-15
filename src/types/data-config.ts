export interface Config {
  XdBMult: number;
  XdBDiv: number;
  YdBMult: number;
  YdBDiv: number;
  FiringSpeed: number;
  SnipeDPIPlus: DpiValue;
  SnipeDPISub: DpiValue;
  DPILEDs: DPILED[];
}
export interface DpiValue {
  Level: number;
  DPI: number;
  Value: number;
}
export interface DPILED {
  Index: number;
  Value: string;
}
