import React, { useEffect, useState } from 'react';

type Size = 'small' | 'medium' | 'large';

interface CustomRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  customSize?: Size;
  color?: string;
  label?: React.ReactNode;
  disabled?: boolean;
}

const sizeMap = {
  small: 12,
  medium: 20,
  large: 28,
} as const;

const CustomRadio: React.FC<CustomRadioProps> = (props) => {
  const {
    customSize = 'medium',
    color = '#eb3d29',
    checked: checkedProp,
    defaultChecked,
    disabled = false,
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
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        gap: 8,
        width: 30,
        height: 30,
        justifyContent: 'center',
        ...style,
      }}
    >
      <input
        {...rest}
        type="radio"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#7f8684';
        }}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          width: outer,
          height: outer,
          borderRadius: '50%',
          border: '2px solid #7f8684',
          background: '#5d1308',
          cursor: 'pointer',
          position: 'relative', // 让 label 内的绝对定位 span 参照此定位
          padding: 0,
          margin: 0,
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
      />

      <span
        aria-hidden
        style={{
          width: inner,
          background: checked ? color : 'transparent',
          height: inner,
          position: 'absolute',
          borderRadius: '50%',
          transform: 'translateY(-50%)',
          top: '50%',
          left: 0,
          right: 0,
          margin: '0 auto',
          pointerEvents: 'none',
          transition: 'background 0.15s ease 0s',
        }}
      />

      {/* 可选 label 文本 */}
      {label && <span style={{ userSelect: 'none' }}>{label}</span>}
    </label>
  );
};

export default CustomRadio;
