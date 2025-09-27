import { create } from 'zustand';

interface MacroState {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useMacroStore = create<MacroState>((set) => ({
  isRecording: false,
  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
}));
