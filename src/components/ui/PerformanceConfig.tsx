import React from 'react';
import HoverImage from '../common/HoverImage';
import Slider2 from '../common/Slider2';
import { Switch } from '../common/Switch';
import CustomRadio from '../common/CustomRadio';
import ic_window from '@/assets/windows_1.png';
import ic_window2 from '@/assets/windows_2.png';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useProfileStore } from '@/store/useProfile';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import type { AdvanceSetting } from '@/types/device-data';
import { setReportRate, setAdvanceSetting, openMouseProperties, setCurrentProfile } from '@/utils/driver';
const PerformanceConfig = () => {
  const { t } = useTranslation();
  const sleepTime = ['10', '30', '60', '120', '180', '300', '600'];
  const deepSleepTime = ['5', '10', '15', '20', '30', '40', '60'];
  const silentAltitudes = ['1 MM', '2 MM', '3 MM', '4 MM'];
  const rateList = ['125Hz', '250Hz', '500Hz', '1000Hz'];

  const { currentDevice, path, mode, setCurrentDevice, modelConfig, currentModelID, currentConfigFileName } =
    useBaseInfoStore();
  const { profile, setProfile } = useProfileStore();
  const { USBReports, AdvanceSetting } = profile;
  // const { AdvanceSetting } = currentDevice?.Info || {};
  // const [AdvanceSetting, setAdvanceSetting] = useState<AdvanceSetting | undefined>(AdvanceSetting);
  // const [usbReport, setUsbReport] = useState(currentDevice?.Info?.USBReports?.[mode] || 0);
  //
  const handleChangeUsbReport = (index: number) => {
    const { USBReports, WLReports } = currentDevice?.Info || {};
    const newUsbReport = USBReports ? [...USBReports] : [0, 0, 0, 0];
    newUsbReport[mode] = index;
    
    // 立即更新profile以反映UI变化
    const updatedProfile = {
      ...profile,
      ...{ USBReports: newUsbReport },
    };
    setProfile(updatedProfile);
    
    setReportRate(
      path,
      {
        USBReports: newUsbReport,
        WLReports: WLReports || [0, 0, 0, 0],
      },
      (payload) => {
        if (payload) {
          setCurrentProfile(currentModelID, currentConfigFileName, updatedProfile);
          setCurrentDevice({
            ...currentDevice,
            ...{ Info: { ...currentDevice?.Info, ...{ USBReports: newUsbReport } } },
          } as any);
        }
      }
    );
  };
  const handleChangeAltitude = (name: string, value: number | boolean) => {
    const newAdvanceSetting = cloneDeep({ ...AdvanceSetting, [name]: value });
    
    // 立即更新profile以确保UI立即反映变化
    const updatedProfile = {
      ...profile,
      ...{ AdvanceSetting: newAdvanceSetting },
    };
    setProfile(updatedProfile);
    
    setAdvanceSetting(path, newAdvanceSetting, (payload) => {
      if (payload) {
        // 然后保存到设备和配置
        setCurrentProfile(currentModelID, currentConfigFileName, updatedProfile);
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
                  <CustomRadio
                    checked={USBReports ? USBReports[mode] === index : false}
                    onChange={() => handleChangeUsbReport(index)}
                  />
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
            initialValue={AdvanceSetting?.WLPrimarySleep || 2}
            onChange={(value) => handleChangeAltitude('WLPrimarySleep', value)}
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
            initialValue={AdvanceSetting?.WLDeepSleep || 4}
            onChange={(value) => handleChangeAltitude('WLDeepSleep', value)}
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
                checked={AdvanceSetting?.UltraLowDelay || false}
                onChange={() => handleChangeAltitude('UltraLowDelay', !AdvanceSetting?.UltraLowDelay)}
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
                checked={AdvanceSetting?.UltraLowPower || false}
                onChange={() => handleChangeAltitude('UltraLowPower', !AdvanceSetting?.UltraLowPower)}
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
                checked={AdvanceSetting?.RippleControl || false}
                onChange={() => handleChangeAltitude('RippleControl', !AdvanceSetting?.RippleControl)}
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
                checked={AdvanceSetting?.MoveWakeUp || false}
                onChange={() => handleChangeAltitude('MoveWakeUp', !AdvanceSetting?.MoveWakeUp)}
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
                      checked={idx === (AdvanceSetting?.SilentAltitude || 0)}
                      onChange={() => handleChangeAltitude('SilentAltitude', idx)}
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
