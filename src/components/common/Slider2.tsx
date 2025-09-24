import React, { useEffect, useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  data: string[]; // 新增 data 属性
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min = 0, max = 10, step = 1, initialValue = 5, data, onChange }) => {
  const [value, setValue] = useState(0);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onChange?.(newValue);
  };

  const findInitialIndex = () => {
    const index = data.findIndex((item) => Number(item) === initialValue);
    return index !== -1 ? index : 0;
  };
  useEffect(() => {
    setValue(findInitialIndex());
  }, [initialValue]);
  const position = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider2-wrapper">
      <input
        type="range"
        className="slider2"
        value={value}
        onChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        style={{
          background: `linear-gradient(to right, #d4d6d6 ${position}%, #3c4041 ${position}%)`,
        }}
      />
      {/* 把数值显示在 thumb 里 */}
      <div className="slider2-thumb-value" style={{ left: `${position}%` }}>
        {data[value]}
      </div>
    </div>
  );
};

export default Slider;
