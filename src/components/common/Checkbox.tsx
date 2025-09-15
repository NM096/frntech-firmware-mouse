import React from 'react';

interface CustomCheckboxProps {
  size?: number;
  color?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  size = 20,
  color = 'var(--secondary)',
  checked = false,
  onChange,
}) => {
  return (
    <label className="custom-checkbox">
      <input type="checkbox" className="checkbox-input" checked={checked} onChange={onChange} />
      <span
        className="checkbox-icon"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: color,
          backgroundColor: 'transparent',
        }}
      ></span>
    </label>
  );
};

export default CustomCheckbox;
