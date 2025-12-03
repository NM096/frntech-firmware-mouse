import React, { useEffect, useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  data: (string | number)[];
  onChange?: (value: number) => void;
}
const Slider: React.FC<SliderProps> = ({ initialValue = 5, data, onChange }) => {
  // 默认 value 直接是索引
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(initialValue !== -1 ? initialValue : 0);
  }, [initialValue, data]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = Number(e.target.value);
    setValue(newIndex);
    onChange?.(Number(newIndex));
  };

  const position = (value / (data.length - 1)) * 100;

  return (
    <div className="slider2-wrapper">
      <input
        type="range"
        className="slider2"
        value={value}
        onChange={handleSliderChange}
        min={0}
        max={data.length - 1}
        step={1}
        style={{
          background: `linear-gradient(to right, #2a2a2a ${position}%, #2a2a2a ${position}%)`,
        }}
      />
      <div className="slider2-marks">
        {data.map((item, index) => (
          <div key={index} className="slider2-mark" style={{ left: `${(index / (data.length - 1)) * 100}%` }}>
            {item}
          </div>
        ))}
      </div>
      <div className="slider2-thumb-value" style={{ left: `${position}%` }}></div>
    </div>
  );
};
export default Slider;
