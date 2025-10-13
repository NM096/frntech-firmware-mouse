export interface Macro {
  id: string;
  version: number;
  name: string;
  content: MacroEvent[];
}
export interface MacroFile {
  id: string;
  name: string;
  macroList: Macro[];
}

export interface MacroEvent {
  type: 'KeyDown' | 'KeyUp' | 'MouseDown' | 'MouseUp' | 'Delay' | 'MouseMove';
  name: string;
  code: string;
}
