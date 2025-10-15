import Slider from '../common/Slider';
import Checkbox from '../common/Checkbox';
import ColorPicker from '../common/ColorPicker';
import CustomRadio from '../common/CustomRadio';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { setCurrentProfile, setDPI, setConfigData } from '@/utils/driver';
import { useProfileStore } from '@/store/useProfile';
import type { Dpi } from '@/types/profile';
import { cloneDeep } from 'lodash';
import type { Config } from '@/types/data-config';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';
const baseUrl = import.meta.env.BASE_URL;
const findOpenDpiIndex = (num: number, DPIs: Dpi[]) => {
  let count = 0;
  for (let i = 0; i <= DPIs.length; i++) {
    if (DPIs[i]?.Open || false) {
      if (count === num) {
        return i;
      }
      count++;
    }
  }
  return null;
};

const DpiConfig = () => {
  const { t } = useTranslation();
  const {
    currentDevice,
    currentModelID,
    mode,
    path,
    modelConfig,
    setCurrentDevice,
    configData,
    setConfigData: setConfigDataOnStore,
  } = useBaseInfoStore();
  const { currentConfigFileName } = useBaseInfoStore();
  const { profile, setProfile } = useProfileStore();
  const DPIs: Dpi[] = profile?.DPIs || [];
  const { DPILevels } = currentDevice?.Info || {};
  const [currentDpiIdx, setCurrentDpiIdx] = useState<number>(findOpenDpiIndex(DPILevels?.[mode] || 0, DPIs) || 0);
  const handleSwitchOpenDpi = throttle((index: number, isChecked: boolean) => {
    if (index === currentDpiIdx) {
      return;
    }
    if (DPIs.filter((dpi) => dpi.Open).length === 1 && !isChecked) {
      return;
    }
    const newDPILevels: number[] = cloneDeep(DPILevels) || [];
    const newDPIs = DPIs.map((dpi, idx) => {
      if (idx === index) {
        dpi.Open = isChecked;
      }
      return dpi;
    });
    // 如果关闭的DPI在当前DPI索引之前，动态更改鼠标DPI等级
    if (index < currentDpiIdx) {
      newDPILevels[mode] = isChecked ? newDPILevels[mode] + 1 : newDPILevels[mode] - 1;
    }
    setDPI(
      path,
      mode,
      {
        DPILevels: newDPILevels,
        DPIs: newDPIs.filter((dpi) => dpi.Open),
      },
      () => {
        setCurrentDevice({
          ...currentDevice,
          Info: {
            ...currentDevice?.Info,
            DPILevels: newDPILevels,
          },
        });
        setCurrentProfile(currentModelID, currentConfigFileName, { ...profile, DPIs: newDPIs }, (payload) => {
          if (payload) {
            setProfile({ ...profile, DPIs: newDPIs });
          }
        });
      }
    );
    const newDPILEDs = newDPIs?.filter((dpi) => dpi.Open).map((dpi, i) => ({ Index: i, Value: dpi.Color }));
    setConfigData(path, { ...(configData as Config), DPILEDs: newDPILEDs || [] }, () => {
      setConfigDataOnStore({ ...(configData as Config), DPILEDs: newDPILEDs || [] });
    });
  }, 1000);

  const handleChangeDpi = (index: number, value: Dpi) => {
    const newDPIs = DPIs.map((dpi, i) => {
      if (i === index) {
        dpi = {
          ...value,
          Level: dpi.Level,
          Open: dpi.Open,
          Color: dpi.Color,
        };
      }
      return dpi;
    });
    setDPI(
      path,
      mode,
      {
        DPILevels: currentDevice?.Info?.DPILevels,
        DPIs: newDPIs.filter((dpi) => dpi.Open),
      },
      () => {
        setCurrentProfile(currentModelID, currentConfigFileName, { ...profile, DPIs: newDPIs }, (payload) => {
          if (payload) {
            setProfile({ ...profile, DPIs: newDPIs });
          }
        });
      }
    );
  };

  const handleChangeCurrentDpiIdx = (idx: number) => {
    if (DPIs[idx].Open === false) {
      return;
    }
    const newDPIs = DPIs.filter((dpi) => dpi.Open);
    // 查找idx 在所有开启的DPI中的位置
    const currentDpi = DPIs[idx];
    const currentDpiIndex = newDPIs.findIndex((dpi) => dpi.Level === currentDpi.Level);
    const newDPILevels: number[] = cloneDeep(DPILevels) || [];
    newDPILevels[mode] = currentDpiIndex;
    setCurrentDpiIdx(idx);
    setDPI(
      path,
      mode,
      {
        DPILevels: newDPILevels,
        DPIs: newDPIs,
      },
      (result) => {
        if (result) {
          setCurrentDevice({
            ...currentDevice,
            Info: {
              ...currentDevice?.Info,
              DPILevels: newDPILevels,
            },
          });
        }
      }
    );
  };

  const handleChangeDpiLed = (index: number, hex: string) => {
    const newDPIs = DPIs?.map((dpi, i) => (i === index ? { ...dpi, Color: hex } : dpi));
    const newDPILEDs = newDPIs?.filter((dpi) => dpi.Open).map((dpi, i) => ({ Index: i, Value: dpi.Color }));
    setConfigData(path, { ...(configData as Config), DPILEDs: newDPILEDs || [] }, () => {
      setConfigDataOnStore({ ...(configData as Config), DPILEDs: newDPILEDs || [] });
      setProfile({ ...profile, DPIs: newDPIs });
      setCurrentProfile(currentModelID, currentConfigFileName, { ...profile, DPIs: newDPIs });
    });
  };

  useEffect(() => {
    setCurrentDpiIdx(findOpenDpiIndex(currentDevice?.Info?.DPILevels?.[mode] || 0, DPIs) || 0);
  }, [currentDevice, profile]);

  return (
    <div className="dpi-config">
      <div className="mouse-container">
        <img
          src={`${baseUrl}device/${currentDevice?.Model?.ModelID}/img/mouse.png`}
          alt={currentDevice?.Model?.Name}
          className="mouse-bg"
        />
      </div>
      <div className="dpi-container">
        <div>{t('dpi_adjustment')}</div>
        {DPIs.map((dpi, index) => {
          return (
            <div className="dpi-container-item" key={dpi.Level || index}>
              <Checkbox
                checked={dpi.Open || false}
                size={16}
                onChange={(e) => {
                  handleSwitchOpenDpi(index, e.target.checked);
                }}
              />
              <CustomRadio
                checked={currentDpiIdx === index}
                onChange={() => {
                  handleChangeCurrentDpiIdx(index);
                }}
              />
              <div className="dpi-title">
                {t('dpi_level')} {index + 1}
              </div>
              <Slider
                initialValue={dpi.Value}
                onChange={(value) => {
                  handleChangeDpi(index, value);
                }}
              />
              {modelConfig?.DPI?.FullColor ? (
                <ColorPicker
                  top={index == 0 ? -50 : index == DPIs.length - 1 ? -300 : -200}
                  initialValue={DPIs[index]?.Color || ''}
                  onChange={(hex) => handleChangeDpiLed(index, hex)}
                />
              ) : (
                <ColorPicker
                  top={index == 0 ? -50 : index == DPIs.length - 1 ? -100 : -50}
                  initialValue={DPIs[index]?.Color || ''}
                  simple
                  simpleColors={[
                    '#aa0000',
                    '#00ff00',
                    '#0055ff',
                    '#ff55ff',
                    '#ffff00',
                    '#00ffff',
                    '#ffffff',
                    '#000000',
                  ]}
                  onChange={(hex) => handleChangeDpiLed(index, hex)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DpiConfig;
