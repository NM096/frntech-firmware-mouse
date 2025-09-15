import Keyboard from './KeyFeature/Keyboard';
import Mouse from './KeyFeature/Mouse';
import Macro from './KeyFeature/Macro';
import KeyMouse from '@/components/common/KeyMouse';
import { useEffect, useState } from 'react';
import Keys from '@/config/keys.json';
import { setCurrentProfile } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { KeyDefine, KeyItem } from '@/types/profile';
import { cloneDeep } from 'lodash';
import { useModal } from '@/components/common/ModalContext';
import { useProfileStore } from '@/store/useProfile';

type sidebarKey = 'Mouse' | 'Keyboard' | 'Quit' | 'Media' | 'Macro';

const KeyConfig = () => {
  const { Mouse: mouseKeys, Quit: quitKeys, Media: mediaKeys } = Keys;
  const { currentModelID, currentDevice } = useBaseInfoStore();
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<sidebarKey>('Mouse');
  const [currentKeyDefine, setCurrentKeyDefine] = useState<KeyDefine>();
  const { profile, setProfile } = useProfileStore();
  const { openConfigLoading, close } = useModal();
  const sideList: { key: sidebarKey; title: string }[] = [
    { key: 'Mouse', title: '鼠标功能' },
    { key: 'Keyboard', title: '键盘功能' },
    { key: 'Quit', title: '快捷键' },
    { key: 'Media', title: '多媒体控制' },
    { key: 'Macro', title: '宏命令' },
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
    Keyboard: () => <Keyboard />,
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
    Macro: () => <Macro />,
  };
  const handleKeyChange = (key: KeyItem) => {
    setCurrentKeyDefine((prev) => (prev ? { ...prev, ...key } : undefined));
  };

  const handleSettingKey = () => {
    const _loadingId = openConfigLoading({ proccess: 0 });
    const _profile = cloneDeep(profile);
    const currentKeySet = _profile?.KeySet[currentDevice?.Info.Mode || 0];
    const newKeySet = currentKeySet.map((keyDefines) => {
      if (keyDefines.Index == activeKey) {
        return {
          ...currentKeyDefine,
          Index: activeKey,
        };
      }
      return keyDefines;
    });
    _profile.KeySet[currentDevice?.Info.Mode || 0] = newKeySet;
    setCurrentProfile(currentModelID, _profile, (payload) => {
      if (payload) {
        setProfile(_profile);
      }
      close(_loadingId);
    });
  };
  // 同步Key 按键默认值
  useEffect(() => {
    if (activeKey == null) return;
    const keySet = profile.KeySet[currentDevice?.Info.Mode || 0];
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

  return (
    <div className="key-config-container">
      <div className="key-config-mouse">
        <KeyMouse
          activeKey={activeKey}
          onKeySelect={(keyIndex) => {
            console.log('onKeySelect ', keyIndex, currentKeyDefine);

            setActiveKey(keyIndex);
          }}
          keyDefines={profile?.KeySet[currentDevice?.Info.Mode || 0]}
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
            <div className="key-config-section-actions">
              <div onClick={() => handleSettingKey()}>应用</div>
              <div onClick={() => setActiveKey(null)}>取消</div>
            </div>
          </div>
          <div className="key-config-feature-list">{sidebarComponents[activeSidebar]() || null}</div>
        </div>
      )}
    </div>
  );
};
export default KeyConfig;
