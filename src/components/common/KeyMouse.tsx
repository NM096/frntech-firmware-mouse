import React, { useEffect, useState } from 'react';

import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import type { KeyDefine } from '@/types/profile';
import { useTranslation } from 'react-i18next';
const baseUrl = import.meta.env.BASE_URL;

interface Key {
  index: number;
  label: string;
  style: React.CSSProperties;
}

interface KeyMouseProps {
  keyDefines: KeyDefine[];
  activeKey: number | null;
  onKeySelect?: (keyIndex: number) => void;
}
const KeyMouse: React.FC<KeyMouseProps> = ({ keyDefines, activeKey, onKeySelect }) => {
  const { t } = useTranslation();
  const { currentDevice } = useBaseInfoStore();
  const [keys, setKeys] = useState<(Key & Partial<KeyDefine>)[]>([
    {
      index: 0,
      label: '左键',
      style: { position: 'absolute', left: '9%', top: '27%' },
    },
    {
      index: 1,
      label: '右键',
      style: { position: 'absolute', right: '10%', top: '27%' },
    },
    {
      index: 2,
      label: '中键',
      style: { position: 'absolute', right: '10%', top: '4%' },
    },
    {
      index: 3,
      label: '后退',
      style: { position: 'absolute', left: '9%', top: '69%' },
    },
    {
      index: 4,
      label: '前进',
      style: { position: 'absolute', left: '9%', top: '43%' },
    },
  ]);
  useEffect(() => {
    if (!keyDefines) return;
    console.log(keyDefines);
    const newKeys = keys.map((item) => {
      const keyDefine = keyDefines.find((keyDefine) => Number(keyDefine.Index) == item.index);
      return {
        ...item,
        ...keyDefine,
      };
    });
    setKeys(newKeys);
    console.log(newKeys);
  }, [keyDefines]);

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
            key={index}
            style={key.style}
            className={`key-mouse-label ${activeKey === key.index ? 'active' : ''}`}
            onClick={() => {
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
