import React from 'react';
import Mouse from './KeyFeature/Mouse';
import Macro from './KeyFeature/Macro';
import Keyboard from './KeyFeature/Keyboard';
import KeyMouse from '@/components/common/KeyMouse';
import { useRef, useEffect, useState } from 'react';
import Keys from '@/config/keys.json';
import { setCurrentProfile, apply } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useProfileStore } from '@/store/useProfile';
import { useTranslation } from 'react-i18next';
import { cloneDeep, debounce } from 'lodash';
import type { KeyDefine, KeyItem } from '@/types/profile';
type sidebarKey = 'Mouse' | 'Keyboard' | 'Quit' | 'Media' | 'Macro';

const KeyConfig = () => {
  const { t } = useTranslation();
  const { Mouse: mouseKeys, Quit: quitKeys, Media: mediaKeys } = Keys;
  const { currentModelID, currentDevice: storeCurrentDevice, path, currentConfigFileName } = useBaseInfoStore();
  const [currentDevice, setCurrentDevice] = useState(storeCurrentDevice);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<sidebarKey>('Mouse');
  const [currentKeyDefine, setCurrentKeyDefine] = useState<KeyDefine>();
  const { profile: storeProfile, setProfile: storeSetProfile } = useProfileStore();
  const [profile, setProfile] = useState(storeProfile);
  const sideList: { key: sidebarKey; title: string }[] = [
    { key: 'Mouse', title: t('mouse_function') },
    { key: 'Keyboard', title: t('keyboard_function') },
    { key: 'Quit', title: t('shortcut_keys') },
    { key: 'Media', title: t('multimedia_control') },
    { key: 'Macro', title: t('macro_command') },
  ];
  const sidebarComponents = {
    Mouse: () => (
      <Mouse
        list={mouseKeys}
        onChange={(value) => {
          handleKeyChange(value);
        }}
        keyDefine={currentKeyDefine}
      />
    ),
    Keyboard: () => (
      <Keyboard
        onChange={(define) => {
          handleKeyChange(define);
        }}
        initialShortcut={currentKeyDefine}
      />
    ),
    Quit: () => (
      <Mouse
        list={quitKeys}
        onChange={(value) => {
          handleKeyChange(value);
        }}
        keyDefine={currentKeyDefine}
      />
    ),
    Media: () => (
      <Mouse
        list={mediaKeys}
        onChange={(value) => {
          handleKeyChange(value);
        }}
        keyDefine={currentKeyDefine}
      />
    ),
    Macro: () => (
      <Macro
        onChange={(value) => {
          handleKeyChange(value);
        }}
        confirm={handleSettingKey}
        initialMacro={currentKeyDefine}
      />
    ),
  };
  const handleKeyChange = (key: KeyItem) => {
    console.log(key, 'handleKeyChange');
    setCurrentKeyDefine((prev) => {
      const newKeyDefine = prev ? { ...prev, ...key } : undefined;
      if (key?.Value !== '0x8000' && key?.Value !== '0x2000') {
        handleSettingKey(newKeyDefine);
      } else {
        if (key?.Value == '0x8000' && key?.Macro && key?.Macro?.Name && key?.Macro?.Category) {
          handleSettingKey(newKeyDefine);
        }
      }
      return newKeyDefine;
    });
  };

  const handleSettingKey = debounce((currentKeyDefine: KeyDefine) => {
    const _profile = cloneDeep(profile);
    const currentKeySet = _profile?.KeySet[currentDevice?.Info?.Mode || 0];
    const newKeySet = currentKeySet.map((keyDefines) => {
      if (keyDefines.Index == activeKey) {
        return {
          ...currentKeyDefine,
          Index: activeKey,
        };
      }
      return keyDefines;
    });
    _profile.KeySet[currentDevice?.Info?.Mode || 0] = newKeySet;

    apply(path, _profile, () => {
      setCurrentProfile(currentModelID, currentConfigFileName, _profile, (payload) => {
        if (payload) {
          storeSetProfile(_profile);
        }
      });
    });
  }, 1000);

  // 同步Key 按键默认值
  useEffect(() => {
    if (activeKey == null) return;
    const keySet = profile.KeySet[currentDevice?.Info?.Mode || 0];
    const keyDefine = keySet.find((key) => key.Index == activeKey);
    setCurrentKeyDefine(cloneDeep(keyDefine));
    // 选择菜单
    if (keyDefine?.Value) {
      if (mouseKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Mouse');
      if (quitKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Quit');
      if (mediaKeys.some((i) => i.Lang === keyDefine.Lang)) setActiveSidebar('Media');
      if ('0x8000' === keyDefine.Value) setActiveSidebar('Macro');
      if (keyDefine.Lang.includes('[combination_Key]')) setActiveSidebar('Keyboard');
    }
  }, [activeKey]);

  useEffect(() => {
    setCurrentDevice(storeCurrentDevice);
  }, [storeCurrentDevice]);
  useEffect(() => {
    setProfile(cloneDeep(storeProfile));
  }, [storeProfile]);
  return (
    <div className="key-config-container">
      <div className="key-config-mouse">
        <KeyMouse
          activeKey={activeKey}
          onKeySelect={(keyIndex) => {
            setActiveKey(keyIndex);
          }}
          keyDefines={profile?.KeySet?.[currentDevice?.Info?.Mode || 0] || []}
        />
      </div>
      {activeKey !== null && (
        <div className="key-config-content">
          <div className="key-config-section">
            <div className="key-config-section-features">
              {sideList.map((item) => {
                return (
                  <div
                    key={item.key}
                    className={activeSidebar === item.key ? 'active' : ''}
                    onClick={() => {
                      setActiveSidebar(item.key);
                    }}
                  >
                    {item.title}
                  </div>
                );
              })}
            </div>
            {/* <div className="key-config-section-actions">
              <div onClick={() => handleSettingKey()}>{t('apply')}</div>
              <div onClick={() => setActiveKey(null)}>{t('cancel')}</div>
            </div> */}
          </div>
          <div className="key-config-feature-list">{sidebarComponents[activeSidebar]() || null}</div>
        </div>
      )}
    </div>
  );
};
export default KeyConfig;
