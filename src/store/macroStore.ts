import type { MacroFile, Macro } from '@/types/macro';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const genId = () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

interface MacroState {
  macroFiles: MacroFile[];
  currentFileId: string | null;

  createMacroFile: (name: string) => void;
  renameMacroFile: (fileId: string, newName: string) => void;
  deleteMacroFile: (fileId: string) => void;
  switchMacroFile: (fileId: string) => void;

  getCurrentFile: () => MacroFile | null;
  getMacroList: () => Macro[];
  getMacroById: (id: string) => Macro | undefined;

  addMacro: (Macro: Omit<Macro, 'id' | 'createdAt'>) => void;
  updateMacro: (id: string, updated: Partial<Macro>) => void;
  deleteMacro: (id: string) => void;
  clearMacros: () => void;

  importMacroFiles: (
    filesOrMacros: Array<Omit<MacroFile, 'id'> & { macroList: Array<Omit<Macro, 'id'>> }> | Omit<Macro, 'id'>,
    options?: { mergeToCurrent?: boolean }
  ) => void;
}

export const useMacroStore = create<MacroState>()(
  persist(
    (set, get) => ({
      macroFiles: [
        {
          id: genId(),
          name: 'default',
          macroList: [],
        },
      ],
      currentFileId: null,

      // ================= 文件操作 =================
      createMacroFile: (name) =>
        set((state) => {
          const newFile: MacroFile = { id: genId(), name, macroList: [] };
          return {
            macroFiles: [...state.macroFiles, newFile],
            currentFileId: newFile.id,
          };
        }),

      renameMacroFile: (fileId, newName) =>
        set((state) => ({
          macroFiles: state.macroFiles.map((f) => (f.id === fileId ? { ...f, name: newName } : f)),
        })),

      deleteMacroFile: (fileId) =>
        set((state) => {
          const files = state.macroFiles.filter((f) => f.id !== fileId);
          let currentId = state.currentFileId;
          if (currentId === fileId) {
            currentId = files.length > 0 ? files[0].id : null;
          }
          return { macroFiles: files, currentFileId: currentId };
        }),

      switchMacroFile: (fileId) =>
        set(() => ({
          currentFileId: fileId,
        })),

      // ================= 获取 =================
      getCurrentFile: () => {
        const { macroFiles, currentFileId } = get();
        return macroFiles.find((f) => f.id === currentFileId) || null;
      },

      getMacroList: () => {
        const file = get().getCurrentFile();
        return file ? file.macroList : [];
      },

      getMacroById: (id) => {
        const file = get().getCurrentFile();
        return file?.macroList.find((m) => m.id === id);
      },

      // ================= 宏操作 =================
      addMacro: (Macro) =>
        set((state) => {
          const file = state.macroFiles.find((f) => f.id === state.currentFileId);
          if (!file) return state;
          const newMacro: Macro = {
            ...Macro,
            id: genId(),
          };
          const updatedFile = {
            ...file,
            macroList: [...file.macroList, newMacro],
          };
          return {
            macroFiles: state.macroFiles.map((f) => (f.id === file.id ? updatedFile : f)),
          };
        }),

      updateMacro: (id, updated) =>
        set((state) => {
          const file = state.macroFiles.find((f) => f.id === state.currentFileId);
          if (!file) return state;
          const updatedFile = {
            ...file,
            macroList: file.macroList.map((m) => (m.id === id ? { ...m, ...updated } : m)),
          };
          return {
            macroFiles: state.macroFiles.map((f) => (f.id === file.id ? updatedFile : f)),
          };
        }),

      deleteMacro: (id) =>
        set((state) => {
          const file = state.macroFiles.find((f) => f.id === state.currentFileId);
          if (!file) return state;
          const updatedFile = {
            ...file,
            macroList: file.macroList.filter((m) => m.id !== id),
          };
          return {
            ...state,
            macroFiles: state.macroFiles.map((f) => (f.id === file.id ? updatedFile : f)),
          };
        }),

      clearMacros: () =>
        set((state) => {
          const file = state.macroFiles.find((f) => f.id === state.currentFileId);
          if (!file) return state;
          const updatedFile = { ...file, macroList: [] };
          return {
            macroFiles: state.macroFiles.map((f) => (f.id === file.id ? updatedFile : f)),
          };
        }),

      importMacroFiles: (
        filesOrMacros: Array<Omit<MacroFile, 'id'> & { macroList: Array<Omit<Macro, 'id'>> }> | Omit<Macro, 'id'>,
        options?: { mergeToCurrent?: boolean }
      ) =>
        set((state) => {
          const { mergeToCurrent = false } = options || {};

          // 如果传进来的是 MacroFile[]
          if ((filesOrMacros as any)[0]?.macroList) {
            const files = filesOrMacros as Array<Omit<MacroFile, 'id'> & { macroList: Array<Omit<Macro, 'id'>> }>;

            // 即使 mergeToCurrent = true，也不合并，保持独立文件
            const newFiles: MacroFile[] = files.map((file) => ({
              id: genId(),
              name: file.name,
              macroList: file.macroList.map((m) => ({
                ...m,
                id: genId(),
              })),
            }));

            return {
              macroFiles: [...state.macroFiles, ...newFiles],
              currentFileId: newFiles.length > 0 ? newFiles[0].id : state.currentFileId,
            };
          }

          // 如果传进来的是 Macro[]
          const macros = filesOrMacros as Omit<Macro, 'id'>;

          if (mergeToCurrent && state.currentFileId) {
            // 合并到当前文件
            const currentFile = state.macroFiles.find((f) => f.id === state.currentFileId);
            if (!currentFile) return state;

            const mergedMacros = {
              id: genId(),
              ...macros,
            };
            const updatedFile: MacroFile = {
              ...currentFile,
              macroList: [...currentFile.macroList, mergedMacros],
            };

            return {
              macroFiles: state.macroFiles.map((f) => (f.id === currentFile.id ? updatedFile : f)),
            };
          }

          // 默认行为：新建一个文件装这些宏
          const newFile: MacroFile = {
            id: genId(),
            name: '导入的宏文件',
            macroList: [
              {
                id: genId(),
                ...macros,
              },
            ],
          };
          return {
            macroFiles: [...state.macroFiles, newFile],
            currentFileId: newFile.id,
          };
        }),
    }),
    {
      name: 'MacroStore',
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
