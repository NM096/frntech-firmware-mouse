import React, { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = '请选择' }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(options.find((opt) => opt.value === value) || null);
  const selectRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setOpen(false);
    onChange?.(option.value);
  };

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="selected" onClick={() => setOpen((prev) => !prev)}>
        {selected ? selected.label : placeholder}
      </div>
      {open && (
        <ul className="options">
          {options.map((opt) => (
            <li key={opt.value} onClick={() => handleSelect(opt)}>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
