import React, { useEffect, useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  data: string[];
  onChange?: (value: number) => void;
}
const Slider: React.FC<SliderProps> = ({ initialValue = 5, data, onChange }) => {
  // 默认 value 直接是索引
  const [value, setValue] = useState(0);

  const findInitialIndex = () => {
    const index = data.findIndex((item) => Number(item) === initialValue);
    return index !== -1 ? index : 0;
  };

  useEffect(() => {
    const idx = findInitialIndex();
    if (idx !== value) {
      setValue(idx);
    }
  }, [initialValue, data]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = Number(e.target.value);
    setValue(newIndex);
    onChange?.(Number(data[newIndex]));
  };

  const position = ((value - 0) / (data.length - 1)) * 100;

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
          background: `linear-gradient(to right, #d4d6d6 ${position}%, #3c4041 ${position}%)`,
        }}
      />
      <div className="slider2-thumb-value" style={{ left: `${position}%` }}>
        {data[value]}
      </div>
    </div>
  );
};
export default Slider;
