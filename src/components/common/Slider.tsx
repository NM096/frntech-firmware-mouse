import React, { useState, useRef, useEffect, memo } from 'react';
import type { Dpi } from '@/types/profile';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';

interface SliderProps {
  initialValue?: number;
  onChange: (value: Dpi) => void;
}

const Slider: React.FC<SliderProps> = memo(({ initialValue, onChange }) => {
  const { currentDevice, modelConfig } = useBaseInfoStore();
  const [dpiList, setDpiList] = useState<Dpi[]>([]);
  const min = dpiList.length > 0 ? dpiList[0].Level : 0;
  const max = dpiList.length > 0 ? dpiList[dpiList.length - 1].Level : 0;

  // state 统一保存 level
  const [value, setValue] = useState(min);
  const [inputValue, setInputValue] = useState<number | string>(initialValue || '');
  const [sliderWidth, setSliderWidth] = useState(0);
  const slider = useRef<HTMLInputElement | null>(null);

  // 计算 thumb 位置
  const position = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const clampedPosition = Math.min(Math.max(position, 0), 100);

  const handleSliderChange = (level: number) => {
    setValue(level);
    const dpi = dpiList.find((dpi) => dpi.Level === level) || dpiList[0];
    if (dpi) onChange(dpi);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    if (isNaN(inputValue)) {
      setInputValue(initialValue!);
      return;
    }
    if (inputValue == initialValue) {
      return;
    }
    const dpi = dpiList
      .filter((dpi) => dpi.DPI <= inputValue)
      .reduce((prev, current) => (current.DPI > prev.DPI ? current : prev), dpiList[0]);
    if (dpi) {
      setInputValue(dpi.DPI);
      setValue(dpi.Level);
      onChange(dpi);
    }
  };
  useEffect(() => {
    const { SensorInfo } = currentDevice?.Info || {};
    if (SensorInfo != null && SensorInfo.DPIType != 0) {
      setDpiList(SensorInfo?.DPIs || []);
    } else {
      setDpiList((modelConfig?.SensorInfo?.DPIs as any) || []);
    }
  }, [currentDevice, modelConfig]);

  // 初始化时同步一次
  useEffect(() => {
    if (dpiList.length === 0) return;
    if (!initialValue) {
      setInputValue(min);
      setValue(min);
      return;
    }
    const dpi = dpiList.find((dpi) => dpi.DPI === initialValue);
    if (dpi) {
      setValue(dpi.Level);
      setInputValue(initialValue);
    }
  }, [initialValue, dpiList]);

  // 监听窗口大小变化，更新 slider 宽度
  useEffect(() => {
    const updateWidth = () => {
      if (slider.current) {
        setSliderWidth(slider.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  useEffect(() => {});
  const showLabelValue = (level: number) => {
    const dpi = dpiList.find((dpi) => dpi.Level === level);
    return dpi ? dpi.DPI : level;
  };

  return (
    <div className="slider-wrapper">
      <div className="slider-container">
        {/* 白色块动态跟随 thumb */}
        <div
          className="slider-value"
          style={{
            width: '36px',
            left: `${(sliderWidth * clampedPosition) / 100 - 18}px`,
            top: '-30px',
            borderRadius: '4px',
          }}
        >
          {/* {showLabelValue(value)} */}
          <input
            type="number"
            style={{
              width: '36px',
              border: 'none',
              textAlign: 'center',
              fontSize: '10px',
            }}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onBlur={(e) => handleInputChange(e)}
          />
        </div>
        <input
          ref={slider}
          type="range"
          className="slider"
          value={value}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          min={min}
          max={max}
          step={1}
          style={{
            background: `linear-gradient(to right, #d4d6d6 ${clampedPosition}%, #3c4041 ${clampedPosition}%)`,
          }}
        />
      </div>
      <div className="slider-labels">
        <span className="slider-min">{dpiList[0]?.DPI ?? 0}</span>
        <span className="slider-max">{dpiList[dpiList.length - 1]?.DPI ?? 0}</span>
      </div>
    </div>
  );
});

export default Slider;
