import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
interface DropdownProps {
  borderColor: string;
  options: string[];
  onChange: (value: string) => void;
  size?: 'small' | 'medium' | 'large';
  defaultValue?: string; // 新增默认值
}

const Dropdown: React.FC<DropdownProps> = ({
  borderColor,
  options,
  onChange,
  size = 'medium',
  defaultValue = '', // 默认空字符串
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (option: string) => {
    setIsOpen(false);
    onChange(option);
  };

  const buttonStyle: React.CSSProperties = {
    width: `calc(100% - ${(size === 'small' ? 5 : size === 'medium' ? 10 : 15) * 2}px)`,
    padding: size === 'small' ? '5px' : size === 'medium' ? '10px' : '15px',
    border: `1px solid ${borderColor}`,
    backgroundColor: '#4c4f51',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '20px',
    borderRadius: '4px',
    position: 'relative',
  };

  const triangleStyle: React.CSSProperties = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: `5px solid ${borderColor}`,
  };

  const listStyle: React.CSSProperties = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: '100%',
    width: '100%',
    backgroundColor: '#050606',
    border: `1px solid ${borderColor}`,
    borderTop: 'none',
    zIndex: 10,
    maxHeight: '100px',
    overflowY: 'auto',
  };

  const itemStyle: React.CSSProperties = {
    padding: size === 'small' ? '5px' : size === 'medium' ? '10px' : '15px',
    fontSize: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={buttonStyle} onClick={toggleDropdown}>
        {t(defaultValue) || '请选择'}
        <span style={triangleStyle}></span>
      </div>
      {isOpen && (
        <ul style={listStyle}>
          {options.map((option, index) => (
            <li key={index} style={itemStyle} onClick={() => handleSelect(option)} className="dropdown-item">
              {t(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
