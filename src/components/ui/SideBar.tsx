import HoverImage from '@/components/common/HoverImage';
import wireless_4k from '@/assets/wireless_4k.png';
import back2 from '@/assets/back_device_2.png';
import back1 from '@/assets/back_device_1.png';
import ic_charge from '@/assets/charging.png';
import PowerIcon from '@/components/common/PowerIcon';
import type { sidebarKey } from './Feature';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useTranslation } from 'react-i18next';
interface SideBarProps {
  sideList?: {
    key: sidebarKey;
    title: string;
    icon: string;
  }[];
  activeSidebar?: sidebarKey;
  onSidebarChange: (key: sidebarKey) => void;
}

const SideBar: React.FC<SideBarProps> = ({ sideList = [], activeSidebar, onSidebarChange }) => {
  const { t } = useTranslation();
  const { clearCurrentDevice } = useBaseInfoStore();
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-back">
          <div className="back-btn" onClick={clearCurrentDevice}>
            <HoverImage src={back1} hoverSrc={back2} alt="Logo" className="back-btn-icon" />
            {t('back_to_device_selection')}
          </div>
        </div>

        <div className="sidebar-content">
          {/* connection info */}
          <div className="sidebar-item-status">
            <div className="sidebar-item-power">
              <HoverImage src={ic_charge} hoverSrc={ic_charge} alt="Logo" className="sidebar-icon-connection" />
              {t('charging')}
            </div>
            <div className="sidebar-item-connection">
              <HoverImage src={wireless_4k} hoverSrc={wireless_4k} alt="Logo" className="sidebar-icon-connection" />
              {t('wired_connection')}
            </div>
          </div>
          {/* sidebar list */}
          <div className="sidebar-item">
            {sideList.map((item, index) => {
              return (
                <div
                  className={`sidebar-list-item ${activeSidebar === item.key ? 'active' : ''}`}
                  key={index}
                  onClick={() => onSidebarChange(item.key)}
                >
                  <div className="sidebar-item-title">{item.title}</div>
                  <HoverImage
                    src={item.icon}
                    hoverSrc={item.icon}
                    alt={item.title}
                    className="sidebar-icon-connection"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default SideBar;
