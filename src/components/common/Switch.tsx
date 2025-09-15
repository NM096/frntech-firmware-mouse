import React from 'react';

type SwitchSize = 'small' | 'medium' | 'large';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
}

const sizeMap: Record<SwitchSize, { width: number; height: number; knob: number }> = {
  small: { width: 36, height: 18, knob: 12 },
  medium: { width: 46, height: 24, knob: 18 },
  large: { width: 60, height: 32, knob: 26 },
};

export const Switch: React.FC<SwitchProps> = ({ checked = false, onChange, size = 'medium' }) => {
  const { width, height, knob } = sizeMap[size];
  const translateX = width - height; // 滑块移动距离

  return (
    <label className="switch" style={{ width: `${width}px`, height: `${height}px` }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
      <span
        className="slider"
        style={{
          borderRadius: `${height / 2}px`,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: `${(height - knob) / 2}px`,
            left: `${(height - knob) / 2}px`,
            width: `${knob}px`,
            height: `${knob}px`,
            borderRadius: '50%',
            background: '#fff',
            transition: 'transform 0.3s',
            transform: checked ? `translateX(${translateX}px)` : 'translateX(0)',
          }}
        />
      </span>
    </label>
  );
};
