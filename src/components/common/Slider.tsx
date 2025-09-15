import React, { useState, useRef, useEffect } from 'react';
import { useProfileStore } from '@/store/useProfile';
import type { Dpi } from '@/types/profile';
interface SliderProps {
  initialValue?: number;
  onChange: (value: Dpi) => void;
}

const Slider: React.FC<SliderProps> = ({ initialValue = 1, onChange }) => {
  const { defaultProfile } = useProfileStore();
  const dpiList = defaultProfile?.DPIs || [];
  const min = dpiList.length > 0 ? dpiList[0].Level : 0;
  const max = dpiList.length > 0 ? dpiList[dpiList.length - 1].Level : 0;
  const [value, setValue] = useState(min);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const slider = useRef<HTMLInputElement | null>(null);

  const position = ((value - min) / (max - min)) * 100;
  const clampedPosition = Math.min(position, 100);
  const sliderWidth = slider.current ? slider.current.offsetWidth : 0;
  const handleSliderChange = (value: string) => {
    setValue(Number(value));
    const dpi = dpiList.find((dpi) => dpi.Level == Number(value)) || dpiList[0];
    onChange(dpi);
  };
  useEffect(() => {
    const dpi = dpiList.find((dpi) => dpi.Value == initialValue);
    setValue(dpi ? dpi.Level : min);
  }, [initialValue, defaultProfile]);

  const showLabelValue = (step: number) => {
    const dpi = dpiList.find((dpi) => dpi.Level == step);
    return dpi ? dpi.DPI : step;
  };
  return (
    <div className="slider-wrapper">
      <div className="slider-container">
        {/* Display the current value as a white block */}
        <div
          ref={sliderRef}
          className="slider-value"
          style={{
            width: '36px',
            left: `${(sliderWidth * clampedPosition) / 100 - 18}px`, // Center the block above the thumb
          }}
        >
          {showLabelValue(value)}
        </div>
        <input
          ref={slider}
          type="range"
          className="slider"
          value={value}
          onChange={(e) => handleSliderChange(e.target.value)}
          min={min}
          max={max}
          step={1}
          style={{
            background: `linear-gradient(to right, #d4d6d6 ${clampedPosition}%, #3c4041 ${clampedPosition}%)`, // Left side green (used part)
          }}
        />
      </div>
      <div className="slider-labels">
        <span className="slider-min">{dpiList[0]?.DPI ?? 0}</span>
        <span className="slider-max">{dpiList[dpiList.length - 1]?.DPI ?? 0}</span>
      </div>
    </div>
  );
};

export default Slider;
