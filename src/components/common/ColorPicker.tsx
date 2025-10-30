import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { Check, X } from 'lucide-react';

interface ColorPickerProps {
  initialValue?: string;
  onChange?: (color: string) => void;
  top?: number;
  simple?: boolean; // 是否仅显示九色块
  simpleColors?: string[]; // 九色块颜色列表
  disable?: boolean; // 是否禁用颜色选择
}

const DEFAULT_SIMPLE_COLORS = [
  '#FF0000',
  '#FFA500',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#800080',
  '#808080',
  '#FFFFFF',
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialValue = '#ff0000',
  onChange,
  top = 0,
  simple = false,
  simpleColors = DEFAULT_SIMPLE_COLORS,
  disable = false,
}) => {
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
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, color]);

  useEffect(() => {
    setColor(initialValue);
  }, [initialValue]);
  return (
    <div style={{ display: 'inline-block', position: 'relative' }} ref={pickerRef}>
      {/* 触发色块 */}
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '2px',
          backgroundColor: color,
          cursor: 'pointer',
          border: '1px solid #444',
        }}
        onClick={() => {
          if (!disable) setIsOpen(!isOpen);
        }}
      />

      {/* 弹出面板 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            marginTop: '8px',
            zIndex: 1000,
            right: '40px',
            top: `${top}px`,
            background: '#2c2c2c',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            padding: '6px',
            borderRadius: '6px',
          }}
        >
          {/* 简单模式：九色块 */}
          {simple ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 24px)',
                gap: '6px',
                justifyContent: 'center',
                padding: '6px',
              }}
            >
              {simpleColors.map((c) => (
                <div
                  key={c}
                  onClick={() => setTempColor(c)}
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: c,
                    borderRadius: '4px',
                    border: c === tempColor ? '2px solid #fff' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'border 0.2s',
                  }}
                />
              ))}
            </div>
          ) : (
            // 全彩模式
            <SketchPicker
              color={tempColor}
              onChange={(c: ColorResult) => setTempColor(c.hex)}
              styles={{
                default: {
                  picker: {
                    width: '200px',
                    background: '#2c2c2c',
                    borderRadius: '6px',
                    boxShadow: 'none',
                  },
                  saturation: { borderRadius: '6px' },
                  hue: { borderRadius: '6px' },
                },
              }}
            />
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '8px',
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
