import Mouse from '@/assets/mouse.png';
import Scroller from '@/assets/scroller.png';
import { useState } from 'react';
import MultiSelect from '@/components/common/MultiSelect';

export default function ButtonSetting() {
  const keys = [0, 1, 2, 3, 4, 5];

  const options = [
    { label: 'Option 1', value: '1' },
    {
      label: 'Nested Option',
      value: '2',
      children: [
        { label: 'Sub Option A', value: '2-a' },
        { label: 'Sub Option B', value: '2-b' },
      ],
    },
  ];
  const [value, setvalue] = useState('');
  const handleOnchange = (val) => {
    setvalue(val);
  };
  return (
    <div className="button-container">
      <div className="key-map">
        <div className="key-map-container">
          <div className="key-map-title">Button Setting</div>
          {keys.map((key, index) => {
            return (
              <div key={key} className="select-item">
                <div className="select-item-label">
                  <div className="idx">{index + 1}</div>
                  <span className="select-item-title">Key #1</span>
                </div>
                <MultiSelect
                  options={options}
                  value={value}
                  onChange={handleOnchange}
                  position="bottom-left" // Control position here
                />
              </div>
            );
          })}
          <div className="key-scroller">
            <div className="select-item-label">
              <div className="idx">{7}</div>
            </div>
            <img src={Scroller} alt="Scroller" />
            <div className="key-scroller-content">
              <div className="key-scroller-item">
                <div className="key-scroller-item-title">Front Rolling</div>
                <MultiSelect
                  options={options}
                  value={value}
                  onChange={handleOnchange}
                  position="bottom-left" // Control position here
                />
              </div>
              <div className="key-scroller-item">
                <div className="key-scroller-item-title">Back Rolling</div>
                <MultiSelect
                  options={options}
                  value={value}
                  onChange={handleOnchange}
                  position="bottom-left" // Control position here
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mouse">
        <img src={Mouse} alt="Mouse" className="mouse-img" />
      </div>
    </div>
  );
}
