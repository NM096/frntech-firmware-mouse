import React, { useRef, useEffect, useState, useCallback } from 'react';
import Mouse from './KeyFeature/Mouse';
import Macro from './KeyFeature/Macro';
import Keyboard from './KeyFeature/Keyboard';
import KeyMouse from '@/components/common/KeyMouse';
import Keys from '@/config/keys.json';
import { setCurrentProfile } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useProfileStore } from '@/store/useProfile';
import { useTranslation } from 'react-i18next';
import { cloneDeep, debounce } from 'lodash';
import type { KeyDefine, KeyItem } from '@/types/profile';
import { setConfigData } from '@/utils/driver';
import Dropdown from '@/components/common/Dropdown';

type sidebarKey = 'Mouse' | 'Keyboard' | 'Quit' | 'Media' | 'Macro';

const KeyConfig = () => {
  const { t } = useTranslation();
  const { Mouse: mouseKeys, Quit: quitKeys, Media: mediaKeys } = Keys;
  const {
    currentModelID,
    currentDevice,
    currentConfigFileName,
    modelConfig,
    path,
    configData,
    setConfigData: setConfigDataOnStore,
  } = useBaseInfoStore();
  const { profile, setProfile } = useProfileStore();

  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<sidebarKey | null>('Mouse');
  const [currentKeyDefine, setCurrentKeyDefine] = useState<KeyDefine>();

  const keyMouseRef = useRef<HTMLDivElement | null>(null);
  const keyFeatureRef = useRef<HTMLDivElement | null>(null);
  const sideList: { key: sidebarKey; title: string }[] = [
    { key: 'Mouse', title: t('mouse_function') },
    { key: 'Keyboard', title: t('keyboard_function') },
    { key: 'Quit', title: t('shortcut_keys') },
    { key: 'Media', title: t('multimedia_control') },
    { key: 'Macro', title: t('macro_command') },
  ];

  const sidebarComponents = {
    Mouse: () => <Mouse list={mouseKeys} onChange={(value) => handleKeyChange(value)} keyDefine={currentKeyDefine} />,
    Keyboard: () => <Keyboard onChange={(define) => handleKeyChange(define)} initialShortcut={currentKeyDefine} />,
    Quit: () => <Mouse list={quitKeys} onChange={(value) => handleKeyChange(value)} keyDefine={currentKeyDefine} />,
    Media: () => <Mouse list={mediaKeys} onChange={(value) => handleKeyChange(value)} keyDefine={currentKeyDefine} />,
    Macro: () => (
      <Macro onChange={(value) => handleKeyChange(value)} confirm={handleSettingKey} initialMacro={currentKeyDefine} />
    ),
  };

  const handleKeyChange = (key: KeyItem) => {
    setCurrentKeyDefine((prev) => {
      const newKeyDefine = prev ? { ...prev, ...key } : undefined;
      if (key?.Value !== '0x8000' && key?.Value !== '0x2000') {
        handleSettingKey(newKeyDefine);
      } else if (key?.Value === '0x8000' && key?.Macro?.Name && key?.Macro?.Category) {
        handleSettingKey(newKeyDefine);
      }
      return newKeyDefine;
    });
  };

  const handleSettingKey = debounce((currentKeyDefine: KeyDefine) => {
    const _profile = cloneDeep(profile);
    const currentKeySet = _profile?.KeySet[currentDevice?.Info?.Mode || 0];
    const newKeySet = currentKeySet.map((keyDefines) =>
      keyDefines.Index == activeKey ? { ...currentKeyDefine, Index: activeKey } : keyDefines
    );
    _profile.KeySet[currentDevice?.Info?.Mode || 0] = newKeySet;
    setCurrentProfile(currentModelID, currentConfigFileName, _profile, (payload) => {
      if (payload) {
        setProfile(_profile);
        useProfileStore.getState().updateProfile();
      }
    });
  }, 500);

  const snipeDPIList = useCallback(() => {
    const { SensorInfo } = currentDevice?.Info || {};
    if (SensorInfo != null && SensorInfo.DPIType != 0) {
      return SensorInfo?.DPIs || [];
    } else {
      return modelConfig?.SensorInfo?.DPIs || [];
    }
  }, [currentDevice, modelConfig]);

  const handleSettingSnipeDPI = (dpi: string) => {
    const _dpiList = snipeDPIList();
    const currentDpiItem = _dpiList.find((item) => item.DPI === dpi);
    const _newConfig = cloneDeep(configData);
    // mouse_kf_advance_snipe_dpi_sub
    if (currentKeyDefine?.Value == '0x480A') {
      _newConfig.SnipeDPISub = currentDpiItem;
    } else {
      _newConfig.SnipeDPIAdd = currentDpiItem;
    }
    setConfigData(path, _newConfig, () => {
      setConfigDataOnStore(_newConfig);
    });
  };

  useEffect(() => {
    if (activeKey == null) return;
    const keySet = profile.KeySet[currentDevice?.Info?.Mode || 0];
    const keyDefine = keySet.find((key) => key.Index == activeKey);
    setCurrentKeyDefine(cloneDeep(keyDefine));

    if (keyDefine?.Value) {
      if (mouseKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Mouse');
      if (quitKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Quit');
      if (mediaKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Media');
      if ('0x8000' === keyDefine.Value) setActiveSidebar('Macro');
      if (keyDefine.Lang.includes('(combination_Key)')) setActiveSidebar('Keyboard');
    }
  }, [activeKey, profile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // 如果点击不在 keyMouseRef 内部
      if (keyMouseRef.current && !keyMouseRef.current.contains(target) && !keyFeatureRef.current?.contains(target)) {
        setActiveKey(null);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div className="key-config-container">
      <div className="key-config-mouse" ref={keyMouseRef}>
        <KeyMouse activeKey={activeKey} onKeySelect={(keyIndex) => setActiveKey(keyIndex)} />
      </div>

      {activeKey !== null && activeSidebar && (
        <div className="key-config-content" ref={keyFeatureRef}>
          <div className="key-config-section">
            <div className="key-config-section-features">
              {sideList.map((item) => (
                <div
                  key={item.key}
                  className={activeSidebar === item.key ? 'active' : ''}
                  onClick={() => setActiveSidebar(item.key)}
                >
                  {item.title}
                </div>
              ))}
            </div>
            <div className="key-config-section-option">
              {currentKeyDefine?.Value.includes('0x43') && (
                <div className="mouse_fire_key">
                  <div>火力值:</div>
                  <input
                    type="number"
                    min={0}
                    max={256}
                    value={parseInt(currentKeyDefine.Value.split('0x43')[1] || '0', 16)}
                    onChange={(e) => {
                      const currentValue = Math.min(256, Math.max(0, Number(e.target.value))) || 0;
                      handleKeyChange({ ...currentKeyDefine, Value: `0x43${currentValue.toString(16)}` });
                    }}
                    className="mouse-fire-input"
                  />
                </div>
              )}
              {['0x480A', '0x480B'].includes(currentKeyDefine?.Value || '') && (
                <div className="advance_snipe_dpi_plus">
                  <div>狙击DPI:</div>
                  <Dropdown
                    borderColor="#ff7f0e"
                    options={snipeDPIList().map((dpi) => dpi.DPI)}
                    defaultValue={
                      currentKeyDefine?.Value == '0x480A'
                        ? configData?.SnipeDPISub?.DPI !== undefined
                          ? configData?.SnipeDPISub?.DPI.toString()
                          : snipeDPIList()[0]?.DPI.toString()
                        : configData?.SnipeDPIPlus?.DPI !== undefined
                          ? configData?.SnipeDPIPlus?.DPI.toString()
                          : snipeDPIList()[0]?.DPI.toString()
                    }
                    onChange={(dpi) => {
                      handleSettingSnipeDPI(dpi);
                    }}
                    size="small" // 选择 'small', 'medium' 或 'large'
                  />
                </div>
              )}
            </div>
          </div>
          <div className="key-config-feature-list">{sidebarComponents[activeSidebar]?.() || null}</div>
        </div>
      )}
    </div>
  );
};

export default KeyConfig;
