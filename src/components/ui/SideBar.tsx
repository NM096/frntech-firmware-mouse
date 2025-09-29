import HoverImage from '@/components/common/HoverImage';
import wireless_4k from '@/assets/wireless_4k.png';
import back2 from '@/assets/back_device_2.png';
import back1 from '@/assets/back_device_1.png';
// import ic_charge from '@/assets/charging.png';
// import PowerIcon from '@/components/common/PowerIcon';
import ic_battery_0 from '@/assets/battery/battery_0.png';
import ic_battery_5 from '@/assets/battery/battery_5.png';
import ic_battery_10 from '@/assets/battery/battery_10.png';
import ic_battery_25 from '@/assets/battery/battery_25.png';
import ic_battery_50 from '@/assets/battery/battery_50.png';
import ic_battery_75 from '@/assets/battery/battery_75.png';
import ic_battery_100 from '@/assets/battery/battery_100.png';
import ic_battery_charginng from '@/assets/battery/battery_charging.png';

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

const batteryIcons = {
  0: ic_battery_0,
  5: ic_battery_5,
  10: ic_battery_10,
  25: ic_battery_25,
  50: ic_battery_50,
  75: ic_battery_75,
  100: ic_battery_100,
};

const SideBar: React.FC<SideBarProps> = ({ sideList = [], activeSidebar, onSidebarChange }) => {
  const { t } = useTranslation();
  const { clearCurrentDevice, currentDevice } = useBaseInfoStore();
  const { Battery, Charge } = currentDevice?.Info?.Mouse || {};
  const { RFDevice } = currentDevice || {};
  const getBatteryIcon = () => {
    if (Charge || !RFDevice) {
      return ic_battery_charginng;
    } else {
      const batteryLevels = Object.keys(batteryIcons)
        .map(Number)
        .sort((a, b) => a - b);
      const battery = Battery ?? 0;
      const matchedLevel = batteryLevels.reduce((prev, curr) => (curr <= battery ? curr : prev), batteryLevels[0]);
      return batteryIcons[matchedLevel];
    }
  };
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
              <img src={getBatteryIcon()} alt="battery" className="sidebar-icon-connection" />
              {/* <HoverImage src={ic_charge} hoverSrc={ic_charge} alt="Logo" className="sidebar-icon-connection" /> */}
              {!RFDevice ? t('charging') : t('used_battery')}
            </div>
            <div className="sidebar-item-connection">
              <HoverImage src={wireless_4k} hoverSrc={wireless_4k} alt="Logo" className="sidebar-icon-connection" />
              {!RFDevice ? t('wired_connection') : t('two_point_four_g_connection')}
            </div>
          </div>
          {/* sidebar list */}
          <div className="sidebar-item">
            {sideList.map((item, index) => {
              return (
                <div
                  data-block-click
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
