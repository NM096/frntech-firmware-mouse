import CustomRadio from '../common/CustomRadio';
import HoverImage from '../common/HoverImage';
import Slider2 from '../common/Slider2';
import { Switch } from '../common/Switch';
import ic_window from '@/assets/windows_1.png';
import ic_window2 from '@/assets/windows_2.png';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useEffect, useState } from 'react';
import type { AdvanceSetting } from '@/types/device-data';
import { setReportRate, setAdvanceSetting as sendAdvanceSetting, openMouseProperties } from '@/utils/driver';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
const PerformanceConfig = () => {
  const { t } = useTranslation();
  const sleepTime = ['10', '30', '60', '120', '180', '300', '600'];
  const deepSleepTime = ['5', '10', '15', '20', '30', '60'];
  const silentAltitudes = ['1 MM', '2 MM', '3 MM', '4 MM'];
  const rateList = ['125Hz', '250Hz', '500Hz', '1000Hz'];

  const { currentDevice, path, mode, setCurrentDevice, modelConfig } = useBaseInfoStore();

  const { AdvanceSetting } = currentDevice?.Info || {};
  const [advanceSetting, setAdvanceSetting] = useState<AdvanceSetting | undefined>(AdvanceSetting);
  const [usbReport, setUsbReport] = useState(currentDevice?.Info?.USBReports?.[mode] || 0);
  //
  const handleChangeUsbReport = (index: number) => {
    const { USBReports, WLReports } = currentDevice?.Info || {};
    setUsbReport(index);
    const newUsbReport = USBReports || [0, 0, 0, 0];
    newUsbReport[mode] = index;
    setReportRate(
      path,
      {
        USBReports: newUsbReport,
        WLReports: WLReports || [0, 0, 0, 0],
      },
      (payload) => {
        if (payload) {
          setCurrentDevice({
            ...currentDevice,
            ...{ Info: { ...currentDevice?.Info, ...{ USBReports: newUsbReport } } },
          } as any);
        }
      }
    );
  };
  const handleChangeltitude = (name: string, value: number | boolean) => {
    const newAdvanceSetting = cloneDeep({ ...advanceSetting, [name]: value });
    setAdvanceSetting(newAdvanceSetting);
    sendAdvanceSetting(path, newAdvanceSetting, (payload) => {
      if (payload) {
        setCurrentDevice({
          ...currentDevice,
          ...{ Info: { ...currentDevice?.Info, ...{ AdvanceSetting: newAdvanceSetting } } },
        } as any);
      }
    });
  };

  const handleOpenMouseProperty = () => {
    openMouseProperties();
  };
  useEffect(() => {
    setAdvanceSetting(currentDevice?.Info?.AdvanceSetting);
    setUsbReport(currentDevice?.Info?.USBReports?.[mode] || 0);
  }, [currentDevice]);

  return (
    <div className="performance-config">
      <div className="performance-section">
        {modelConfig?.Advance?.RippleControl && (
          <div className="performance-item">
            <div className="performance-item-title">{t('report_rate_settings')}</div>
            <div className="performance-item-description">{t('wired_and_wireless_mode_polling_rate')}</div>
            <div className="performance-radio-group">
              {rateList.map((rate, index) => (
                <div className="performance-radio-item" key={index}>
                  <CustomRadio checked={usbReport === index} onChange={() => handleChangeUsbReport(index)} />
                  {rate}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="performance-item">
          <div className="performance-item-title">{t('primary_sleep_time_settings')}</div>
          <div className="performance-item-description">
            {t('mouse_static_greater_than_set_time_enter_sleep_state')}
          </div>
          <Slider2
            min={0}
            max={sleepTime.length - 1}
            data={sleepTime}
            step={1}
            initialValue={advanceSetting?.WLPrimarySleep}
            onChange={(value) => handleChangeltitude('WLPrimarySleep', value)}
          />
        </div>
        <div className="performance-item">
          <div className="performance-item-title">{t('deep_sleep_time_settings')}</div>
          <div className="performance-item-description">{t('mouse_stop_enter_sleep_state')}</div>
          <Slider2
            min={0}
            max={deepSleepTime.length - 1}
            data={deepSleepTime}
            step={1}
            initialValue={advanceSetting?.WLDeepSleep}
            onChange={(value) => handleChangeltitude('WLDeepSleep', value)}
          />
        </div>
      </div>
      <div className="performance-section">
        {modelConfig?.Advance?.UltraLowDelay && (
          <div className="performance-item">
            <div className="performance-item-title">{t('ultralow_delay_title')}</div>
            <div className="performance-item-description">
              {t('ultralow_delay_desc')}
              <Switch
                checked={advanceSetting?.UltraLowDelay}
                onChange={() => handleChangeltitude('UltraLowDelay', !advanceSetting?.UltraLowDelay)}
              />
            </div>
          </div>
        )}
        {modelConfig?.Advance?.UltraLowPower && (
          <div className="performance-item">
            <div className="performance-item-title">{t('ultralow_power_title')}</div>
            <div className="performance-item-description">
              {t('ultralow_power_desc')}
              <Switch
                checked={advanceSetting?.UltraLowPower}
                onChange={() => handleChangeltitude('UltraLowPower', !advanceSetting?.UltraLowPower)}
              />
            </div>
          </div>
        )}
        {modelConfig?.Advance?.RippleControl && (
          <div className="performance-item">
            <div className="performance-item-title">{t('ripple_control_title')}</div>
            <div className="performance-item-description">
              {t('ripple_control_desc')}
              <Switch
                checked={advanceSetting?.RippleControl}
                onChange={() => handleChangeltitude('RippleControl', !advanceSetting?.RippleControl)}
              />
            </div>
          </div>
        )}
        {modelConfig?.Advance?.MoveWakeUp && (
          <div className="performance-item">
            <div className="performance-item-title">{t('move_wakeup_title')}</div>
            <div className="performance-item-description">
              {t('move_wakeup_desc')}
              <Switch
                checked={advanceSetting?.MoveWakeUp}
                onChange={() => handleChangeltitude('MoveWakeUp', !advanceSetting?.MoveWakeUp)}
              />
            </div>
          </div>
        )}
        {modelConfig?.Advance?.SilentAltitude && (
          <div className="performance-item">
            <div className="performance-item-title">{t('silent_altitude_title')}</div>
            <div className="performance-item-description">{t('silent_altitude_desc')}</div>
            <div className="performance-radio-group">
              {silentAltitudes.map((i, idx) => {
                return (
                  <div className="performance-radio-item" key={i}>
                    <CustomRadio
                      checked={idx == advanceSetting?.SilentAltitude}
                      onChange={() => handleChangeltitude('SilentAltitude', idx)}
                    />
                    {i}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="performance-item">
          <div className="performance-item-title">{t('mouse_property_title')}</div>
          <div className="performance-item-description">{t('mouse_property_desc')}</div>
          <div className="performance-item-open" onClick={() => handleOpenMouseProperty()}>
            <HoverImage src={ic_window} hoverSrc={ic_window2} alt="Reset" className="icon-7" />
            {t('open_mouse_property')}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PerformanceConfig;
