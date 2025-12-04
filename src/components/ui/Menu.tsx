interface MenuProp {
  onChange: (value) => void;
  value: string;
}

const Menu: React.FC<MenuProp> = ({ onChange, value }) => {
  const menuList = ['SENSITIVITYSETTING', 'SYSTEMSETTING', 'BUTTONSETTING'];
  return (
    <div className="menu-container">
      <div className="menu-item unactive"></div>
      {menuList.map((item, index) => (
        <div key={index} className={`menu-item ${value === item ? 'active' : ''}`} onClick={() => onChange(item)}></div>
      ))}
    </div>
  );
};

export default Menu;
