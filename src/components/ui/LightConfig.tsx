import mouse from '@/assets/ms_4/mouse.png';
import Dropdown from '@/components/common/Dropdown';
import Slider2 from '../common/Slider2';
import { SketchPicker, ColorResult } from 'react-color';
import { useState } from 'react';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useTranslation } from 'react-i18next';
import { setLE } from '@/utils/driver';
import { useModal } from '@/components/common/ModalContext';
const LightConfig = () => {
  const { t } = useTranslation();
  const { openConfigLoading, close } = useModal();
  const [tempColor, setTempColor] = useState('');
  const { modelConfig, currentDevice, path, setCurrentDevice } = useBaseInfoStore();
  const { LETable = [] } = modelConfig || {};
  const { LEDEffect } = currentDevice?.Info || {};
  const handleChangeLe = (lang: string) => {
    const _loadingId = openConfigLoading({ proccess: 0 });
    const leItem = LETable.find((item) => item.Lang === lang);
    setLE(
      path,
      {
        ...LEDEffect,
        BLMode: leItem?.Value || 0,
      },
      (payload) => {
        if (payload) {
          setCurrentDevice({
            ...currentDevice,
            ...{ Info: { ...currentDevice?.Info, ...{ LEDEffect: { ...LEDEffect, BLMode: leItem?.Value || 0 } } } },
          } as any);
        }
        close(_loadingId);
      }
    );
  };
  return (
    <div className="light-config">
      <img src={mouse} alt="Mouse" className="mouse-bg" />
      <div className="light-container">
        <div className="light-container-select">
          模式:
          <label>
            <Dropdown
              borderColor="#ff7f0e"
              options={LETable.map((item) => item.Lang)}
              onChange={(lang) => handleChangeLe(lang)}
              defaultValue=""
              size="small"
            />
          </label>
        </div>
        <div className="light-container-item">
          <div>亮度:</div>
          <div className="light-stitle">调节鼠标灯光的亮度</div>
          <div className="light-container-slider">
            <Slider2 min={0} max={10} step={1} initialValue={5} data={[]} />
          </div>
        </div>

        <div className="light-container-item">
          <div>颜色:</div>
          <div className="light-stitle">调节鼠标的灯光颜色</div>
          <div
            style={{
              width: '400px',
              margin: '10px',
              backgroundColor: tempColor,
              height: '30px',
              borderRadius: '4px',
            }}
          ></div>
          <SketchPicker
            color={tempColor}
            onChange={(c: ColorResult) => setTempColor(c.hex)}
            styles={{
              default: {
                picker: {
                  width: '400px',
                  background: '#2c2c2c', // 修改整体背景色
                  borderRadius: '6px',
                  boxShadow: '0',
                },
                saturation: {
                  borderRadius: '6px',
                },
                hue: {
                  borderRadius: '6px',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LightConfig;
