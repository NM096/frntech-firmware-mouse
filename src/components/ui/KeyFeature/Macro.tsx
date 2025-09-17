import Dropdown from '@/components/common/Dropdown';
import CustomRadio from '@/components/common/CustomRadio';
import Checkbox from '@/components/common/Checkbox';
import React, { useEffect } from 'react';
import { getMacroCategorys, getMacros, readMacro } from '@/utils/driver';
import type { KeyDefine, KeyItem } from '@/types/profile';
interface MacroProps {
  onChange?: (keyDefine: KeyItem) => void;
  initialMacro?: KeyDefine;
}

const Macro: React.FC<MacroProps> = ({ onChange, initialMacro }) => {
  const [categorys, setCategorys] = React.useState<string[]>([]);
  const [macros, setMacros] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedMacro, setSelectedMacro] = React.useState<string>('');
  const [macroType, setMacroType] = React.useState<number>(1);
  const [cycles, setCycles] = React.useState<number>(1);
  const macroTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    // fontWeight: 'bold',
    margin: '10px 0 10px 0',
  };
  useEffect(() => {
    handleChangeMacro(selectedMacro);
    console.log('selectedMacro', initialMacro);
  }, [selectedMacro, macroType, cycles]);

  const handleChangeMacro = (macroName: string) => {
    readMacro(selectedCategory, macroName, (payload) => {
      console.log('readMacro ', payload);
      onChange?.({
        Name: macroName,
        Value: '0x8000',
        Show: macroName,
        Lang: macroName,
        Macro: {
          Category: selectedCategory,
          Name: selectedMacro,
          Type: macroType.toString(),
          Cycles: String(cycles),
          Content: payload.Content,
        },
      });
    });
    setSelectedMacro(macroName);
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
          onChange={() => setSelectedCategory(selectedCategory)}
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
            type="number"
            max={1000}
            min={1}
            value={cycles}
            onChange={(e) => setCycles(Number(e.target.value))}
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
