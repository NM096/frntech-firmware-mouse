import type { MacroEvent } from '@/types/macro';
import { useEffect, useRef, useState, useCallback } from 'react';

function getKeyName(event: KeyboardEvent) {
  let name = event.key;
  if (name === 'Shift') {
    if (event.code === 'ShiftLeft') name = 'Left Shift';
    else if (event.code === 'ShiftRight') name = 'Right Shift';
  } else if (name === 'Control') {
    if (event.code === 'ControlLeft') name = 'Left Ctrl';
    else if (event.code === 'ControlRight') name = 'Right Ctrl';
  } else if (name === 'Alt') {
    if (event.code === 'AltLeft') name = 'Left Alt';
    else if (event.code === 'AltRight') name = 'Right Alt';
  } else if (name === 'Meta') {
    if (event.code === 'MetaLeft') name = 'Left Win';
    else if (event.code === 'MetaRight') name = 'Right Win';
  }
  return name;
}

function getMouseName(event: MouseEvent) {
  let name = '';
  switch (event.button) {
    case 0:
      name = event.type === 'mousedown' ? 'LeftDown' : 'LeftUp';
      break;
    case 2:
      name = event.type === 'mousedown' ? 'RightDown' : 'RightUp';
      break;
  }
  return name;
}

export function useMacroRecorder(
  enabled: boolean,
  writeRecord: boolean,
  delayMode: 'record' | 'default' | 'min',
  minDelay: number
) {
  const [records, setRecords] = useState<MacroEvent[]>([]);
  const lastEventTime = useRef<number | null>(null); // 记录上一次事件的时间戳

  const addRecord = useCallback((event: MacroEvent) => {
    setRecords((prev) => [...prev, event]);
  }, []);

  // 包装，插入事件间隔
  const addWithInterval = useCallback(
    (event: MacroEvent) => {
      const now = Date.now();
      if (lastEventTime.current !== null) {
        const gap = now - lastEventTime.current;
        if (gap > 0) {
          addRecord({
            type: 'Delay',
            name: String(gap),
            code: delayMode === 'record' ? String(gap) : delayMode === 'default' ? String(minDelay) : '10',
          });
        }
      }
      lastEventTime.current = now;
      addRecord(event);
    },
    [addRecord, delayMode, minDelay]
  );

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!writeRecord) return;
      if (event.repeat || event.key === 'Unidentified') return;
      const name = getKeyName(event);
      if (!name) return;

      addWithInterval({ type: 'KeyDown', name, code: event.code });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!writeRecord) return;
      if (event.key === 'Unidentified') return;
      const name = getKeyName(event);
      if (!name) return;

      addWithInterval({ type: 'KeyUp', name, code: event.code });
    };

    const handleMouse = (event: MouseEvent) => {
      if (!writeRecord) return;
      const name = getMouseName(event);
      if (!name) return;

      if (event.type === 'mousedown') {
        addWithInterval({ type: 'MouseDown', name, code: event.button.toString() });
      } else if (event.type === 'mouseup') {
        addWithInterval({ type: 'MouseUp', name, code: event.button.toString() });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouse);
    document.addEventListener('mouseup', handleMouse);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouse);
      document.removeEventListener('mouseup', handleMouse);
    };
  }, [enabled, writeRecord, addWithInterval]);

  const clearRecords = () => {
    setRecords([]);
    lastEventTime.current = null;
  };

  const stop = useCallback(() => {
    lastEventTime.current = null;
    return records;
  }, [records]);

  return { records, stop, clearRecords, setRecords };
}
