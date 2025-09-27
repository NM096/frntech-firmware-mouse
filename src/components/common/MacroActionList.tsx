import type { MacroEvent } from '@/types/macro';
import { useTranslation } from 'react-i18next';
import HoverImage from './HoverImage';
import keyboard_key_action from '@/assets/keyboard_key_action.png';
import macro_key_down from '@/assets/macro_key_down.png';
import macro_key_up from '@/assets/macro_key_up.png';
import ic_mouse from '@/assets/mouse.png';
import ic_time from '@/assets/time.png';
import { useEffect } from 'react';
interface MacroActionListProps {
  events: MacroEvent[];
  showDelay: boolean;
  delayMode: 'record' | 'default' | 'min';
  onSelectStep?: (index: number) => void;
  selectIndex?: number | null;
}

export default function MacroActionList({ events, delayMode, onSelectStep, selectIndex }: MacroActionListProps) {
  const { t } = useTranslation();

  const getIcon = (type: MacroEvent['type']) => {
    switch (type) {
      case 'MouseDown':
      case 'MouseUp':
        return <HoverImage src={ic_mouse} hoverSrc={ic_mouse} alt="Logo" className="back-btn-icon" />;
      case 'KeyDown':
      case 'KeyUp':
        return (
          <HoverImage src={keyboard_key_action} hoverSrc={keyboard_key_action} alt="Logo" className="back-btn-icon" />
        );
      case 'Delay':
        return <HoverImage src={ic_time} hoverSrc={ic_time} alt="Logo" className="back-btn-icon" />;
      default:
        return null;
    }
  };

  const isDown = (event: MacroEvent) => {
    return ['MouseDown', 'KeyDown'].includes(event.type) ? true : false;
  };

  useEffect(() => {
    console.log(events);
    console.log(events.filter((event) => event.type !== 'Delay'));
  }, [events]);
  return (
    <>
      {Array.isArray(events) &&
        events
          .filter((event) => event.type !== 'Delay')
          .map((event, index) => (
            <li
              className={`macro-content-item ${onSelectStep && index * 2 === (selectIndex ?? -1) ? 'selected' : ''}`}
              key={index + event.code + event.type + event.name}
              onClick={() => onSelectStep?.(index * 2)}
            >
              <span>{index + 1}</span>
              {getIcon(event.type)}
              <span>
                {/* {event.code} */}
                {events[index * 2 + 1]?.code ? (Number(events[index * 2 + 1]?.code) / 1000).toFixed(3) : '0.001'}
                {t('second')}
              </span>
              {isDown(event) ? (
                <HoverImage src={macro_key_down} hoverSrc={macro_key_down} alt="Logo" className="back-btn-icon" />
              ) : (
                <HoverImage src={macro_key_up} hoverSrc={macro_key_up} alt="Logo" className="back-btn-icon" />
              )}
              <span>{t(event.name)}</span>
            </li>
          ))}
    </>
  );
}
