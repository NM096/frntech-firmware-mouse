import React, { useEffect } from 'react';
import HoverImage from '../common/HoverImage';
import Slider2 from '../common/Slider2';
import { Switch } from '../common/Switch';
import CustomRadio from '../common/CustomRadio';
import ic_window from '@/assets/windows_1.png';
import ic_window2 from '@/assets/windows_2.png';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useProfileStore } from '@/store/useProfile';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { setReportRate, setAdvanceSetting, openMouseProperties, setCurrentProfile } from '@/utils/driver';
import type { Profile } from '@/types/profile';
const PerformanceConfig = () => {
  const { t } = useTranslation();
  const sleepTime = ['10', '30', '60', '120', '180', '300', '600'];
  const deepSleepTime = ['5', '10', '15', '20', '30', '40', '60'];
  const silentAltitudes = ['1 MM', '2 MM', '3 MM', '4 MM'];
  const rateList = ['125Hz', '250Hz', '500Hz', '1000Hz'];

  const { currentDevice, path, mode, modelConfig, currentModelID, currentConfigFileName } = useBaseInfoStore();
  const { profile, setProfile } = useProfileStore();
  const { USBReports, AdvanceSetting } = profile;

  const handleChangeUsbReport = (index: number, updateProfile?: Profile) => {
    const { USBReports, WLReports, AdvanceSetting } = updateProfile || profile || {};
    const newUsbReport = USBReports ? [...USBReports] : [0, 0, 0, 0];
    const newWLReport = USBReports ? [...USBReports] : [0, 0, 0, 0];
    newUsbReport[mode] = index;
    newWLReport[mode] = index;

    // 立即更新profile以反映UI变化 - 这是修复响应延迟的关键
    const updatedProfile = {
      ...profile,
      ...{ AdvanceSetting: AdvanceSetting, USBReports: newUsbReport, WLReports: newWLReport },
    };
    setProfile(updatedProfile);

    // 然后异步发送配置到设备
    setReportRate(
      path,
      {
        USBReports: newUsbReport,
        WLReports: newWLReport,
      },
      (payload) => {
        if (payload) {
          // 设备确认后保存到配置文件
          setCurrentProfile(currentModelID, currentConfigFileName, updatedProfile);
        }
      }
    );
  };
  const handleChangeAltitude = async (name: string, value: number | boolean) => {
    // console.log(AdvanceSetting);
    const newAdvanceSetting = cloneDeep({ ...AdvanceSetting, [name]: value });

    // 立即更新profile以确保UI立即反映变化 - 这是修复响应延迟的关键
    const updatedProfile = {
      ...profile,
      ...{ AdvanceSetting: newAdvanceSetting },
    };

    setProfile(updatedProfile);
    // 超低功耗动态更新报告率
    if (name === 'UltraLowPower' && value === true) {
      // TODO 优化 调用2次setProfile问题
      await handleChangeUsbReport(0, updatedProfile);
    }
    // 然后异步发送配置到设备
    setAdvanceSetting(path, newAdvanceSetting, (payload) => {
      if (payload) {
        // 设备确认后保存到配置文件
        setCurrentProfile(currentModelID, currentConfigFileName, updatedProfile);
      }
    });
  };

  const handleOpenMouseProperty = () => {
    openMouseProperties();
  };

  return (
    <div className="performance-config">
      <div className="performance-section">
        <div className="performance-item">
          <div className="performance-item-title">{t('report_rate_settings')}</div>
          <div className="performance-item-description">
            <div>{t('wired_and_wireless_mode_polling_rate')}</div>
          </div>
          <div className="performance-item-description">
            <div> {t('ultralow_power_rate_tips')}</div>
          </div>
          <div className="performance-radio-group">
            {rateList.map((rate, index) => (
              <div className="performance-radio-item" key={index}>
                <CustomRadio
                  disabled={AdvanceSetting?.UltraLowPower}
                  checked={USBReports ? USBReports[mode] === index : false}
                  onChange={() => handleChangeUsbReport(index)}
                />
                {rate}
              </div>
            ))}
          </div>
        </div>
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
            initialValue={AdvanceSetting?.WLPrimarySleep ?? 2}
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
            initialValue={AdvanceSetting?.WLDeepSleep ?? 4}
            onChange={(value) => handleChangeAltitude('WLDeepSleep', value)}
          />
        </div>
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
