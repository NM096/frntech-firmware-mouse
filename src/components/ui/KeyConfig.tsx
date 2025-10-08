import React, { useRef, useEffect, useState } from 'react';
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

type sidebarKey = 'Mouse' | 'Keyboard' | 'Quit' | 'Media' | 'Macro';

const KeyConfig = () => {
  const { t } = useTranslation();
  const { Mouse: mouseKeys, Quit: quitKeys, Media: mediaKeys } = Keys;
  const { currentModelID, currentDevice, currentConfigFileName } = useBaseInfoStore();
  const { profile, setProfile } = useProfileStore();

  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<sidebarKey | null>('Mouse');
  const [currentKeyDefine, setCurrentKeyDefine] = useState<KeyDefine>();

  // 👉 新增：ref 用于检测点击是否在 KeyMouse 内
  const keyMouseRef = useRef<HTMLDivElement | null>(null);

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
  }, 1000);

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
      if (keyDefine.Lang.includes('[combination_Key]')) setActiveSidebar('Keyboard');
    }
  }, [activeKey, profile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // 如果点击不在 keyMouseRef 内部
      if (keyMouseRef.current && !keyMouseRef.current.contains(target)) {
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
        <div className="key-config-content">
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
          </div>
          <div className="key-config-feature-list">{sidebarComponents[activeSidebar]?.() || null}</div>
        </div>
      )}
    </div>
  );
};

export default KeyConfig;
