import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { Check, X } from 'lucide-react';

interface ColorPickerProps {
  initialValue?: string;
  onChange?: (color: string) => void;
  top?: number;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ initialValue = '#ff0000', onChange, top = 0 }) => {
  const [color, setColor] = useState(initialValue);
  const [tempColor, setTempColor] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    setColor(tempColor);
    onChange?.(tempColor);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempColor(color);
    setIsOpen(false);
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setTempColor(color);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, color]);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }} ref={pickerRef}>
      {/* 色块 */}
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '1px',
          backgroundColor: initialValue || color,
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            marginTop: '8px',
            zIndex: 1000,
            right: '40px',
            top: top + 'px',
            background: '#2c2c2c',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            padding: '4px',
            borderRadius: '6px',
          }}
        >
          {/* react-color 选择器 */}
          <SketchPicker
            color={tempColor}
            onChange={(c: ColorResult) => setTempColor(c.hex)}
            styles={{
              default: {
                picker: {
                  width: '200px',
                  background: '#2c2c2c', // 修改整体背景色
                  borderRadius: '6px',
                  boxShadow: '0',
                },
                saturation: {
                  borderRadius: '6px',
                },
                hue: {
                  borderRadius: '6px',
                },
              },
            }}
          />
          {/* 按钮 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '4px',
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                marginRight: '6px',
                borderRadius: '4px',
                padding: '4px 6px',
                cursor: 'pointer',
                boxShadow: '1px 1px 5px rgba(0,0,0,0.2)',
              }}
            >
              <X size={16} color="red" />
            </button>
            <button
              onClick={handleConfirm}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                marginRight: '6px',
                borderRadius: '4px',
                padding: '4px 6px',
                cursor: 'pointer',
                boxShadow: '1px 1px 5px rgba(0,0,0,0.2)',
              }}
            >
              <Check size={16} color="green" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
