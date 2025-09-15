import type { Macro, MacroFile } from '@/types/macro';
import { useCallback } from 'react';
import { genId } from '@/store/macroStore';

export function useMacroFileIO() {
  /**
   * 导出多个 MacroFile（不包含 id）
   */
  const exportJson = useCallback((files: MacroFile[], filename = 'macros.json') => {
    const data = files.map((file) => ({
      name: file.name,
      macroList: file.macroList.map((m) => ({
        name: m.name,
        content: m.content,
        version: m.version,
      })),
    }));

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  /**
   * 导出单个 Macro（不包含 id）
   */
  const exportMacroJson = useCallback((macro: Macro, filename = 'macro.json') => {
    const data = {
      name: macro.name,
      content: macro.content,
      version: macro.version,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  /**
   * 导入 JSON 文件，支持 MacroFile[] 或 单个 Macro
   */
  const importJson = useCallback((file: File): Promise<MacroFile[] | Macro> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const raw = JSON.parse(reader.result as string);

          // 1. 如果是单个 Macro
          if ('name' in raw && 'content' in raw && 'version' in raw) {
            return resolve(raw);
          }

          // 2. 如果是 MacroFile[]
          if (Array.isArray(raw)) {
            const filesWithId: MacroFile[] = raw.map((file) => ({
              id: genId(),
              name: file.name,
              macroList: file.macroList.map((m) => ({
                id: genId(),
                name: m.name,
                content: m.content,
                version: m.version,
              })),
            }));
            return resolve(filesWithId);
          }

          reject(new Error('导入的 JSON 格式不正确'));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }, []);

  return { exportJson, exportMacroJson, importJson };
}
