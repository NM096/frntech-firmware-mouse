import React, { useState, useCallback, useEffect, useRef } from 'react';
import Checkbox from '@/components/common/Checkbox';
import type { KeyItem } from '@/types/profile';

// 键盘按键映射表
const KeyCodeMap = {
  KeyA: 0x0004,
  KeyB: 0x0005,
  KeyC: 0x0006,
  KeyD: 0x0007,
  KeyE: 0x0008,
  KeyF: 0x0009,
  KeyG: 0x000a,
  KeyH: 0x000b,
  KeyI: 0x000c,
  KeyJ: 0x000d,
  KeyK: 0x000e,
  KeyL: 0x000f,
  KeyM: 0x0010,
  KeyN: 0x0011,
  KeyO: 0x0012,
  KeyP: 0x0013,
  KeyQ: 0x0014,
  KeyR: 0x0015,
  KeyS: 0x0016,
  KeyT: 0x0017,
  KeyU: 0x0018,
  KeyV: 0x0019,
  KeyW: 0x001a,
  KeyX: 0x001b,
  KeyY: 0x001c,
  KeyZ: 0x001d,
  Digit1: 0x001e,
  Digit2: 0x001f,
  Digit3: 0x0020,
  Digit4: 0x0021,
  Digit5: 0x0022,
  Digit6: 0x0023,
  Digit7: 0x0024,
  Digit8: 0x0025,
  Digit9: 0x0026,
  Digit0: 0x0027,
  Enter: 0x0028,
  Escape: 0x0029,
  Backspace: 0x002a,
  Tab: 0x002b,
  Space: 0x002c,
  Minus: 0x002d,
  Equal: 0x002e,
  BracketLeft: 0x002f,
  BracketRight: 0x0030,
  Backslash: 0x0031,
  Semicolon: 0x0033,
  Quote: 0x0034,
  Backquote: 0x0035,
  Comma: 0x0036,
  Period: 0x0037,
  Slash: 0x0038,
  CapsLock: 0x0039,
  F1: 0x003a,
  F2: 0x003b,
  F3: 0x003c,
  F4: 0x003d,
  F5: 0x003e,
  F6: 0x003f,
  F7: 0x0040,
  F8: 0x0041,
  F9: 0x0042,
  F10: 0x0043,
  F11: 0x0044,
  F12: 0x0045,
  PrintScreen: 0x0046,
  ScrollLock: 0x0047,
  Pause: 0x0048,
  Insert: 0x0049,
  Home: 0x004a,
  PageUp: 0x004b,
  Delete: 0x004c,
  End: 0x004d,
  PageDown: 0x004e,
  ArrowRight: 0x004f,
  ArrowLeft: 0x0050,
  ArrowDown: 0x0051,
  ArrowUp: 0x0052,
  NumLock: 0x0053,
  NumpadDivide: 0x0054,
  NumpadMultiply: 0x0055,
  NumpadSubtract: 0x0056,
  NumpadAdd: 0x0057,
  NumpadEnter: 0x0058,
  Numpad1: 0x0059,
  Numpad2: 0x005a,
  Numpad3: 0x005b,
  Numpad4: 0x005c,
  Numpad5: 0x005d,
  Numpad6: 0x005e,
  Numpad7: 0x005f,
  Numpad8: 0x0060,
  Numpad9: 0x0061,
  Numpad0: 0x0062,
  NumpadDecimal: 0x0063,
  ContextMenu: 0x0065,
};

// 修饰键映射
const ModifierKeys = {
  Control: { code: 0x1100, name: 'Ctrl' },
  Shift: { code: 0x1200, name: 'Shift' },
  Alt: { code: 0x1400, name: 'Alt' },
  Meta: { code: 0x1800, name: 'Win' },
};

// 从Value解析快捷键
const parseShortcutValue = (value: string) => {
  const numValue = parseInt(value, 16);
  if (isNaN(numValue)) return { keyValue: 0, modifiers: { Control: false, Shift: false, Alt: false, Meta: false } };

  const keyValue = numValue & 0x00ff;
  const modifiers = {
    Control: (numValue & 0x1100) !== 0,
    Shift: (numValue & 0x1200) !== 0,
    Alt: (numValue & 0x1400) !== 0,
    Meta: (numValue & 0x1800) !== 0,
  };

  return { keyValue, modifiers };
};

// 从Name解析显示名称
const parseKeyDisplay = (name: string) => {
  if (!name) return '';

  const parts = name.split('+');
  return parts[parts.length - 1] || '';
};

interface KeyboardProps {
  onChange: (shortcut: KeyItem) => void;
  initialShortcut?: KeyItem;
}

const Keyboard: React.FC<KeyboardProps> = ({ onChange, initialShortcut }) => {
  const [keyValue, setKeyValue] = useState(0);
  const [keyDisplay, setKeyDisplay] = useState('');
  const [modifiers, setModifiers] = useState({
    Control: false,
    Shift: false,
    Alt: false,
    Meta: false,
  });
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialShortcut && initialShortcut.Lang.includes('[combination_Key]')) {
      const { keyValue: initialKeyValue, modifiers: initialModifiers } = parseShortcutValue(initialShortcut.Value);
      const initialKeyDisplay = parseKeyDisplay(initialShortcut.Name);

      setKeyValue(initialKeyValue);
      setKeyDisplay(initialKeyDisplay);
      setModifiers(initialModifiers);
    }
  }, [initialShortcut]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();

    if (ModifierKeys[e.code]) {
      setModifiers((prev) => ({ ...prev, [e.code]: true }));
      return;
    }

    if (KeyCodeMap[e.code]) {
      const keyCode = KeyCodeMap[e.code];
      setKeyValue(keyCode);

      let keyName = e.key;
      if (e.key.length > 1) {
        keyName = e.code.replace('Key', '').replace('Digit', '').replace('Arrow', '');
        if (e.code === 'Space') keyName = 'Space';
        if (e.code === 'Enter') keyName = 'Enter';
        if (e.code === 'Escape') keyName = 'Esc';
        if (e.code === 'Backspace') keyName = 'Backspace';
        if (e.code === 'Tab') keyName = 'Tab';
      }

      setKeyDisplay(keyName.toUpperCase());
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (ModifierKeys[e.code]) {
      setModifiers((prev) => ({ ...prev, [e.code]: false }));
    }
  }, []);

  const startListening = () => {
    setIsListening(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  useEffect(() => {
    let value = keyValue;
    let show = '';

    if (modifiers.Control) {
      value |= ModifierKeys.Control.code;
      show += 'Ctrl+';
    }
    if (modifiers.Shift) {
      value |= ModifierKeys.Shift.code;
      show += 'Shift+';
    }
    if (modifiers.Alt) {
      value |= ModifierKeys.Alt.code;
      show += 'Alt+';
    }
    if (modifiers.Meta) {
      value |= ModifierKeys.Meta.code;
      show += 'Win+';
    }

    if (keyValue !== 0) {
      show += keyDisplay;
    }

    value |= 0x2000;

    const hexValue = '0x' + value.toString(16).padStart(4, '0').toUpperCase();
    if (keyValue === 0) {
      return;
    }
    onChange({
      Name: show,
      Value: hexValue,
      Show: show,
      Lang: show,
    });
  }, [keyValue, keyDisplay, modifiers]);

  const clearShortcut = () => {
    setKeyValue(0);
    setKeyDisplay('');
    setModifiers({
      Control: false,
      Shift: false,
      Alt: false,
      Meta: false,
    });
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleFocus = () => {
      setIsListening(true);
    };

    const handleBlur = () => {
      setIsListening(false);
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isListening, handleKeyDown, handleKeyUp]);

  const getShortcutDisplay = () => {
    const modifierNames = Object.entries(modifiers)
      .filter(([_, isActive]) => isActive)
      .map(([code]) => ModifierKeys[code as keyof typeof ModifierKeys].name);

    return modifierNames.join(' + ') + (modifierNames.length > 0 && keyDisplay ? ' + ' : '') + keyDisplay;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
      <input
        type="text"
        style={{
          backgroundColor: 'white',
          border: 'none',
          outline: 'none',
          color: 'black',
          width: '80%',
          textAlign: 'center',
        }}
        ref={inputRef}
        value={keyDisplay}
        onFocus={startListening}
        onBlur={stopListening}
        onChange={() => {}}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginLeft: '20px' }}>
        {Object.entries(ModifierKeys).map(([code, key]) => (
          <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox
              size={16}
              color="var(--secondary)"
              checked={modifiers[code]}
              onChange={() => setModifiers((prev) => ({ ...prev, [code]: !prev[code] }))}
            />
            <label style={{ marginLeft: '5px', cursor: 'pointer' }}>{key.name}</label>
          </div>
        ))}
        <div
          style={{
            padding: '10px',
            backgroundColor: '#1E1E1E',
            borderRadius: '4px',
            minHeight: '20px',
            fontFamily: 'monospace',
          }}
        >
          {getShortcutDisplay()}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
