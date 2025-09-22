import noDevice from '@/assets/no_device.png';
import { useTranslation } from 'react-i18next';
const NoDevice = () => {
  const { t } = useTranslation();
  return (
    <div className="no-device-container">
      <p className="no-device-text">
        {t('no_device_connected')} <span className="highlight">inphic</span> {t('device!')}
      </p>
      <img src={noDevice} className="no-device-img" alt="" />
    </div>
  );
};

export default NoDevice;
