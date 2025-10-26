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
import { useModal } from '../common/ModalContext';

type sidebarKey = 'Mouse' | 'Keyboard' | 'Shortcut' | 'Media' | 'Macro';

const KeyConfig = () => {
  const { t } = useTranslation();
  const { Mouse: mouseKeys, Shortcut: shortcutKeys, Media: mediaKeys } = Keys;
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
  const { openAlert } = useModal();

  const keyMouseRef = useRef<HTMLDivElement | null>(null);
  const keyFeatureRef = useRef<HTMLDivElement | null>(null);
  const sideList: { key: sidebarKey; title: string }[] = [
    { key: 'Mouse', title: t('mouse_function') },
    { key: 'Keyboard', title: t('keyboard_function') },
    { key: 'Shortcut', title: t('shortcut_keys') },
    { key: 'Media', title: t('multimedia_control') },
    { key: 'Macro', title: t('macro_command') },
  ];

  const sidebarComponents = {
    Mouse: () => <Mouse list={mouseKeys} onChange={(value) => handleKeyChange(value)} keyDefine={currentKeyDefine} />,
    Keyboard: () => <Keyboard onChange={(define) => handleKeyChange(define)} initialShortcut={currentKeyDefine} />,
    Shortcut: () => <Mouse list={shortcutKeys} onChange={(value) => handleKeyChange(value)} keyDefine={currentKeyDefine} />,
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
    if (currentKeyDefine?.Value == '0x480A') {
      _newConfig.SnipeDPIPlus = currentDpiItem;
    } else {
      _newConfig.SnipeDPISub = currentDpiItem;
    }
    setConfigData(path, _newConfig, () => {
      setConfigDataOnStore(_newConfig);
    });
  };
  const handleSelectCurrentKey = (keyIndex: number) => {
    const keySet = profile.KeySet[currentDevice?.Info?.Mode || 0];
    const leftClickLength = keySet.filter((key) => key.Value == '0x4181').length;
    const currentKeySet = keySet.find((key) => key.Index == keyIndex);
    if (leftClickLength <= 1 && currentKeySet?.Value == '0x4181') {
      openAlert({
        title: t('warning'),
        content: t('at_least_one_left_click'),
      });
      return;
    }
    setActiveKey(keyIndex);
  };

  useEffect(() => {
    if (activeKey == null) return;
    const keySet = profile.KeySet[currentDevice?.Info?.Mode || 0];
    const keyDefine = keySet.find((key) => key.Index == activeKey);
    setCurrentKeyDefine(cloneDeep(keyDefine));

    if (keyDefine?.Value) {
      if (mouseKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Mouse');
      if (shortcutKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Shortcut');
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
        <KeyMouse activeKey={activeKey} onKeySelect={(keyIndex) => handleSelectCurrentKey(keyIndex)} />
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
              {currentKeyDefine?.Value.includes('0x43') && activeSidebar === 'Mouse' && (
                <div className="mouse_fire_key">
                  <div>{t('firepower')}:</div>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={parseInt(currentKeyDefine.Value.split('0x43')[1] || '0', 16)}
                    onChange={(e) => {
                      const currentValue = Math.min(200, Math.max(0, Number(e.target.value))) || 0;
                      handleKeyChange({
                        ...currentKeyDefine,
                        Value: `0x43${currentValue.toString(16).padStart(2, '0')}`,
                      });
                    }}
                    className="mouse-fire-input"
                  />
                </div>
              )}
              {['0x480A', '0x480B'].includes(currentKeyDefine?.Value || '') && activeSidebar === 'Shortcut' && (
                <div className="advance_snipe_dpi_plus">
                  <div>{t('snipe_dpi')}:</div>
                  {currentKeyDefine?.Value == '0x480A' && (
                    <Dropdown
                      borderColor="#ff7f0e"
                      options={snipeDPIList().map((dpi) => dpi.DPI)}
                      defaultValue={configData?.SnipeDPIPlus?.DPI.toString() && snipeDPIList()[0]?.DPI.toString()}
                      onChange={(dpi) => {
                        handleSettingSnipeDPI(dpi);
                      }}
                      size="small"
                    />
                  )}{' '}
                  {currentKeyDefine?.Value == '0x480B' && (
                    <Dropdown
                      borderColor="#ff7f0e"
                      options={snipeDPIList().map((dpi) => dpi.DPI)}
                      defaultValue={configData?.SnipeDPISub?.DPI.toString() || snipeDPIList()[0]?.DPI.toString()}
                      onChange={(dpi) => {
                        handleSettingSnipeDPI(dpi);
                      }}
                      size="small"
                    />
                  )}
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
