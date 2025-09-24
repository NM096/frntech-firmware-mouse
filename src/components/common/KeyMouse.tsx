import React, { useEffect, useState, useMemo } from 'react';

import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { KeyDefine } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { getModelKeyMap } from '@/utils/driver';
const baseUrl = import.meta.env.BASE_URL;

interface Key {
  index: number;
  label: string;
  style: React.CSSProperties;
  Lang?: string;
}

interface KeyMouseProps {
  keyDefines: KeyDefine[];
  activeKey: number | null;
  onKeySelect?: (keyIndex: number) => void;
}
const KeyMouse: React.FC<KeyMouseProps> = ({ keyDefines, activeKey, onKeySelect }) => {
  const { t } = useTranslation();
  const { currentDevice, currentModelID } = useBaseInfoStore();

  const baseKeys: Key[] = [
    // { index: 0, label: '左键', Lang: 'mouse_kf_left', style: { position: 'absolute', left: '9%', top: '27%' } },
    // { index: 1, label: '右键', Lang: 'mouse_kf_right', style: { position: 'absolute', left: '90%', top: '27%' } },
    // { index: 2, label: '中键', Lang: 'mouse_kf_middle', style: { position: 'absolute', left: '90%', top: '4%' } },
    // { index: 3, label: '后退', Lang: 'mouse_kf_back', style: { position: 'absolute', left: '9%', top: '69%' } },
    // { index: 4, label: '前进', Lang: 'mouse_kf_forward', style: { position: 'absolute', left: '9%', top: '43%' } },
  ];

  const [keys, setKeys] = useState<(Key & Partial<KeyDefine>)[]>(cloneDeep(baseKeys));
  useEffect(() => {
    console.log('Updating keys with keys:', keys);
    console.log('Updating keys with keyDefines:', keyDefines);
    if (!keyDefines || keys.length == 0) return;

    const newKeys = cloneDeep(keys).map((item) => {
      const keyDefine = keyDefines.find((keyDefine) => Number(keyDefine.Index) == Number(item.index));
      return {
        ...item,
        ...keyDefine,
      };
    });
    console.log('New keys after merging with keyDefines:', newKeys);
    setKeys(newKeys);
  }, [keyDefines]);

  useEffect(() => {
    if (!currentModelID) return;
    getModelKeyMap(currentModelID, (keymap) => {
      setKeys(
        keymap.map((item) => ({
          index: item.LogicCode,
          label: item.Show,
          style: {
            position: 'absolute',
            left: `${item.Position.Left}%`,
            top: `${item.Position.Top}%`,
          },
          Lang: item.KeyName,
        }))
      );
    });
  }, [currentModelID]);

  return (
    <div style={{ position: 'relative', width: '100%', fontSize: '0.9rem' }}>
      <img
        src={`${baseUrl}device/${currentDevice?.Model?.ModelID}/img/mouse_keys.png`}
        alt={currentDevice?.Model?.Name}
        style={{ width: '100%' }}
      />
      <div>
        {keys.map((key, index) => (
          <div
            key={index + (key?.Lang ?? '')}
            style={key.style}
            className={`key-mouse-label ${activeKey === key.index ? 'active' : ''}`}
            onClick={() => {
              console.log(key, 'key.index');
              onKeySelect?.(key.index);
            }}
          >
            {key.Value === '0x8000'
              ? `${t('mouse_kf_macro')}-${key.Show}`
              : key?.Lang?.includes('[combination_Key]')
                ? key.Show
                : t(key?.Lang || '')}
          </div>
        ))}
      </div>
    </div>
  );
};
export default KeyMouse;
