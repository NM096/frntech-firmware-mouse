export interface MacroContent {
  Type: string;
  Name: string;
  Code: string;
}

export interface MacroDefine {
  Id?: string;
  FileId?: string;
  Category: string;
  Name: string;
  Type: string;
  Cycles: string;
  Content: MacroContent[];
}

export interface KeyDefine {
  Index: number;
  Name: string;
  Value: string;
  Lang: string;
  Show: string;
  Image?: string;
  Macro?: MacroDefine;
}
export interface Dpi {
  Open: boolean;
  Level: number;
  DPI: number;
  Value: number;
}
export interface Profile {
  Version?: number;
  KeySet: KeyDefine[][];
  ModelID?: string;
  DPIs?: Dpi[];
}

export interface KeyItem {
  Name: string;
  Value: string;
  Lang: string;
  Show: string;
}
