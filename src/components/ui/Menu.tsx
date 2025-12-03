import { useState } from 'react';

export default function Menu() {
  const menuList = ['SENSITIVITYSETTING', 'SYSTEMSETTING', 'BUTTONSETTING'];
  const [activeIndex, setActiveIndex] = useState<(typeof menuList)[number]>(menuList[4]);

  return (
    <div className="menu-container">
      <div className="menu-item unactive"></div>
      {menuList.map((item, index) => (
        <div
          key={index}
          className={`menu-item ${activeIndex === item ? 'active' : ''}`}
          onClick={() => setActiveIndex(item)}
        ></div>
      ))}
    </div>
  );
}
