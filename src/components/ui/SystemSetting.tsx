import type { Dpi } from '@/types/profile';
import Slider2 from '../common/Slider2';
import CustomRadio from '../common/CustomRadio';

export default function SystemSetting() {
  const turboSpeedList = ['2ms', '65ms', '125ms', '190ms'];
  const rateList = ['125Hz', '250Hz', '500Hz'];
  return (
    <div className="system-setting-container">
      <div className="system-setting">
        <div className="setting-title">System Setting</div>
        <div className="setting-sub-title">The Double-Click Speed</div>
        <div className="setting-slider">
          <Slider2 onChange={() => {}} data={[1, 2, 3, 4, 5, 6, 7, 8]} />
        </div>
        <div className="setting-sub-title">Pointer Movement Speed</div>
        <div className="setting-slider">
          <Slider2 onChange={() => {}} data={[1, 2, 3, 4, 5, 6, 7, 8]} />
        </div>
        {/*  */}
        <div className="setting-sub-title slider-container">
          <CustomRadio customSize="small" />
          Enhanced Pointer Precision
        </div>

        <div className="line"></div>
        <div className="setting-sub-title">Horizontal Scrolling Speed</div>
        <div className="setting-slider">
          <Slider2 onChange={() => {}} data={[1, 2, 3, 4, 5, 6, 7, 8]} />
        </div>
        <div className="setting-sub-title">VerticalScrolling Speed</div>
        <div className="setting-slider">
          <Slider2 onChange={() => {}} data={[1, 2, 3, 4, 5, 6, 7, 8]} />
        </div>

        <div className="setting-sub-title slider-container">
          <CustomRadio customSize="small" />
          Scroll 1 Page
        </div>
      </div>
      <div className="advanced-setting">
        <div className="setting-title">Advanced Setting</div>
        <div className="setting-sub-title">Polling Rate</div>
        <div className="rate-list">
          {rateList.map((item) => {
            return (
              <div className="list-item">
                <CustomRadio customSize="small" />
                {item}
              </div>
            );
          })}
        </div>
        <div className="setting-sub-title">Turbo Speed</div>
        <div className="turbo-list">
          {turboSpeedList.map((item) => {
            return (
              <div className="list-item">
                <CustomRadio customSize="small" />
                {item}
              </div>
            );
          })}
        </div>
        <div className="reset-default">
          Factory Default <div className="reset-button">Reset</div>
        </div>
      </div>
    </div>
  );
}
