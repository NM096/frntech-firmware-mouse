// useGlobalClickBlocker.ts
import { useEffect } from 'react';
import { useMacroStore } from '@/store/macroStore';

export function useGlobalClickBlocker() {
  const isRecording = useMacroStore((s) => s.isRecording);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!isRecording) return;

      const target = e.target as HTMLElement;

      if (target.closest('[data-allow-click]')) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();
      console.warn('录制中，点击无效');
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isRecording]);
}
