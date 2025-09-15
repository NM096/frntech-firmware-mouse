import Dropdown from '@/components/common/Dropdown';
import CustomRadio from '@/components/common/CustomRadio';
import Checkbox from '@/components/common/Checkbox';
import React, { useEffect } from 'react';
import { getMacroCategorys, getMacros, readMacro } from '@/utils/driver';
const Macro = () => {
  const [categorys, setCategorys] = React.useState<string[]>([]);
  const [macros, setMacros] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedMacro, setSelectedMacro] = React.useState<string>('');
  const [macroType, setMacroType] = React.useState<number>(0);
  const macroTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    // fontWeight: 'bold',
    margin: '10px 0 10px 0',
  };
  const handleChange = (value: string) => {
    console.log('Selected macro:', value);
  };
  useEffect(() => {
    getMacroCategorys((payload) => {
      setCategorys(payload);
      if (payload.length > 0) {
        setSelectedCategory(payload[0]);
      }
    });
  }, []);
  useEffect(() => {
    getMacros(selectedCategory, (payload) => {
      setMacros(payload);
    });
  }, [selectedCategory]);

  return (
    <div className="macro-container">
      <div style={macroTitleStyle}>宏组</div>
      <div style={{ width: '90%' }}>
        <Dropdown
          borderColor="#ff7f0e"
          options={categorys}
          defaultValue={selectedCategory}
          onChange={handleChange}
          size="small" // 选择 'small', 'medium' 或 'large'
        />
      </div>
      <div style={macroTitleStyle}>宏列表</div>
      <ul
        style={{
          height: '150px',
          overflowY: 'auto',
          marginBottom: '10px',
          background: '#373838',
          borderRadius: '4px',
          overflow: 'scroll-y',
        }}
      >
        {macros.map((macro, index) => (
          <li
            className={`macro-item ${selectedMacro === macro ? 'active' : ''}`}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onClick={() => setSelectedMacro(macro)}
            key={index}
          >
            {macro}
          </li>
        ))}
      </ul>
      <div style={macroTitleStyle}>宏触发方式</div>
      <div className="macro-trigger-options">
        <div className="macro-trigger-item">
          <CustomRadio
            customSize="small"
            checked={macroType === 1}
            onChange={() => {
              setMacroType(1);
            }}
          />
          <input
            type="text"
            style={{ width: '50px', marginLeft: '8px', background: 'white', color: '#000', textAlign: 'center' }}
          />
          循环次数播放
        </div>
        <div className="macro-trigger-item">
          <CustomRadio
            customSize="small"
            checked={macroType === 2}
            onChange={() => {
              setMacroType(2);
            }}
          />
          任意键按下停止播放
        </div>
        <div className="macro-trigger-item">
          <CustomRadio
            customSize="small"
            checked={macroType === 3}
            onChange={() => {
              setMacroType(3);
            }}
          />
          按住播放，松开停止
        </div>
        <div className="macro-trigger-item">
          <CustomRadio
            customSize="small"
            checked={macroType === 4}
            onChange={() => {
              setMacroType(4);
            }}
          />
          当前宏键按下停止播放
        </div>
        <div className="macro-trigger-item">
          <Checkbox size={15} onChange={() => {}} />
          左键宏
        </div>
      </div>
    </div>
  );
};
export default Macro;
