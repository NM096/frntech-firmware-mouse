import Dropdown from '@/components/common/Dropdown';
import Slider2 from '../common/Slider2';
import { useState, useCallback } from 'react';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useTranslation } from 'react-i18next';
import { setLE } from '@/utils/driver';
import CustomRadio from '../common/CustomRadio';
import { debounce } from 'lodash';
const baseUrl = import.meta.env.BASE_URL;

const LightConfig = () => {
  const { t } = useTranslation();
  const { modelConfig, currentDevice, path, setCurrentDevice } = useBaseInfoStore();
  const { LETable = [] } = modelConfig || {};
  const { LEDEffect } = currentDevice?.Info || {};

  const [direction, setDirection] = useState(LEDEffect?.BLDirection || 0);
  const [brightness, setBrightness] = useState(LEDEffect?.Brightness || 0);
  const [speed, setSpeed] = useState(LEDEffect?.Speed || 0);

  const [currentLeInfo, setCurrentLeInfo] = useState(
    LETable.find((item) => item.Value === LEDEffect?.BLMode) || LETable[0]
  );
  const colorList = [
    '#aa0000',
    '#00ff00',
    '#0055ff',
    '#ff55ff',
    '#ffff00',
    '#00ffff',
    '#ffffff',
    'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
  ];
  const handleChangeLe = (lang: string) => {
    const leItem = LETable.find((item) => item.Lang === lang);
    setCurrentLeInfo(leItem || LETable[0]);
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
      }
    );
  };

  // 亮度变化处理
  const handleBrightnessChange = useCallback(
    debounce((value: number) => {
      setBrightness(value);
      setLE(
        path,
        {
          ...LEDEffect,
          Brightness: value,
        },
        (payload) => {
          if (payload) {
            setCurrentDevice({
              ...currentDevice,
              ...{ Info: { ...currentDevice?.Info, ...{ LEDEffect: { ...LEDEffect, Brightness: value } } } },
            } as any);
          }
        }
      );
    }, 300),
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );

  // 速度变化处理
  const handleSpeedChange = useCallback(
    debounce((value: number) => {
      setSpeed(value);
      setLE(
        path,
        {
          ...LEDEffect,
          Speed: 3 - value,
        },
        (payload) => {
          if (payload) {
            setCurrentDevice({
              ...currentDevice,
              ...{ Info: { ...currentDevice?.Info, ...{ LEDEffect: { ...LEDEffect, Speed: value } } } },
            } as any);
          }
        }
      );
    }, 300),
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );

  // 方向变化处理
  const handleDirectionChange = useCallback(
    (value: number) => {
      setDirection(value);
      setLE(
        path,
        {
          ...LEDEffect,
          Direction: value,
        },
        (payload) => {
          if (payload) {
            setCurrentDevice({
              ...currentDevice,
              ...{ Info: { ...currentDevice?.Info, ...{ LEDEffect: { ...LEDEffect, BLDirection: value } } } },
            } as any);
          }
        }
      );
    },
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );

  // 颜色变化处理
  const handleColorChange = useCallback(
    debounce((color: string) => {
      setLE(
        path,
        {
          ...LEDEffect,
          Color: color,
        },
        (payload) => {
          if (payload) {
            setCurrentDevice({
              ...currentDevice,
              ...{ Info: { ...currentDevice?.Info, ...{ LEDEffect: { ...LEDEffect, Color: color } } } },
            } as any);
          }
        }
      );
    }, 300),
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );
  return (
    <div className="light-config">
      <div className="mouse-container">
        <img
          src={`${baseUrl}device/${currentDevice?.Model?.ModelID}/img/mouse.png`}
          alt={currentDevice?.Model?.Name}
          className="mouse-bg"
        />
      </div>
      <div className="light-container">
        <div className="light-container-select">
          {t('light_effect')}
          <label>
            <Dropdown
              borderColor="#ff7f0e"
              options={LETable.map((item) => item.Lang || '')}
              onChange={(lang) => handleChangeLe(lang)}
              defaultValue={currentLeInfo.Lang}
              size="small"
            />
          </label>
        </div>
        {(currentLeInfo?.Config ?? 0) & 0x01 ? (
          <div className="light-container-item">
            <div>{t('brightness')}</div>
            <div className="light-stitle">{t('adjust_mouse_light_brightness')}</div>
            <div className="light-container-slider">
              <Slider2
                initialValue={brightness + 1}
                onChange={(value) => handleBrightnessChange(value)}
                data={['0', '1', '2', '3']}
              />
            </div>
          </div>
        ) : null}
        {!((currentLeInfo?.Config ?? 0) & 0x02) ? (
          <div className="light-container-item">
            <div>{t('speed')}:</div>
            <div className="light-stitle">{t('adjust_mouse_light_speed')}</div>
            <div className="light-container-slider">
              <Slider2
                initialValue={speed}
                onChange={(value) => handleSpeedChange(value)}
                data={['0', '1', '2', '3']}
              />
            </div>
          </div>
        ) : null}
        {(currentLeInfo?.Config ?? 0) & 0x04 ? (
          <div className="light-container-item">
            <div>{t('direction')}:</div>
            <div className="light-stitle">{t('adjust_mouse_light_direction')}</div>
            <div className="light-container-slider direction-btn-group">
              <label className="direction-btn-radio">
                <CustomRadio checked={direction === 0} onChange={() => handleDirectionChange(0)} />
                {t('reverse')}
              </label>
              <label className="direction-btn-radio">
                <CustomRadio checked={direction === 1} onChange={() => handleDirectionChange(1)} />
                {t('forward')}
              </label>
            </div>
          </div>
        ) : null}
        {(currentLeInfo?.Config ?? 0) & 0x08 ? (
          <div className="light-container-item">
            <div>{t('color')}:</div>
            <div className="light-stitle">{t('adjust_mouse_light_color')}</div>
            {colorList.map((color, index) => {
              return (
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    display: 'inline-block',
                    margin: '0 10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    background: color,
                  }}
                  key={color}
                  onClick={() => handleColorChange(index)}
                ></div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LightConfig;
