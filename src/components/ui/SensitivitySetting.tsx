import CustomRadio from '../common/CustomRadio';
import { useModal } from '../common/ModalContext';
import Slider from '../common/Slider';
import Slider2 from '../common/Slider2';
import { useEffect } from 'react';

export default function SensitivitySetting() {
  const dpiList = [1, 2, 3, 4, 5, 6];
  const { openMacroManager } = useModal();
  useEffect(() => {
    openMacroManager({});
  }, []);
  return (
    <div className="sensitivity-setting-container">
      <div className="dpi-setting">
        <div className="setting-title">DPI Setting</div>
        {dpiList.map((item, index) => {
          return (
            <div className="dpi-item" key={item}>
              <div className="dpi-title">
                <CustomRadio customSize="small" />
                <div>DPI Setting #{index + 1}</div>
              </div>
              <Slider onChange={() => {}} />
            </div>
          );
        })}
      </div>
      <div className="sensitivity-setting">
        <div className="setting-title">Sensitivity Setting</div>
        <div className="x-setting">
          <div className="xy-title">X</div>
          <Slider2 data={[-5, -4, -3, -1, 0, 1, 2, 3, 4, 5]} />
        </div>
        <div className="y-setting">
          <div className="xy-title">Y</div>
          <Slider2 data={[-5, -4, -3, -1, 0, 1, 2, 3, 4, 5]} />
        </div>
        <div className="xy-setting">
          <CustomRadio customSize="medium" />
          <div>XY Sync Direction of Movement</div>
        </div>
      </div>
    </div>
  );
}
