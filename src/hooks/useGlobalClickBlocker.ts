// useGlobalClickBlocker.ts
import { useEffect, useMemo } from 'react';
import { useMacroStore } from '@/store/macroStore';
import { useModal } from '@/components/common/ModalContext';
import { useTranslation } from 'react-i18next';

export function useGlobalClickBlocker() {
  const isRecording = useMacroStore((s) => s.isRecording);
  const { currentMacroRecord, actionMacroRecord } = useMacroStore();
  const { t } = useTranslation();
  const { openAlert } = useModal();
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

  const hasChangeMacro = useMemo(() => {
    return JSON.stringify(currentMacroRecord) !== JSON.stringify(actionMacroRecord);
  }, [currentMacroRecord, actionMacroRecord]);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      if (target.closest('[data-block-click]') && hasChangeMacro) {
        e.stopPropagation();
        e.preventDefault();
        console.warn('有未保存的宏记录，点击无效');
        openAlert({
          title: t('unsaved_macro_record'),
          content: t('please_complete_save_operation'),
          onOk: () => {},
        });
        return;
      }
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [currentMacroRecord, actionMacroRecord]);
}
