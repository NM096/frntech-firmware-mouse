import React, { useEffect, useState } from 'react';

type Size = 'small' | 'medium' | 'large';

interface CustomRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  customSize?: Size;
  color?: string;
  label?: React.ReactNode;
}

const sizeMap = {
  small: 16,
  medium: 20,
  large: 28,
} as const;

const CustomRadio: React.FC<CustomRadioProps> = (props) => {
  const {
    customSize = 'medium',
    color = 'var(--secondary)',
    checked: checkedProp,
    defaultChecked,
    onChange,
    label,
    style,
    ...rest
  } = props;

  const outer = sizeMap[customSize];
  // inner 取 outer - 6 (视觉上常用的差值)，你可以按需改
  const inner = outer - 6;

  const isControlled = checkedProp !== undefined;
  const [checked, setChecked] = useState<boolean>(!!(checkedProp ?? defaultChecked));

  useEffect(() => {
    if (isControlled) setChecked(!!checkedProp);
  }, [checkedProp, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setChecked(e.target.checked);
    onChange?.(e);
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        gap: 8,
        ...style,
      }}
    >
      <input
        {...rest}
        type="radio"
        checked={checked}
        onChange={handleChange}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#96999a';
        }}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          width: outer,
          height: outer,
          borderRadius: '50%',
          border: '2px solid #96999a',
          background: '#4c5151',
          cursor: 'pointer',
          position: 'relative', // 让 label 内的绝对定位 span 参照此定位
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
      />

      <span
        aria-hidden
        style={{
          position: 'absolute',
          width: inner,
          height: inner,
          borderRadius: '50%',
          background: checked ? color : 'transparent',
          top:
            customSize === 'small' ? 'calc(50% - 3px)' : customSize === 'large' ? 'calc(50% - 7px)' : 'calc(50% - 5px)',
          left:
            customSize === 'small' ? 'calc(50% - 4px)' : customSize === 'large' ? 'calc(50% - 8px)' : 'calc(50% - 6px)',
          // transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'background 0.15s',
        }}
      />

      {/* 可选 label 文本 */}
      {label && <span style={{ userSelect: 'none' }}>{label}</span>}
    </label>
  );
};

export default CustomRadio;
