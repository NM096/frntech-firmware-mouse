import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface MultiSelectOption {
  label: string;
  value: string | number;
  children?: MultiSelectOption[];
}

export type MultiSelectPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'right-top' | 'left-top';

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string | number;
  onChange?: (value: string | number, option: MultiSelectOption) => void;
  placeholder?: string;
  position?: MultiSelectPosition;
  className?: string;
  style?: React.CSSProperties;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  position = 'bottom-left',
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find selected label recursively
  const findLabel = (opts: MultiSelectOption[], val: string | number): string | null => {
    for (const opt of opts) {
      if (opt.value === val) return opt.label;
      if (opt.children) {
        const found = findLabel(opt.children, val);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedLabel = value ? findLabel(options, value) : null;

  const handleSelect = (option: MultiSelectOption) => {
    if (option.children && option.children.length > 0) {
      return;
    }

    onChange?.(option.value, option);
    setIsOpen(false);
  };

  const renderMenu = (opts: MultiSelectOption[], isSubmenu = false) => {
    return (
      <div
        className={isSubmenu ? 'multi-select-submenu' : `multi-select-dropdown pos-${position}` + ' custom-scrollbar'}
      >
        {opts.map((opt) => (
          <div
            key={opt.value}
            className={`multi-select-item ${value === opt.value ? 'selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(opt);
            }}
          >
            <div className="multi-select-item-label">{opt.label}</div>
            {opt.children && opt.children.length > 0 && (
              <>
                <ChevronRight size={14} />
                {renderMenu(opt.children, true)}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`multi-select-container ${className}`} ref={containerRef} style={style}>
      <div className="multi-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="multi-select-item-label">{selectedLabel || placeholder}</div>
        <ChevronDown size={16} />
      </div>
      {isOpen && renderMenu(options)}
    </div>
  );
};

export default MultiSelect;
