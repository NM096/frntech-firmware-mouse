import header from '@/assets/header.png';
import main_normal_top from '@/assets/main_normal_top.png';
import { useCallback } from 'react';

export default function Header() {
  const handleQuestionClick = useCallback(() => {}, []);
  const handleScreenSmallClick = useCallback(() => {}, []);
  const handleScreenBigClick = useCallback(() => {}, []);

  return (
    <div className="header-container">
      <img src={header} alt="header.png" />
      <div className="header-btn-list">
        <div className="header-btn-item btn-question" onClick={handleQuestionClick}></div>
        <div className="header-btn-item btn-screen-small" onClick={handleScreenSmallClick}></div>
        <div className="header-btn-item btn-screen-big" onClick={handleScreenBigClick}></div>
      </div>
    </div>
  );
}
