import React, { useEffect, useState, useMemo } from 'react';

import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { KeyDefine } from '@/types/profile';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { getModelKeyMap } from '@/utils/driver';
import type { KeyMapItem } from '@/types/profile';
import { useProfileStore } from '@/store/useProfile';
const baseUrl = import.meta.env.BASE_URL;

interface Key {
  index: number;
  label: string;
  style: React.CSSProperties;
  Lang?: string;
  Value?: string;
  Show?: string;
}

interface KeyMouseProps {
  // keyDefines: KeyDefine[];
  activeKey: number | null;
  onKeySelect?: (keyIndex: number) => void;
}
const KeyMouse: React.FC<KeyMouseProps> = ({ activeKey, onKeySelect }) => {
  const { t } = useTranslation();
  const { currentDevice, currentModelID } = useBaseInfoStore();
  const { profile } = useProfileStore();
  const keyDefines = useMemo(() => {
    return profile?.KeySet?.[currentDevice?.Info?.Mode || 0];
  }, [profile, currentDevice?.Info?.Mode]);
  const [initKeys, setInitKeys] = useState<KeyMapItem[]>([]);
  const [keys, setKeys] = useState<Key[]>([]);
  useEffect(() => {
    if (!currentModelID) return;
    getModelKeyMap(currentModelID, (keymap) => {
      setInitKeys(keymap);
    });
  }, [currentModelID]);
  useEffect(() => {
    console.log('Updating keys with keys:', keys);
    console.log('Updating keys with initKeys:', initKeys);
    console.log('Updating keys with keyDefines:', keyDefines);
    if (!keyDefines || initKeys.length == 0) return;
    const newKeys = cloneDeep(initKeys).map((item) => {
      const keyDefine = keyDefines.find((keyDefine) => Number(keyDefine.Index) == Number(item.LocationCode));
      return {
        index: item.LogicCode,
        label: item.Show,
        style: {
          position: 'absolute',
          left: `${item.Position.Left}%`,
          top: `${item.Position.Top}%`,
        },
        Lang: keyDefine?.Lang,
      };
    });
    setKeys(newKeys);
    console.log('Updated keys:', newKeys);
  }, [keyDefines, initKeys]);

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
            {key?.Value === '0x8000'
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
