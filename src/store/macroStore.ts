import { create } from 'zustand';
import type { MacroEvent } from '@/types/macro';
interface MacroState {
  isRecording: boolean;
  currentMacroRecord: MacroEvent[];
  actionMacroRecord: MacroEvent[];
  setCurrentMacroRecord: (records: MacroEvent[]) => void;
  setActionMacroRecord: (records: MacroEvent[]) => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useMacroStore = create<MacroState>((set) => ({
  isRecording: false,
  currentMacroRecord: [],
  actionMacroRecord: [],
  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
  setCurrentMacroRecord: (records) => set({ currentMacroRecord: records }),
  setActionMacroRecord: (records) => set({ actionMacroRecord: records }),
}));
