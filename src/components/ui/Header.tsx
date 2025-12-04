import header from '@/assets/header.png';
import { useCallback } from 'react';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
export default function Header() {
  const { smurfs } = useBaseInfoStore();
  const handleShowTips = useCallback(() => {}, [smurfs]);
  const handleMinScreen = useCallback(() => {
    smurfs?.minimizeApp();
  }, [smurfs]);
  const handleClose = useCallback(() => {
    smurfs?.closeApp();
  }, [smurfs]);

  return (
    <div className="header-container">
      <img src={header} alt="header.png" />
      <div className="header-btn-list">
        <div className="header-btn-item btn-question" onClick={handleShowTips}></div>
        <div className="header-btn-item btn-screen-small" onClick={handleMinScreen}></div>
        <div className="header-btn-item btn-screen-big" onClick={handleClose}></div>
      </div>
    </div>
  );
}
