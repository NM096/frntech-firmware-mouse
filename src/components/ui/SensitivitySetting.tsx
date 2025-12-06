import { useEffect, useState } from 'react';
import CustomRadio from '../common/CustomRadio';
import Slider from '../common/Slider';
import Slider2 from '../common/Slider2';
import { useMouse } from '@/hooks/useMouse';
import type { SmurfsDPI } from '@/lib/smurfs/smurfs.min';
import Profile from './Profile';
export default function SensitivitySetting() {
  const { profile, setProfile } = useMouse();
  const { DPIs } = profile?.Profile || {};
  const handleChangeDpi = (idx: number, dpiItem: SmurfsDPI) => {
    // setProfile({  }),
  };

  return (
    <div className="sensitivity-setting-container">
      <div className="dpi-setting">
        <div className="setting-title">DPI Setting</div>
        {[1, 2, 3, 4, 5, 6, 7]?.map((item, index) => {
          return (
            <div className="dpi-item" key={index}>
              <div className="dpi-title">
                <CustomRadio customSize="small" />
                <div>DPI Setting #{index + 1}</div>
              </div>
              <Slider
                onChange={(dpiItem) => {
                  handleChangeDpi(index, dpiItem);
                }}
                initialValue={item.DPI}
              />
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
