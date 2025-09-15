import Dropdown from '@/components/common/Dropdown';
import CustomRadio from '@/components/common/CustomRadio';
import Checkbox from '@/components/common/Checkbox';
import React from 'react';
const Macro = () => {
  const handleChange = (value: string) => {
    console.log('Selected macro:', value);
  };

  const macroTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    // fontWeight: 'bold',
    margin: '10px 0 10px 0',
  };
  return (
    <div className="macro-container">
      <div style={macroTitleStyle}>宏组</div>
      <div style={{ width: '90%' }}>
        <Dropdown
          borderColor="#ff7f0e"
          options={['常见', '呼吸', '虹虹', '循环呼吸', '常见DPI', '呼吸DPI']}
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
        {new Array(10).fill(0).map((_, index) => (
          <li
            className="macro-item"
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            key={index}
          >
            宏 {index + 1}
          </li>
        ))}
      </ul>
      <div style={macroTitleStyle}>宏触发方式</div>
      <div className="macro-trigger-options">
        <div className="macro-trigger-item">
          <CustomRadio customSize="small" onChange={() => {}} />
          <input type="text" style={{ width: '50px', marginLeft: '8px', background: 'white', color: '#000' }} />
          循环次数播放
        </div>
        <div className="macro-trigger-item">
          <CustomRadio customSize="small" onChange={() => {}} />
          任意键按下停止播放
        </div>
        <div className="macro-trigger-item">
          <CustomRadio customSize="small" onChange={() => {}} />
          按住播放，松开停止
        </div>
        <div className="macro-trigger-item">
          <CustomRadio customSize="small" onChange={() => {}} />
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
