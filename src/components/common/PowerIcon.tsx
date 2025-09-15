import React from 'react';
import ic_power from '@/assets/power_1.svg';

interface PowerProps {
  className?: string;
}

const Power: React.FC<PowerProps> = ({ className = 'power-icon' }) => {
  return (
    <div className={`power-wrapper ${className}`}>
      <img src={ic_power} alt="Power Icon" className="power-img" />
      <div className="battery-overlay">
        <div className="battery-fill"></div>
      </div>
    </div>
  );
};

export default Power;
