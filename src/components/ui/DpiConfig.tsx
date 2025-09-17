import Slider from '../common/Slider';
import Checkbox from '../common/Checkbox';
import ColorPicker from '../common/ColorPicker';
import CustomRadio from '../common/CustomRadio';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { setCurrentProfile, setDPI, getDeviceList, setConfigData } from '@/utils/driver';
import { useProfileStore } from '@/store/useProfile';
import { useModal } from '@/components/common/ModalContext';
import type { Dpi } from '@/types/profile';
import { cloneDeep } from 'lodash';
import type { DeviceData } from '@/types/device-data';
import type { Config } from '@/types/data-config';
import { useTranslation } from 'react-i18next';
const baseUrl = import.meta.env.BASE_URL;

const DpiConfig = () => {
  const { t } = useTranslation();
  const {
    currentDevice,
    currentModelID,
    mode,
    path,
    setCurrentDevice,
    setDeviceMap,
    configData,
    setConfigData: setConfigDataOnStore,
  } = useBaseInfoStore();
  const { profile, setProfile } = useProfileStore();
  const { DPIs = [] } = profile;
  const { DPILevels } = currentDevice?.Info || {};
  const { openConfigLoading, close, closeAll } = useModal();
  const handleSwitchOpenDpi = (index: number, isChecked: boolean) => {
    if (DPIs.filter((dpi) => dpi.Open).length === 1 && !isChecked) {
      return;
    }
    const _loadingId = openConfigLoading({ proccess: 0 });
    const newDPIs = DPIs.map((dpi, idx) => {
      if (idx === index) {
        dpi.Open = isChecked;
      }

      return dpi;
    });
    console.log('_loadingId', _loadingId);
    setDPI(
      path,
      mode,
      {
        DPILevels: currentDevice?.Info.DPILevels,
        DPIs: newDPIs.filter((dpi) => dpi.Open),
      },
      () => {
        setCurrentProfile(currentModelID, { ...profile, DPIs: newDPIs }, (payload) => {
          if (payload) {
            setProfile({ ...profile, DPIs: newDPIs });
          }
          closeAll();
        });
      }
    );
  };

  const handleChangeDpi = (index: number, value: Dpi) => {
    openConfigLoading({ proccess: 0 });
    const newDPIs = DPIs.map((dpi, i) => {
      if (i === index) {
        dpi = {
          ...value,
          Level: dpi.Level,
          Open: dpi.Open,
        };
      }
      return dpi;
    });
    setDPI(
      path,
      mode,
      {
        DPILevels: currentDevice?.Info.DPILevels,
        DPIs: newDPIs.filter((dpi) => dpi.Open),
      },
      () => {
        setCurrentProfile(currentModelID, { ...profile, DPIs: newDPIs }, (payload) => {
          if (payload) {
            setProfile({ ...profile, DPIs: newDPIs });
          }
          closeAll();
        });
      }
    );
  };

  const handleChangeCurrentDpiIdx = (idx: number) => {
    if (DPIs[idx].Open === false) {
      return;
    }
    const _loadingId = openConfigLoading({ proccess: 0 });
    const newDPIs = DPIs.filter((dpi) => dpi.Open);
    // 查找idx 在所有开启的DPI中的位置
    const currentDpi = DPIs[idx];
    const currentDpiIndex = newDPIs.findIndex((dpi) => dpi.Level === currentDpi.Level);
    const newDPILevels = cloneDeep(DPILevels) || [];
    newDPILevels[mode] = currentDpiIndex;
    console.log('_loadingId', _loadingId);
    setDPI(
      path,
      mode,
      {
        DPILevels: newDPILevels,
        DPIs: newDPIs,
      },
      (result) => {
        if (result) {
          getDeviceList((payload) => {
            setDeviceMap(payload as DeviceData);
            setCurrentDevice(payload[path as keyof typeof payload] || null);
          });
        }
        closeAll();
      }
    );
  };

  const handleChangeDpiLed = (index: number, hex: string) => {
    const _loadingId = openConfigLoading({ proccess: 0 });
    const newDPILEDs = configData?.DPILEDs.map((led, i) => {
      if (i === index) {
        return { ...led, Value: hex };
      }
      return led;
    });
    console.log('_loadingId', _loadingId);
    setConfigData(path, { ...(configData as Config), DPILEDs: newDPILEDs || [] }, () => {
      setConfigDataOnStore({ ...(configData as Config), DPILEDs: newDPILEDs || [] });
      closeAll();
    });
  };
  const findOpenDpiIndex = (num: number) => {
    let count = 0;
    for (let i = 0; i < DPIs.length; i++) {
      if (DPIs[i].Open) {
        count++;
        if (count === num) {
          console.log('i', i);
          return i;
        }
      }
    }
    return null;
  };

  return (
    <div className="dpi-config">
      <img
        src={`${baseUrl}device/${currentDevice?.Model?.ModelID}/img/mouse.png`}
        alt={currentDevice?.Model?.Name}
        className="mouse-bg"
      />
      <div className="dpi-container">
        <div>{t('dpi_adjustment')}</div>
        {DPIs.map((dpi, index) => {
          return (
            <div className="dpi-container-item" key={index}>
              <Checkbox
                checked={dpi.Open}
                size={16}
                onChange={(e) => {
                  handleSwitchOpenDpi(index, e.target.checked);
                }}
              />
              <CustomRadio
                checked={findOpenDpiIndex(DPILevels?.[mode] || 0) === index}
                onChange={() => {
                  handleChangeCurrentDpiIdx(index);
                }}
              />
              <div className="dpi-title">级别{index + 1}</div>
              <Slider
                initialValue={dpi.Value}
                onChange={(value) => {
                  handleChangeDpi(index, value);
                }}
              />
              <ColorPicker
                initialValue={configData?.DPILEDs[index].Value || ''}
                onChange={(hex) => handleChangeDpiLed(index, hex)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DpiConfig;
