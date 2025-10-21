import ic_battery_0 from '@/assets/battery/battery_0.png';
import ic_battery_5 from '@/assets/battery/battery_5.png';
import ic_battery_10 from '@/assets/battery/battery_10.png';
import ic_battery_25 from '@/assets/battery/battery_25.png';
import ic_battery_50 from '@/assets/battery/battery_50.png';
import ic_battery_75 from '@/assets/battery/battery_75.png';
import ic_battery_100 from '@/assets/battery/battery_100.png';
import ic_battery_charginng from '@/assets/battery/battery_charging.png';
import type { DeviceInfo } from '@/types/device-data';
const batteryIcons = {
  0: ic_battery_0,
  5: ic_battery_5,
  10: ic_battery_10,
  25: ic_battery_25,
  50: ic_battery_50,
  75: ic_battery_75,
  100: ic_battery_100,
};

const useBatteryProgress = () => {
  const getBatteryIcon = (currentDevice: DeviceInfo) => {
    const { Battery, Charge } = currentDevice?.Info?.Mouse || {};
    const { RFDevice } = currentDevice || {};
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
  return {
    getBatteryIcon,
  };
};
export default useBatteryProgress;
