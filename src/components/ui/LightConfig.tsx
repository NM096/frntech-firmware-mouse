import Dropdown from '@/components/common/Dropdown';
import Slider2 from '../common/Slider2';
import { SketchPicker, ColorResult } from 'react-color';
import { useState, useCallback } from 'react';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useTranslation } from 'react-i18next';
import { setLE } from '@/utils/driver';
import { useModal } from '@/components/common/ModalContext';
import CustomRadio from '../common/CustomRadio';
import { debounce } from 'lodash';
const baseUrl = import.meta.env.BASE_URL;

const LightConfig = () => {
  const { t } = useTranslation();
  const { openConfigLoading, close } = useModal();
  const [tempColor, setTempColor] = useState('');
  const { modelConfig, currentDevice, path, setCurrentDevice } = useBaseInfoStore();
  const { LETable = [] } = modelConfig || {};
  const { LEDEffect } = currentDevice?.Info || {};

  const [direction, setDirection] = useState(LEDEffect?.BLDirection || 0);
  const [brightness, setBrightness] = useState(LEDEffect?.Brightness || 0);
  const [speed, setSpeed] = useState(LEDEffect?.Speed || 0);

  const [currentLeInfo, setCurrentLeInfo] = useState(
    LETable.find((item) => item.Value === LEDEffect?.BLMode) || LETable[0]
  );

  const handleChangeLe = (lang: string) => {
    const _loadingId = openConfigLoading({ proccess: 0 });
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
        close(_loadingId);
      }
    );
  };

  // 亮度变化处理
  const handleBrightnessChange = useCallback(
    debounce((value: number) => {
      const _loadingId = openConfigLoading({ proccess: 0 });
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
          close(_loadingId);
        }
      );
    }, 300),
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );

  // 速度变化处理
  const handleSpeedChange = useCallback(
    debounce((value: number) => {
      const _loadingId = openConfigLoading({ proccess: 0 });
      setSpeed(value);
      setLE(
        path,
        {
          ...LEDEffect,
          Speed: value,
        },
        (payload) => {
          if (payload) {
            setCurrentDevice({
              ...currentDevice,
              ...{ Info: { ...currentDevice?.Info, ...{ LEDEffect: { ...LEDEffect, Speed: value } } } },
            } as any);
          }
          close(_loadingId);
        }
      );
    }, 300),
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );

  // 方向变化处理
  const handleDirectionChange = useCallback(
    (value: number) => {
      const _loadingId = openConfigLoading({ proccess: 0 });
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
          close(_loadingId);
        }
      );
    },
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );

  // 颜色变化处理
  const handleColorChange = useCallback(
    debounce((color: string) => {
      const _loadingId = openConfigLoading({ proccess: 0 });
      setTempColor(color);
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
          close(_loadingId);
        }
      );
    }, 300),
    [LEDEffect, path, currentDevice, setCurrentDevice]
  );
  return (
    <div className="light-config">
      <img
        src={`${baseUrl}device/${currentDevice?.Model?.ModelID}/img/mouse.png`}
        alt={currentDevice?.Model?.Name}
        className="mouse-bg"
      />
      <div className="light-container">
        <div className="light-container-select">
          模式:
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
            <div>亮度:</div>
            <div className="light-stitle">调节鼠标灯光的亮度</div>
            <div className="light-container-slider">
              <Slider2
                min={1}
                max={4}
                step={1}
                initialValue={brightness}
                onChange={(value) => handleBrightnessChange(value)}
                data={['0', '1', '2', '3']}
              />
            </div>
          </div>
        ) : null}
        {(currentLeInfo?.Config ?? 0) & 0x02 ? (
          <div className="light-container-item">
            <div>速度:</div>
            <div className="light-stitle">调节鼠标灯光的速度</div>
            <div className="light-container-slider">
              <Slider2
                min={1}
                max={4}
                step={1}
                initialValue={speed}
                onChange={(value) => handleSpeedChange(value)}
                data={['0', '1', '2', '3']}
              />
            </div>
          </div>
        ) : null}
        {(currentLeInfo?.Config ?? 0) & 0x04 ? (
          <div className="light-container-item">
            <div>方向:</div>
            <div className="light-stitle">调节鼠标灯光的方向</div>
            <div className="light-container-slider direction-btn-group">
              <label className="direction-btn-radio">
                <CustomRadio checked={direction === 0} onChange={() => handleDirectionChange(0)} />
                反向
              </label>
              <label className="direction-btn-radio">
                <CustomRadio checked={direction === 1} onChange={() => handleDirectionChange(1)} />
                正向
              </label>
            </div>
          </div>
        ) : null}
        {(currentLeInfo?.Config ?? 0) & 0x08 ? (
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
              onChange={(c: ColorResult) => handleColorChange(c.hex)}
              styles={{
                default: {
                  picker: {
                    width: '250px',
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
        ) : null}
      </div>
    </div>
  );
};

export default LightConfig;
