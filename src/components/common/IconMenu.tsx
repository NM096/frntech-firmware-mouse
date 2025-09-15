import React, { useState, useRef, useEffect } from 'react';

interface IconMenuProps {
  icon: React.ReactNode;
  menu: Array<{ label: string; value: string; onClick: () => void }>;
}

const IconMenu: React.FC<IconMenuProps> = ({ icon, menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => setIsOpen(!isOpen)}>{icon}</div>
      {isOpen && (
        <ul
          className="icon-menu-container"
          style={{
            position: 'absolute',
            left: '100%', // 贴在 icon 右边
            top: 0,
            margin: 0,
            padding: '0 0',
            listStyle: 'none',
            backgroundColor: '#000',
            border: '1px solid var(--secondary)',
            borderRadius: '4px',
            minWidth: '100px',
            zIndex: 1000,
            fontSize: '12px',
          }}
        >
          {menu.map((item) => (
            <li
              key={item.value}
              className="icon-menu-item"
              onClick={() => {
                item.onClick();
                setIsOpen(false); // 点击菜单项后关闭
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IconMenu;
